/* ***** COLLECT COMPONENTS FROM PAGE ***** */
function collectComponentsFromPage() {
    var components = [];

    var dataCells = getElementsByClassName("dataCell");
    var howManyDataCells = dataCells.length;
    
    for (var index = 0; index < howManyDataCells; index += 3) {
        components.push({
            "Component Name": dataCells[index].innerText,
            "Parent Object": dataCells[index + 1].innerText,
            "Component Type": dataCells[index + 2].innerText
        });
    }

    return components;
}

var components = collectComponentsFromPage();


/* ***** SET UP MAPPING FOR COMPONENTS AND THEIR METADATA API NAMES (COMPONENT => METADATA NAME) ***** */
var getTypeOfComponent = {
    "Application Tab": "CustomMetadata",
    "Document Folder": "Folder",
    "Tab": "CustomTab",
    "Aura Component Bundle": "AuraDefinitionBundle",
    "Visualforce Page": "ApexPage",
    "Visualforce Component": "ApexComponent",
    "Lightning Page": "FlexiPage",
    "Apex Trigger": "ApexTrigger",
    "Apex Class": "ApexClass",
    "Custom Object": "CustomObject",
    "Custom Metadata Type": "CustomMetadata",
    "Remote Site": "RemoteSiteSetting",
    "Dashboard": "Dashboard",
    "Page Layout": "Layout",
    "Static Resource": "StaticResource",
    "List View": "ListView",
    "Report": "Report",
    "Document": "Document",
    "Action": "QuickAction",
    "Field Set": "FieldSet",
    "Dashboard Folder": "Folder",
    "Record Type": "RecordType",
    "Email Template Folder": "Folder",
    "Validation Rule": "ValidationRule",
    "Email Template": "EmailTemplate",
    "Report Folder": "Folder",
    "Button or Link": "WebLink",
    "Custom Report Type": "ReportType",
    "Custom Field": "!!!ISPARTOFCUSTOMOBJECT",
    "Flow Version": "FlowDefinition"
};




/* ***** POPULATE STRUCTURES FOR BUILDING PACKAGE.XML ***** */

var typesOfComponents = new Set()

components.forEach(function(component) {
    typesOfComponents.add(component["Component Type"]);
});

var componentsOfThisType = {};

typesOfComponents.forEach(function(typeOfComponent) {
    components.forEach(function(component) {
        if (componentsOfThisType[typeOfComponent]) {
            if (component["Component Type"] === typeOfComponent) {
                componentsOfThisType[typeOfComponent].push(component["Component Name"]);
            }
        } else {
            componentsOfThisType[typeOfComponent] = [];
            if (component["Component Type"] === typeOfComponent) {
                componentsOfThisType[typeOfComponent].push(component["Component Name"]);
            }
        }
    });
});



/* ***** BUILD PACKAGE.XML FILE ***** */

var templateForPackageType = " \n \
\t<types> \n \
    \t<members>*</members> \n \
    \t<name>?</name> \n \
\t</types>";

var packageXml = "";

packageXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n\
<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">";
typesOfComponents.forEach(function(typeOfComponent) {

    packageXml += "\n\t<types> \n ";
    componentsOfThisType[typeOfComponent].forEach(function(component) {
        packageXml += "\t\t<members>" + component + "</members> \n";
    });
    packageXml += "\t\t<name>" + getTypeOfComponent[typeOfComponent] + "</name> \n";
    packageXml += "\t</types>";
});
packageXml += "\n</Package>";

console.log(packageXml);