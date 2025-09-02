import BpmnModeler from 'bpmn-js/lib/Modeler';

import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';

import minimapModule from 'diagram-js-minimap';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'diagram-js-minimap/assets/diagram-js-minimap.css'

import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

const modeler = new BpmnModeler({
    container: '#canvas',
    additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        minimapModule
    ],
    propertiesPanel: {
        parent: '#properties'
    }
});

modeler.createDiagram().then(() => {
    console.log("Blank BPMN Canvas Ready");
}).catch(err => console.error(err));


document.getElementById('open-file').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const xml = e.target.result;
            modeler.importXML(xml).then(() => {
                console.log('BPMN file loaded');
            }).catch(err => {
                console.error('Failed to load BPMN file', err);
            });
        };
        reader.readAsText(file);
    }
});

document.getElementById('save-file').addEventListener('click', () => {
    modeler.saveXML({ format: true }).then((result) => {
        const { xml } = result;

        // Create download link
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.bpmn';
        a.click();
        URL.revokeObjectURL(url);
    }).catch(err => {
        console.error('Failed to save BPMN', err);
    });
});


// Add this after your existing event listeners

let xmlVisible = false;

document.getElementById('toggle-xml').addEventListener('click', () => {
    if (!xmlVisible) {
        // Show XML
        modeler.saveXML({ format: true }).then((result) => {
            const { xml } = result;
            document.getElementById('xml-editor').value = xml;
            document.getElementById('xml-panel').style.display = 'flex';
            document.getElementById('toggle-xml').textContent = 'Close XML';
            xmlVisible = true;
        }).catch(err => {
            console.error('Failed to get XML', err);
        });
    } else {
        // Hide XML
        document.getElementById('xml-panel').style.display = 'none';
        document.getElementById('toggle-xml').textContent = 'View XML';
        xmlVisible = false;
    }
});

document.getElementById('apply-xml').addEventListener('click', () => {
    const xml = document.getElementById('xml-editor').value;
    modeler.importXML(xml).then(() => {
        console.log('XML changes applied');
        // Hide XML panel
        document.getElementById('xml-panel').style.display = 'none';
        document.getElementById('toggle-xml').textContent = 'View XML';
        xmlVisible = false;
    }).catch(err => {
        console.error('Failed to apply XML changes', err);
        alert('Invalid XML. Please check your syntax.');
    });
});

document.getElementById('close-xml').addEventListener('click', () => {
    document.getElementById('xml-panel').style.display = 'none';
    document.getElementById('toggle-xml').textContent = 'View XML';
    xmlVisible = false;
});