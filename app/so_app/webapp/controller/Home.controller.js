sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	MessageToast,
	ColumnListItem,
	Input) {
        "use strict";

        return Controller.extend("com.sap.soapp.controller.Home", {
            onInit: function () {
                this._oTable=this.byId("table0");
                this.oEditableTemplate = new ColumnListItem({
                    cells: [
                        new Input({
                            value: "{mainModel>soNumber}",
                            change: [this.onInputChange, this]
                        }),
                        new Input({
                            value: "{mainModel>customerName}",
                            change: [this.onInputChange, this]
                        }),
                        new Input({
                            value: "{mainModel>customerNumber}",
                            change: [this.onInputChange, this]
                        }),
                        new Input({
                            value: "{mainModel>PoNumber}",
                            change: [this.onInputChange, this]
                        }),
                        new Input({
                            value: "{mainModel>inquiryNumber}",
                            change: [this.onInputChange, this]
                        }),
                    ]
                });
                this._createReadOnlyTemplate();
                this.rebindTable(this.oReadOnlyTemplate, "Navigation");
            },

		onCreate: function() {
			let oSo = this.getView().byId("idSo").getValue();
            if (oSo) {
                const oList = this._oTable;
                const oBinding = oList.getBinding("items");
                const oContext = oBinding.create({
                    "soNumber": this.byId("idSo").getValue(),
                    "customerName": this.byId("idCustName").getValue(),
                    "customerNumber": this.byId("idCustomer").getValue(),
                    "PoNumber": this.byId("idPo").getValue(),
                    "inquiryNumber": this.byId("idInqNumber").getValue()
                });
                oContext.created()
                .then(()=>{
                    this.getView().byId("OpenDialog").close();
                });
            } else {
                MessageToast.show("Sales Order Number must be filled!");
            }
		},

		onCancelDialog: function(oEvent) {
			oEvent.getSource().getParent().close();
		},

		onOpenAddDialog: function() {
			this.getView().byId("OpenDialog").open();
		},

        onEditMode: function () {
            this.byId("editModeButton").setVisible(false);
            this.byId("saveButton").setVisible(true);
            this.byId("deleteButton").setVisible(true);
            this.rebindTable(this.oEditableTemplate, "Edit");
        },

        onDelete: function() {
            var oSelected = this.byId("table0").getSelectedItem();
            if (oSelected) {
                var oSalesOrder = oSelected.getBindingContext("mainModel").getObject().soNumber;
                oSelected.getBindingContext("mainModel").delete().then(function () {
                    MessageToast.show(oSalesOrder + " deleted successfully!");
                }.bind(this), function (oError) {
                    MessageToast.show("Deletion error: " ,oError);
                });
            } else {
                MessageToast.show("Please select a row to delete");
            }
        },

        rebindTable: function(oTemplate, sKeyboardMode) {
            this._oTable.bindItems({
                path: "mainModel>/SalesOrders",
                template: oTemplate,
                templateSharable: true,
            }).setKeyboardMode(sKeyboardMode);
        },

        onInputChange: function(){
            this.refreshModel("mainModel");
        },

        refreshModel: function (sModelName, sGroup) {
            return new Promise((resolve, reject) => {
                this.makeChangeAndSubmit.call(this,resolve,reject,sModelName,sGroup);
            });
        },

        makeChangeAndSubmit: function (resolve,reject,sModelName,sGroup){
            const that = this;
            sModelName = "mainModel";
            sGroup = "$auto";
            if (that.getView().getModel(sModelName).hasPendingChanges(sGroup)) {
                that.getView().getModel(sModelName).submitBatch(sGroup).then(oSuccess =>{
                    that.makeChangeAndSubmit(resolve,reject,sModelName,sGroup);
                    MessageToast.show("Record Updated successfully!");
                },reject)
                .catch(function errorHandler(err){
                    MessageToast.show("Somethig went wrong: ", err.message);
                })
            } else {
                that.getView().getModel(sModelName).refresh(sGroup);
                resolve();
            }
        },

        onSave: function (){
            this.getView().byId("editModeButton").setVisible(true);
            this.getView().byId("saveButton").setVisible(false);
            this._oTable.setMode(sap.m.ListMode.None);
            this.rebindTable(this.oReadOnlyTemplate, "Navigation");
        },

        _createReadOnlyTemplate: function(){
            this.oReadOnlyTemplate = new ColumnListItem({
                cells : [
                    new sap.m.Text({
                        text: "{mainModel>soNumber}"
                    }),
                    new sap.m.Text({
                        text: "{mainModel>customerName}"
                    }),
                    new sap.m.Text({
                        text: "{mainModel>customerNumber}"
                    }),
                    new sap.m.Text({
                        text: "{mainModel>PoNumber}"
                    }),
                    new sap.m.Text({
                        text: "{mainModel>inquiryNumber}"
                    })
                ]
            });
        }

        });
    });
