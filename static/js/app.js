function getChart(id) {
    d3.json("data/samples.json").then((data) => {
        console.log(data)
    
        let samples = data.samples.filter(sampleID => sampleID.id.toString() == id)[0];
        console.log(samples);

        let topSamples = samples.sample_values.slice(0, 10).reverse();
         
        let topOTUs = (samples.otu_ids.slice(0, 10)).reverse();
        
        let showOTU = topOTUs.map(d => "OTU " + d)

        let labels = samples.otu_labels.slice(0, 10);

        //bar chart

        let trace = {
            x: topSamples,
            y: showOTU,
            text: labels,
            marker: {
                color: 'green'},
            type:"bar",
            orientation: "h"    
        };

        let layout = {
            title: "The Top 10 OTUs"
        };

        traceData = [trace]

        Plotly.newPlot("bar", traceData, layout);

        //belly button scrubs
        let washFreq = data.metadata.map(d => d.wfreq)
        let data_wash = [
            {
            value: parseFloat(washFreq),
            type: "indicator",
            mode: "gauge+number",
            gauge:{
                axis: { range: [null, 7],tickwidth: 1 },
                shape: "scale",
            }
            }
        ];
        let layout_wash = { 
            title: { text: `Belly Button Scrubs per Week ` },
            };
        Plotly.newPlot("gauge", data_wash, layout_wash);  
        
        //bubble chart
        let bubbleTrace = {
            x: samples.otu_ids,
            y: samples.sample_values,
            text: samples.otu_labels,
            mode: "markers",
            marker:{
                size: samples.sample_values,
                color: samples.otu_ids,
                colorscale:"Electric"
            },
            text: samples.otu_labels
        };

        let bubbleLayout = {
            xaxis: {title: "OTU Identification Number"},
            height: 600,
            width: 1000,
            margin: {t:30},
            hovermode: 'closest'
        };

        let bubble = [bubbleTrace]

        Plotly.newPlot("bubble",bubble, bubbleLayout)
    });

    
}

function getDemographic(id) {
    d3.json("data/samples.json").then((data)=> {

        let meta = data.metadata;

        let result = meta.filter(metaID => metaID.id.toString() === id)[0];

        let demographic= d3.select("#sample-metadata");

        demographic.html("");

        Object.entries(result).forEach((key) => {   
                demographic.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

function optionChanged(id) {
    getChart(id);
    getDemographic(id);
}

function init() {
    let dropdown = d3.select("#selDataset");
 
    d3.json("data/samples.json").then((data)=> {

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        getChart(data.names[0]);
        getDemographic(data.names[0]);
    });
}

init();