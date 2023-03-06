<h1 align="center"> Print SmartChart using UI5 </h1>

<div align="center">
  Create and extend an Analytical List Page (Fiori Element) with the print chart to pdf feature.
</div>
<div align="center">
  <h3> 📝 
    <a href="https://www.linkedin.com/in/gonzalo-meana-balseiro-90a523188/">
      Contact Me
    </a>
  </h3>
    <h3> 💻  
    <a href="http://gonzalomb.com">
      Check my website
    </a>
  </h3>
</div>

## Starting 🚀
This application consists of extending an analytical list page and using third-party libraries to make a functionality that allows printing a smartchart

### Pre-requirements 📋

_Tools you need to be able to develop this application_

* **SAP Logon** 
* **Eclipse**
* **SAP BAS** 

## Practical case ⚙️

_In this application we are going to develop both the back-end and the front-end part_

### Back-end 🔩
#### 1. ABAP CDS
* **BASIC:** From this view we will consume the table from the on-premise system
```abap
@AbapCatalog.sqlViewName: 'ZISFLIGHTDEMOCDS'
@AbapCatalog.compiler.compareFilter: true
@AbapCatalog.preserveKey: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
@VDM.viewType: #BASIC
@EndUserText.label: 'Basic CDS to capability demo'
define view ZI_SFLIGHT_DEMO_CDS
  as select from sflight
{
key carrid as Carrid,
key connid as Connid,
key fldate as Fldate,
price as Price,
currency as Currency,
planetype as Planetype,
seatsmax as Seatsmax,
seatsocc as Seatsocc,
paymentsum as Paymentsum,
seatsmax_b as SeatsmaxB,
seatsocc_b as SeatsoccB,
seatsmax_f as SeatsmaxF,
seatsocc_f as SeatsoccF

}

```
* **CONSUMITION:** From this view we will consume and activate the oData
```abap
@AbapCatalog.sqlViewName: 'ZCSFLIGHTCAP'
@AbapCatalog.compiler.compareFilter: true
@AbapCatalog.preserveKey: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
@VDM.viewType: #CONSUMPTION
@Metadata.allowExtensions: true
@OData.publish: true
@EndUserText.label: 'Consumption CDS to capability demo'
define view ZC_SFLIGHT_CAPABILITY_CDS
  as select from ZI_SFLIGHT_DEMO_CDS
{
  key Carrid,
  key Connid,
  key Fldate,
      Price,
      Currency,
      Planetype,
      Seatsmax,
      Seatsocc,
      Paymentsum,
      SeatsmaxB,
      SeatsoccB,
      SeatsmaxF,
      SeatsoccF
}
```

* **METADA EXTENSIONS:** It is good practice to separate the annotations with CDS view logic. A metadata extension separate annotation from business logic. To implement metadata extension

* Add annotation @metadata.allExtensions:true to the CDS view
* Create a blank CDS metadata extension and add annotations to it
Metadata extensions only allow annotation of JSON style.

```abap
@Metadata.layer: #(sflight)
@UI.chart: [
  {
    chartType: #COLUMN,
    dimensions: [
      'Planetype'
    ],
    measures: [
      'Seatsmax'
    ]
  }
]
@UI: {
    headerInfo: {
        typeName: 'Flight',
        typeNamePlural: 'Flights',
                title: {
            type: #STANDARD, value: 'Carrid'
        },
                description: {
            value: 'Planetype'
        }
    }
}

annotate entity ZC_SFLIGHT_CAPABILITY_CDS with
{

  @UI.facet: [
   {
       id: 'Fldateheaderid',
       purpose: #HEADER,
       type: #DATAPOINT_REFERENCE,
       position: 10,
       targetQualifier: 'Fldateheader'
   },
   {
       id: 'Currencyheaderid',
       purpose: #HEADER,
       type: #DATAPOINT_REFERENCE,
       position: 20,
       targetQualifier: 'Priceheader'
    },
       {
      label: 'General Information',
      id: 'GeneralInfo',
      type: #COLLECTION,
      position: 10
    },
    {
        id: 'Price',
        purpose: #STANDARD,
        type: #IDENTIFICATION_REFERENCE,
        parentId: 'GeneralInfo',
        label: 'Price',
        position: 10
     }
  ]
  @UI.lineItem: [{position: 10 }]
  @UI.selectionField: [{position: 10 }]
  Carrid;
  @UI.lineItem: [{position: 20 }]
  @UI.selectionField: [{position: 20 }]
  Connid;
  @UI.lineItem: [{position: 30 }]
  @UI.selectionField: [{position: 30 }]
  @UI.dataPoint: { qualifier: 'Fldateheader', title: 'Flight Date'}
  Fldate;
  @UI.dataPoint: { qualifier: 'Priceheader', title: 'Airfare'}
  @UI.lineItem: [{position: 40 }]
  @UI.identification: [{ position: 10 }]
  Price;
  @UI.dataPoint: { qualifier: 'Currencyheader', title: 'Airline Currency'}
  @UI.lineItem: [{position: 50 }]
  @UI.identification: [{ position: 20 }]
  Currency;
  @UI.lineItem: [{position: 60 }]
  Planetype;
  @UI.lineItem: [{position: 70 }]
  Seatsmax;
  @UI.lineItem: [{position: 80 }]
  Seatsocc;
  @UI.lineItem: [{position: 90 }]
  Paymentsum;
  @UI.lineItem: [{position: 100 }]
  SeatsmaxB;
  @UI.lineItem: [{position: 110 }]
  SeatsoccB;
  @UI.lineItem: [{position: 120 }]
  SeatsmaxF;
  @UI.lineItem: [{position: 130 }]
  SeatsoccF;

}
```

### Front-End ⌨️
#### 2. Fiori Elements Analytical List Page ( SAP BAS or VSCODE )
* Select Analytical List Page as the template.

* Fill the project name, title, namespace, description and oData.

* Once the project is created we can check our odata in the manifest.json.
```json
		    "dataSources": {
      "mainService": {
        "uri": "/sap/opu/odata/sap/ZC_SFLIGHT_CAPABILITY_CDS_CDS/",
        "type": "OData",
        "settings": {
          "annotations": ["ZC_SFLIGHT_CAPABILITY_CDS_CD_VAN", "annotation"],
          "localUri": "localService/metadata.xml",
          "odataVersion": "2.0"
        }
      },
      "ZC_SFLIGHT_CAPABILITY_CDS_CD_VAN": {
        "uri": "/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Annotations(TechnicalName='ZC_SFLIGHT_CAPABILITY_CDS_CD_VAN',Version='0001')/$value/",
        "type": "ODataAnnotation",
        "settings": {
          "localUri": "localService/ZC_SFLIGHT_CAPABILITY_CDS_CD_VAN.xml"
        }
      },
      "annotation": {
        "type": "ODataAnnotation",
        "uri": "annotations/annotation.xml",
        "settings": {
          "localUri": "annotations/annotation.xml"
        }
      }
    }
  
  ```
* The following will be to extend the controller by creating the following folders and file ext/controller/AnalyticalListPageExt.controller.js in the webapp path. Once the file is created, we refer to it in the manifest.

```json
    "extends": {
      "extensions": {
        "sap.ui.controllerExtensions": {
          "sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage": {
            "controllerName": "pdfprintui5.ext.controller.AnalyticalListPageExt",
          }
        }
      }
    }
```
* Now we are going to create a custom action (which is a btn which we can give logic to in our controller), for this we give these annotations in the manifest.

```json
    "extends": {
      "extensions": {
        "sap.ui.controllerExtensions": {
          "sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage": {
            "controllerName": "pdfprintui5.ext.controller.AnalyticalListPageExt",
            "sap.ui.generic.app": {
              "ZC_SFLIGHT_CAPABILITY_CDS": {
                "EntitySet": "ZC_SFLIGHT_CAPABILITY_CDS",
                "Actions": {
                  "btnPrintChart": {
                    "id": "btnPrintChart",
                    "text": "Print Chart to PDF",
                    "press": "onPrintChart"
                  }
                }
              }
            }
          }
        }
      }
    }
```
* We add the necessary third-party libraries to be able to print in pdf with javascript. For that we create the /libs folder in the webapp root and refer to it in the manifest.json, we can also create the css folder to be able to use styles in our app.

```json
   "resources": {
      "css": [
        {
          "uri": "css/style.css"
        }
      ],
      "js": [
        {
          "uri": "libs/rgbcolor.js"
        },
        {
          "uri": "libs/StackBlur.js"
        },
        {
          "uri": "libs/canvg.js"
        },
        {
          "uri": "libs/jspdf.js"
        }
      ]
    }
```
* Once our extended controller and our third-party libraries are ready, in the function that is executed when our custom action is clicked we add our feature to print the chart to pdf.

```javascript
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
```
## Testing the print pdf feature 👨‍💻

https://user-images.githubusercontent.com/55688528/182627079-1004c56e-835a-4a38-9eee-d6e43dde2e23.mp4

## Acknowledgement 📚
- **ABAP CDS**
- **Javascript / UI5**
- **Fiori Elements**

## Built with 🛠️
_Back-end:_
* **ABAP CDS**
* **Annotations**

_Gateway:_
* **oData**

_Front-End:_
* **Javascript / UI5**
* **Fiori Elements**

---

⌨️ with ❤️ love [GonzaloMB](https://github.com/GonzaloMB) 😊
