sap.ui.define(
  ["sap/ui/core/BusyIndicator", "sap/m/PDFViewer"],
  function (BusyIndicator, PDFViewer) {
    "use strict";
    return sap.ui.controller(
      "pdfprintui5.ext.controller.AnalyticalListPageExt",
      {
        onPrintChart: function () {
          BusyIndicator.show(0); //Show busy indicator
          this.smartChartId =
            "pdfprintui5::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZC_SFLIGHT_CAPABILITY_CDS--chart"; // Id SmartChart
          this.chart = this.getView()
            .byId(this.smartChartId)
            .getItems()[2]
            .getAggregation("_vizFrame"); // I get the chart
          this.chart.setWidth("1100px"); //Adjust Width of the chart
          this.chart.setHeight("700px"); //Adjust Height of the chart
          setTimeout(
            function () {
              this.processChartPDF();
            }.bind(this),
            100
          );
        },
        processChartPDF: function () {
          var svg = this.chart.getDomRef().getElementsByTagName("svg")[0]; // I get the chart svg
          var canvas = document.createElement("canvas"); //I create a new canvas with svg height and width
          var bBox = svg.getBBox();
          canvas.width = bBox.width;
          canvas.height = bBox.height;
          var context = canvas.getContext("2d"); //setting the drawing context
          var imageObj = new Image(); //Create a new image with svg metadata
          imageObj.src =
            "data:image/svg+xml," +
            jQuery.sap.encodeURL(
              svg.outerHTML.replace(
                /^<svg/,
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
              )
            );
          imageObj.onload = function () {
            context.drawImage(imageObj, 0, 0, canvas.width, canvas.height); //Draw the image to the canvas
            var dataURL = canvas.toDataURL("base64");
            const doc = new jsPDF("l", "px", "a4"); // A4 landscape 297X210 //Create new jsPDF document
            doc.addImage(dataURL, "jpg", 10, 20); //add the image
            this.chart.setWidth("100%"); //Adjust Width of the chart
            this.chart.setHeight("100%"); //Adjust Height of the chart
            var blob = doc.output("blob", "chart_in_pdf.pdf");
            var _pdfurl = URL.createObjectURL(blob);
            this._pdfViewer = new PDFViewer();
            this.getView().addDependent(this._pdfViewer);
            this._PDFViewer = new sap.m.PDFViewer({
              width: "auto",
              source: _pdfurl, // my blob url
              showDownloadButton: true,
            });
            jQuery.sap.addUrlWhitelist("blob"); //Register blob url as whitelist
            this._PDFViewer.open();
          }.bind(this);
          setTimeout(function () {
            BusyIndicator.hide(); //Hide busy indicator
          },100);
        },
      }
    );
  }
);
