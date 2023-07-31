let baseballData;
let selectedYear = '2022';
let currentScene = 1;

d3.csv('bball_hit_stats.csv').then(data => {
  baseballData = data;
  showScene1();
});

function showScene1() {
    d3.select('#narrative-container').html('');
    
    var margin = {top: 30, right: 30, bottom: 60, left: 80},
        width = 660,
        height = 515;

    var svg = d3.select("#narrative-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var histogram = d3.histogram()
        .domain([18, 45])
        .thresholds(45 - 18)

    var bins = histogram(baseballData.map(function(d) { return d.player_age; }));

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg.append("g")
        .call(d3.axisLeft(y));

    var x = d3.scaleLinear()
        .domain([18, 45])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Player Age");

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Players");

    svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", margin.top - 40)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Distribution of Baseball Players by Age");

    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2");

    d3.select("#nextButton").on("click", function() {
        nextScene()
    });
}

function showScene2() {
    d3.select('#narrative-container').select('svg').remove(); 

    var svgHeight = 600;
    var svgWidth = 1200;
    var margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const dataByAge = d3.rollup(
        baseballData, 
        v => ({
            avgWalkHit: d3.mean(v, d => d.walk) + d3.mean(v, d => d.hit),
            avgStrikeout: d3.mean(v, d => d.strikeout)
        }), 
        d => d.player_age
    );

    const aggregatedData = Array.from(dataByAge, ([age, { avgWalkHit, avgStrikeout }]) => ({ age, avgWalkHit, avgStrikeout }));

    const svg = d3.select('#narrative-container')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const xScale = d3.scaleLinear()
      .domain([0, 210])
      .range([margin.left, svgWidth - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 150])
      .range([svgHeight - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);
    
    svg.append("text")
        .attr("transform", "translate(" + (svgWidth/2) + " ," + (svgHeight - margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .text("Average Walk + Hit");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 60)
        .attr("x",0 - (svgHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Strikeouts"); 


    svg.append("text")
        .attr("x", (svgWidth / 2))             
        .attr("y", margin.top)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Baseball Player Statistics by Age");


    var colorScale = d3.scaleSequential(d3.interpolatePlasma)
        .domain([d3.min(aggregatedData, d => d.age), d3.max(aggregatedData, d => d.age)]);

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    svg.selectAll('circle')
    .data(aggregatedData)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.avgWalkHit))
    .attr('cy', d => yScale(d.avgStrikeout))
    .attr('r', 5)
    .attr('fill', d => colorScale(d.age))
    .on('mouseover', function(event, d) {
    tooltip.transition()
        .duration(200)
        .style('opacity', .9);
    tooltip.html('Age: ' + d.age + '<br/>'
                + 'Hits + Walks: ' + d.avgWalkHit.toFixed(1) + '<br/>'
                + 'Strikeouts: ' + d.avgStrikeout.toFixed(1))
        .style('left', (event.pageX) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

    const sceneTwoElement = document.getElementById('sceneTwo');

    sceneTwoElement.style.display = 'block';

    sceneTwoElement.style.margin = '0 auto';

    d3.select("#nextButton").on("click", function() {
        nextScene()
    });
}


function showScene3() {
    d3.select('#narrative-container').select('svg').remove(); 

    var svgHeight = 600;
    var svgWidth = 1200;
    var margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const years = Array.from(new Set(baseballData.map(d => d.year)));

    const filteredData = baseballData.filter(d => d.year == +selectedYear);


    const dataByAge = d3.rollup(
        filteredData, 
        v => ({
            avgWalkHit: d3.mean(v, d => d.walk) + d3.mean(v, d => d.hit),
            avgStrikeout: d3.mean(v, d => d.strikeout)
        }), 
        d => d.player_age
    );

    const aggregatedData = Array.from(dataByAge, ([age, { avgWalkHit, avgStrikeout }]) => ({ age, avgWalkHit, avgStrikeout }));

    const svg = d3.select('#narrative-container')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const xScale = d3.scaleLinear()
      .domain([0,210])
      .range([margin.left, svgWidth - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0,150])
      .range([svgHeight - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);

    svg.append("text")
        .attr("transform", "translate(" + (svgWidth/2) + " ," + (svgHeight - margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .text("Average Walk + Hit");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 60)
        .attr("x",0 - (svgHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Strikeouts"); 


    svg.append("text")
        .attr("x", (svgWidth / 2))             
        .attr("y", margin.top)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Baseball Player Statistics by Age");


    var colorScale = d3.scaleSequential(d3.interpolatePlasma)
        .domain([d3.min(aggregatedData, d => d.age), d3.max(aggregatedData, d => d.age)]);

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    svg.selectAll('circle')
    .data(aggregatedData)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.avgWalkHit))
    .attr('cy', d => yScale(d.avgStrikeout))
    .attr('r', 5)
    .attr('fill', d => colorScale(d.age))
    .on('mouseover', function(event, d) {
        tooltip.transition()
            .duration(200)
            .style('opacity', .9);
        tooltip.html('Age: ' + d.age + '<br/>'
                    + 'Hits + Walks: ' + d.avgWalkHit.toFixed(1) + '<br/>'
                    + 'Strikeouts: ' + d.avgStrikeout.toFixed(1))
            .style('left', (event.pageX) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

    const dropdown = d3.select("#narrative-container")
    .insert("select", "svg")
    .on("change", function() {
        selectedYear = this.value;
        updateScene3(selectedYear);
    });

    dropdown.selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

    const sceneTwoElement = document.getElementById('sceneTwo');
    const sceneThreeElement = document.getElementById('sceneThree');

    sceneTwoElement.style.display = 'none';
    sceneThreeElement.style.display = 'block';

    updateScene3(selectedYear);
}

var tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

function updateScene3(selectedYear) {
    d3.select('#narrative-container').select('svg').remove(); 

    var svgHeight = 600;
    var svgWidth = 1200;
    var margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const filteredData = baseballData.filter(d => d.year == +selectedYear);
    const dataByAge = d3.rollup(
        filteredData, 
        v => ({
            avgWalkHit: d3.mean(v, d => d.walk) + d3.mean(v, d => d.hit),
            avgStrikeout: d3.mean(v, d => d.strikeout)
        }), 
        d => d.player_age
    );
    const aggregatedData = Array.from(dataByAge, ([age, { avgWalkHit, avgStrikeout }]) => ({ age, avgWalkHit, avgStrikeout }));

    const svg = d3.select('#narrative-container')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const xScale = d3.scaleLinear()
      .domain([0,210])
      .range([margin.left, svgWidth - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0,150])
      .range([svgHeight - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);
    

    svg.append("text")
        .attr("transform", "translate(" + (svgWidth/2) + " ," + (svgHeight - margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .text("Average Walk + Hit");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 60)
        .attr("x",0 - (svgHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Strikeouts"); 


    svg.append("text")
        .attr("x", (svgWidth / 2))             
        .attr("y", margin.top) 
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Baseball Player Statistics by Age");

    var colorScale = d3.scaleSequential(d3.interpolatePlasma)
        .domain([d3.min(aggregatedData, d => d.age), d3.max(aggregatedData, d => d.age)]);

    svg.selectAll('circle')
    .data(aggregatedData)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.avgWalkHit))
    .attr('cy', d => yScale(d.avgStrikeout))
    .attr('r', 5)
    .attr('fill', d => colorScale(d.age))
    .on("mouseover", function(event, d) {    
        tooltip.transition()    
            .duration(200)    
            .style("opacity", .9);    
        tooltip.html('Age: ' + d.age + '<br/>' 
                    + 'Hits: ' + d.avgWalkHit.toFixed(1) + '<br/>' 
                    + 'Walks: ' + d.avgStrikeout.toFixed(1))  
            .style("left", (event.pageX) + "px")   
            .style("top", (event.pageY - 28) + "px");  
    })          
    .on("mouseout", function(d) {   
        tooltip.transition()    
            .duration(500)    
            .style("opacity", 0); 
    });
}


function nextScene() {
    d3.select('#narrative-container').select('svg').remove();

    currentScene++;
    switch(currentScene) {
        case 1: showScene1(); break;
        case 2: showScene2(); break;
        case 3: 
            showScene3(); 
            d3.select("#nextButton").remove(); 
            break;
    }
}
