import define1 from "./a33468b95d0b15b0@808.js";

function _1(md){return(
md`# Dendryscope Pilot
- [Play Bee](https://inthewalls.itch.io/bee)
- [Compile Bee with Dendry](https://github.com/dendry/bee)
- [Use Clingo](https://observablehq.com/@cmudig/clingo)  
- [Learn Clingo ASP](https://teaching.potassco.org/)`
)}

function _2(Swatches,colorByTag){return(
Swatches(colorByTag)
)}

function _hoverPredicate(){return(
[]
)}

function _peek(d3,width,steps,x,horizon,Event,$0,visibilityChart)
{
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, 80]),
    ret = svg.node();
  const brush = d3
    .brushX()
    .extent([
      [140, 0],
      [width - 20, 60]
    ])
    .on("start brush end", brushed);

  // count of possible choices at given timestep
  let weights = Array.from(d3.group(steps, (d) => d[1])).map((d) => [
    +d[0],
    d[1].length
  ]);

  // const h = (d) => Math.pow(d[1], -0.66) * 50;
  const h = (d) => Math.pow(d[1], 0.66) * 5;
  const xAxis = (g) =>
    g.attr("transform", `translate(0,60)`).call(d3.axisBottom(x));

  const weight = svg
    .append("g")
    .selectAll("rect")
    .data(weights)
    .join("rect")
    .attr("x", (d) => x(d[0] - 0.4))
    .attr("width", x(1) - x(0) - 2)
    .attr("y", (d) => 2 + (60 - h(d)) / 2)
    .attr("height", h)
    .attr("fill", (d) => (d[1] == 1 ? "#000" : "#888"));

  svg.append("g").call(xAxis);
  svg
    .append("g")
    .call(brush)
    .call(brush.move, [0, horizon + 1].map(x))
    .call((g) =>
      g
        .select(".overlay")
        .datum({ type: "selection" })
        .on("mousedown touchstart", beforebrushstarted)
    );

  function beforebrushstarted(event) {
    const dx = x(20) - x(0); // Use a fixed width when recentering.
    const [[cx]] = d3.pointers(event);
    const [x0, x1] = [cx - dx / 2, cx + dx / 2];
    const [X0, X1] = x.range();
    d3.select(this.parentNode).call(
      brush.move,
      x1 > X1 ? [X1 - dx, X1] : x0 < X0 ? [X0, X0 + dx] : [x0, x1]
    );
  }

  function brushed(event) {
    const selection = event.selection;
    if (selection === null) {
      weight.attr("stroke", null);
    } else {
      const [x0, x1] = selection.map(x.invert).map((k) => Math.ceil(k));
      weight.attr("stroke", (d) => (x0 <= d && d <= x1 ? "red" : null));

      ret.value = [x0, x1];
      ret.dispatchEvent(new Event("input"));
      $0.value = d3.scaleLinear(ret.value, [160, width - 20]);
      visibilityChart.redraw();
    }
  }
  $0.value = d3.scaleLinear(ret.value, [160, width - 20]);
  return ret;
}


function _visibilityChart(html,d3,legend,colorByTag,legendTags,$0,$1,stepFrequencies,$2,$3,steps,$4)
{
  let ret = html`
<div style="display: grid; grid-template-columns: 155px 1fr;">
  <div id="labels" style="height: 400px; width: 145px; overflow-y: scroll; overflow-x: hidden;">
    <svg width=145 height=2000></svg>
  </div>
  <div id="steps" style="height: 400px; overflow-y: scroll; overflow-x: hidden;">
    <svg width=1500 height=2000>
     <g id="steps"></g>
      <g id="pins"></g>
    </svg>
  </div>
</div>`;

  let labelsContainer = d3.select(ret).select("div#labels");
  let labels = labelsContainer
    .select("svg")
    .selectAll("text")
    .data(Object.entries(legend))
    .join("text")
    .attr("x", 0)
    .attr("y", (d) => d[1] + 10)
    // .text((d) => (d[0][0] == "n" ? "" : d[0]))
    .text((d) => d[0])
    .attr("font-size", "10")
    .attr("fill", (d) => colorByTag(legendTags[d[0]]))
    .on("click", function (e, d) {
      if ($0.value.includes(d[0])) {
        $1.value.push(d[0]);
        $0.value.splice(
          $0.value.findIndex((s) => s === d[0]),
          1
        );
      } else if ($1.value.includes(d[0])) {
        $1.value.splice(
          $0.value.findIndex((s) => s === d[0]),
          1
        );
      } else {
        $0.value.push(d[0]);
      }
      redraw();
    });

  let counts = stepFrequencies,
    maxCount = Math.max(...counts);

  // CHART
  // let boxFill = (d) => (d[0][0] == "n" ? "gray" : "black");
  let boxFill = (d, i) =>
    counts[i] == 0
      ? "#eee"
      : d3.interpolateBlues(Math.sqrt(counts[i]) / Math.sqrt(maxCount));

  let sel = d3.select(ret).select("div#steps");
  // linked scrolling between labels and playtraces
  labelsContainer.on("scroll", function (e) {
    sel.node().scrollTop = this.scrollTop;
  });
  sel.on("scroll", function (e) {
    labelsContainer.node().scrollTop = this.scrollTop;
  });

  function redraw() {
    //  horizontal scroll and extent
    let x = $2.value;
    blocks.attr("x", (d) => x(d[1]) - 170).attr("width", x(1) - x(0) - 1);
    // required / forbidden scenes
    labels.attr("text-decoration", (d) =>
      $0.value.includes(d[0])
        ? "underline"
        : $1.value.includes(d[0])
        ? "line-through"
        : "none"
    );
    // pinned beats
    // console.log(mutable pinnedNodes[0].split(","));
    pins
      .selectAll("ellipse")
      .data($3.value.map((s) => s.split(","))) // DUPE
      .join("ellipse")
      .attr("cy", (d) => legend[d[0]] + 4.5)
      .attr("cx", (d) => x(+d[1]) - 170 + (x(1) - x(0)) / 2)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .style("pointer-events", "none");
  }
  let blocks = sel
    .select("svg")
    .select("g#steps")
    .selectAll("rect")
    .data(steps)
    .join("rect")
    .attr("y", (d) => legend[d[0]])
    // .attr("height", (d) => (d[0][0] == "n" ? 8 : 22))
    .attr("height", 9)
    .style("fill", boxFill)
    .on("mouseenter", function (e, d) {
      $4.value = d;
      d3.select(this).style("stroke", "darkgray");
    })
    .on("mouseleave", function (e, d) {
      d3.select(this).style("stroke", "none");
    })
    .on("mousedown", function (e, d) {
      let s = d.join(",");
      if ($3.value.includes(s)) {
        $3.value.splice($3.value.indexOf(s), 1);
      } else $3.value.push(s);

      $3.value = $3.value;
      redraw();
    });

  let pins = sel.select("svg").select("g#pins");
  redraw();

  return Object.assign(ret, { redraw });
}


async function _6(html,makeCard,scene,makeStateChart){return(
html`<div style="display: grid; grid-template-columns: 1fr 1fr;">
${makeCard(scene)}
${await makeStateChart()}
</div>`
)}

function _horizon(Inputs){return(
Inputs.range([0, 100], {
  label: "run for this many timesteps",
  step: 5,
  value: 35
})
)}

function _doQuery(html){return(
html`<button>Run</button>`
)}

function _q(doQuery,DendryQuery,$0,$1,$2,$3,$4)
{
  doQuery;
  return new DendryQuery(
    {
      require: $0.value,
      forbid: $1.value,
      pin: $2.value
    },
    $3.value,
    $4.value
  );
}


function _pinnedNodes(){return(
[
  "how_it_will_end,1",
  "n32_too_bad,6",
  "n49_but_try,2",
  "n75_maybe_you,12"
  // "n69_mental,9",
  // "aboriginal_loan_words,20"
]
)}

function _requiredNodes(){return(
[
  "daydream_of_winning",
  "the_family_with_all_the_stuff",
  "lessons_from_sara",
  "the_legend_of_public_school"
]
)}

function _forbiddenNodes(){return(
[]
)}

function _browseTag(Inputs,scenes){return(
Inputs.select([...new Set(scenes.map((u) => u.tags))], {
  value: "top"
})
)}

function _14(md,scenes,browseTag,d3)
{
  let ret = md`${scenes
    .filter((s) => s.tags == browseTag)
    .map(
      (s) => `##### ${s.title}
${s.label}  
${s.subtitle}`
    )
    .join("\n\n")}`;
  d3.select(ret).style("height", "200px").style("overflow-y", "scroll");
  return ret;
}


function _makeStateChart(hasSeen,hoverPredicate,mungePredicate,html,d3,$0,$1){return(
async function makeStateChart() {
  let worlds = (await hasSeen(hoverPredicate)).map((state) =>
    state.map((s) => mungePredicate(s, false))
  );
  let raw = worlds.map((state) => state.filter((s) => s[0] == "reaches"));

  // HACK: melt together all traces that get here
  let steps = [
    ...new Set(raw.map((arr) => arr.map((tup) => tup.join(","))).flat(1))
  ].map((s) => s.split(","));

  let legend = Object.fromEntries(
    [...new Set(steps.map((d) => d[1]))].sort().map((s, i) => [s, 5 + i * 20])
  );
  let ret = html`<div style="height: 300px; overflow-x: hidden;">
<svg width=800 height=${Object.keys(legend).length * 20 + 10}></svg></div>`;

  d3.select(ret)
    .select("svg")
    .selectAll("text")
    .data(Object.entries(legend))
    .join("text")
    .attr("x", 0)
    .attr("y", (d) => d[1] + 10)
    .text((d) => d[0])
    .attr("font-size", "10");

  let counts = steps.map((d) => hasSeen(d).length),
    maxCount = Math.max(...counts);

  // CHART
  // let boxFill = (d) => (d[0][0] == "n" ? "gray" : "black");
  let boxFill = (d, i) => d3.interpolateGreys((counts[i] + 50) / maxCount);

  d3.select(ret)
    .select("svg")
    .append("line")
    .attr("x1", 100)
    .attr("x2", 100)
    .attr("y1", 0)
    .attr("y2", Object.keys(legend).length * 20)
    .style("stroke", "black");
  d3.select(ret)
    .select("svg")
    .selectAll("rect")
    .data(steps)
    .join("rect")
    .attr("x", (d) => 100 + +d[2] * 30)
    .attr("width", 25)
    .attr("y", (d) => legend[d[1]])
    .attr("height", 18)
    .style("fill", boxFill)
    .on("click", (e, d) => {
      $0.value = worlds.find((state) =>
        state.find((u) => u[1] == d[1] && u[2] == d[2])
      );
      $1.value =
        Math.max(
          ...$0.value
            .filter((p) => p[0] == "visited")
            .map((p) => p[2])
        ) + 5;
    });
  return ret;
}
)}

function _traceBuilder(){return(
null
)}

function _filterIndex(Inputs,visibility){return(
Inputs.range([1, visibility.length], {
  label: "max # iterations on skein frontier",
  step: 1,
  value: visibility.length,
  disabled: true
})
)}

function _x(d3,horizon,width){return(
d3.scaleLinear([1, horizon], [160, width - 40])
)}

function _xSelection(x){return(
x
)}

function _getLabels(){return(
(u) => {
  return typeof u == "object" ? Object.keys(u).filter((s) => s[0] == "@") : [];
}
)}

function _22(md){return(
md`### domain spec (from parsed AST)`
)}

async function _scenes(FileAttachment,getLabels)
{
  let ret = await FileAttachment("bee-scenes-ast@1.json").json();
  let entitle = (node, nodeIndex) => {
    node["label"] = node["title"]
      ? node["title"]
          .replaceAll(" ", "_")
          .replaceAll("'", "") // TODO: strip punctuation in general
          .replaceAll(".", "")
          .replaceAll("?", "")
          .replaceAll("-", "")
          .toLowerCase()
      : "enter"; // very load-bearing. 'hub(enter)' appears in the domain dict by fiat.

    // attach labels to each choice present
    let choices = getLabels(node); // all children except leaf nodes (not in AST)
    let allChoices = [...choices];

    // HACK: gather up nodes missing from AST
    node["choices"] = getLabels(node[node["title"]]); // all first children
    node["choices"].forEach((s_) => {
      if (!choices.includes(s_)) allChoices.push(s_);
    });
    if (node["go-to"])
      allChoices.push(...node["go-to"].split("; ").map((s) => "@" + s));

    // DUPE: repeat for each node in the scene
    choices.forEach((s) => {
      node[s]["choices"] = getLabels(node[s]);
      node[s]["choices"].forEach((s_) => {
        if (!choices.includes(s_)) allChoices.push(s_);
      });
      if (node[s]["go-to"])
        allChoices.push(...node[s]["go-to"].split("; ").map((s) => "@" + s));
    });

    allChoices.forEach((s) => {
      node[s] = node[s] || { choices: [] }; // create blanks for leaf nodes

      // BRITTLE: generate unique node ids
      node[s]["label"] =
        "n" +
        nodeIndex +
        "_" +
        s.slice(1).replaceAll("-", "_").split(" ").slice(0, 1);
    });
    // VERIFY: handle forced choices
    if (node["go-to"])
      node["choices"].push(...node["go-to"].split("; ").map((s) => `@${s}`));
    return node;
  };
  return ret.map(entitle);
}


function _egress(){return(
(node) =>
  node["go-to"]
    ? node["go-to"].split("; ").map((s) => "@" + s) // HACK: a lil' parsing for probabilistic gotos
    : node["choices"]
)}

function _labelsIn(){return(
(s) => {
  let idxs = Object.keys(s).filter((k) => k[0] == "@");
  return [s["label"], ...idxs.map((k) => s[k]["label"])];
}
)}

function _nodesIn(){return(
(s, inclusive = false) => {
  let idxs = Object.keys(s).filter((k) => k[0] == "@");
  let ret = idxs.map((k) => s[k]);
  return inclusive ? [s, ...ret] : ret;
}
)}

function _nodes(scenes,labelsIn){return(
scenes.map((s) => labelsIn(s)).flat()
)}

function _linksIn(egress){return(
(s) => {
  let idxs = Object.keys(s).filter((k) => k[0] == "@");
  return [
    ...egress(s).map((tar) => [s.label, s[tar].label]),
    ...idxs
      .map((k) => egress(s[k]).map((tar) => [s[k].label, s[tar].label]))
      .flat()
  ];
}
)}

function _leavesIn(egress){return(
(s) => {
  let idxs = Object.keys(s).filter((k) => k[0] == "@");
  // return idxs.filter((k) => s[k].choices.length == 0).map((k) => s[k]["label"]);

  let ret = idxs.filter((k) => egress(s[k]).length == 0);
  return idxs.length == 0 ? [s.label] : ret;
}
)}

function _mungeOpsTree(){return(
(opDict) => (ast) => {
  if (ast === undefined) return [];

  let sanitize = (key) => key.replaceAll("-", "_");

  return Object.entries(ast)
    .map(([op, kv]) =>
      Object.entries(kv).map(([k, v]) => [sanitize(k), opDict[op], v])
    )
    .flat();
}
)}

function _scene(scenes,labelsIn,hoverPredicate)
{
  // let s = { ...scenes.find((s) => !s.title) };
  let s = {
    ...scenes.find((s) => labelsIn(s).includes(hoverPredicate[0]))
    // ...scenes[46] // A Call to Arms
    // ...scenes.find((s) => (s.title ? s.title.includes("Seen") : false)) // TODO: 'heard rather than seen' has an unusual conditional go-to
    // ...scenes.find((s) => (s.title ? s.title.includes("Church") : false))
    // ...scenes.find((s) => (s.title ? s.title.includes("Hawaii") : false))
    // ...scenes[30] // hub scene
  };
  return s;
}


function _makeCard(html,d3,steps,stepFrequencies,commonVariables){return(
function (scene) {
  const res = html`<div style="margin: 5px 10px; border-left: solid lightgray 4px; height: 400px; overflow-y: scroll;"></div>`;

  const flattenOps = (opsDict) => {
    if (!opsDict) return [];
    return Object.entries(opsDict).reduce((arr, [op, pairs]) => {
      Object.entries(pairs).forEach(([k, v]) => arr.push(`${k} ${op} ${v}`));
      return arr;
    }, []);
  };
  const follows = (ast, ptr) => {
    if (!ptr) return ast.choices;
    let choices = ast[ptr].choices;
    if (!choices.length) {
      if (ast[ptr]["go-to"])
        return ast[ptr]["go-to"].split("; ").map((s) => `@${s}`);
      return [];
    }
    return choices;
  };

  const hasSeen = [];

  function makeTree(sel, ast, ptr = null, depth = 0) {
    const children = follows(ast, ptr);
    if (!children) return sel;

    // don't expand the same label twice, if the scene fans in
    // FIXME: dupes title style
    if (hasSeen.includes(ptr))
      return sel.html(
        `<div style="padding-left: ${
          depth * 15
        }px; font-variant: small-caps; font-size: .8rem;">${
          ast[ptr] ? ast[ptr].label : "oops"
        }</div>`
      );

    sel.call(makeScene, ptr ? ast[ptr] : ast, depth * 15);
    hasSeen.push(ptr);
    if (!children.length) return sel;

    return sel
      .append("div")
      .selectAll("div")
      .data(children)
      .join("div")
      .each(function (s) {
        makeTree(d3.select(this), ast, s, depth + 1);
      });
  }

  function makeScene(sel, choice, indent = 0) {
    const pre = flattenOps({ ...choice["view-if"], ...choice["choose-if"] }),
      post = flattenOps(choice["on-arrival"]);

    const titleColor = () => {
      const s = choice.label,
        // aggregate steps by label
        lookup = steps.reduce((acc, d, i) => {
          if (acc[d[0]]) acc[d[0]] += stepFrequencies[i];
          else acc[d[0]] = stepFrequencies[i];
          return acc;
        }, {});
      // highlight nodes in grey if possible, and in blue if observed
      return lookup[s] === undefined
        ? "#fff"
        : lookup[s] === 0
        ? "#eee"
        : "#def";
    };

    // TODO: these ids aren't unique! they should be classes
    sel.html(`<div style="padding-left: ${indent}px;">
<div id="title" style="height: 20px; margin: 0px 5px; font-variant: small-caps; font-size: .8rem; border-bottom: solid black 1px; overflow: hidden; background-color: ${titleColor()}">${
      choice.title || choice.label
    }</div>
<div style="margin: 2px 8px; height: ${
      pre.length && post.length ? 50 : pre.length || post.length ? 20 : 5
    }px; display: grid; grid-template-rows: 1fr 1fr;">
  <div id="pre" style="border-bottom: dashed gray 1px; font-size: .8rem;"> </div>
  <div id="post" style="border-top: dashed gray 1px; font-size: .8rem;"> </div>
</div></div>`);
    sel
      .select("#pre") // preconditions
      .selectAll("span")
      .data(pre)
      .join("span")
      .text((d) => d)
      .style("color", (d) =>
        commonVariables.some((v) => d.includes(v)) ? "gray" : "black"
      )
      .style("padding", ".5rem");
    sel
      .select("#post") // postconditions
      .selectAll("span")
      .data(post)
      .join("span")
      .text((d) => d)
      .style("color", (d) =>
        commonVariables.some((v) => d.includes(v)) ? "gray" : "black"
      )
      .style("padding", ".5rem");
  }

  makeTree(d3.select(res), scene);
  // makeScene(d3.select(res), scene);
  return res;
}
)}

function _commonVariables(variables,pres,scenes){return(
[...variables].filter(
  // all variables in >25% of preconditions
  (v) => pres.filter((sig) => sig.includes(v)).length > scenes.length / 4
)
)}

function _earliestSeen(scenes,steps)
{
  function earliestSeen(label) {
    let node = scenes.find((u) => u.label == label);
    if (node === undefined) return [label, -1];
    let ret = steps.find((d) => d[0] == node.label);
    return [ret[0], +ret[1]];
  }

  let index = [...new Set(steps.map((d) => d[0]))]; // DUPE
  return Object.fromEntries(
    index
      .map((s) => earliestSeen(s))
      .filter((out) => out[1] !== -1)
      .sort((lhs, rhs) => lhs[1] - rhs[1])
  );
}


function _legend(steps,scenes,earliestSeen)
{
  let index = [...new Set(steps.map((d) => d[0]))];
  let points = index.map((s) => scenes.findIndex((u) => u.label == s));

  let res = index
    .filter((u, i) => points[i] != -1)
    .reduce((acc, s) => {
      let idx = scenes.findIndex((u) => u.label == s); // repeat op, meh
      acc[idx] = [s];
      return acc;
    }, {});

  // TODO: make a cell for this map from scene index to labels in this scene
  let ret = index.reduce((acc, s, i) => {
    if (points[i] == -1) {
      let idx = +s.split("_")[0].slice(1); // retrieve parent index from stringified choice label
      acc[idx].push(s);
    }
    return acc;
  }, res);

  let offsets = Object.values(ret)
    .sort((lhs, rhs) => earliestSeen[lhs[0]] - earliestSeen[rhs[0]])
    .reduce((acc, labels) => {
      if (acc.length == 0) return labels.map((s, i) => [s, i * 10]).reverse();
      return [
        ...labels.map((s, i) => [s, i * 10 + acc[0][1] + 20]).reverse(),
        ...acc
      ];
      // return [[s, acc[0][1] + (acc[0][0][0] == "n" ? 10 : 26)], ...acc];
    }, []);
  return Object.fromEntries(offsets);
}


function _colorByTag(d3,scenes){return(
d3.scaleOrdinal(
  [...new Set(scenes.map((u) => u.tags))].filter((u) => u),
  d3.schemeTableau10
)
)}

function _legendTags(scenes,legend,nodesIn)
{
  // TODO: refactor legend to separate y-position from node-flattening
  let labels = scenes.filter((u) => Object.keys(legend).includes(u.label));
  return Object.fromEntries(
    labels.map((u) => [u, ...nodesIn(u)].map((v) => [v.label, u.tags])).flat(1)
  );
}


async function _visibility(q){return(
(await q.getFrontier())
  .slice(-1)[0]
  .filter((s) => s.includes("visited"))
)}

function _steps(visibility,filterIndex,mungePredicate){return(
visibility
  .filter((s, i) => i < filterIndex)
  .map((s) => mungePredicate(s))
)}

function _stepFrequencies(steps,hasSeen){return(
Promise.all(
  steps.map(async function (d) {
    return (await hasSeen(d)).length;
  })
)
)}

function _lastSceneCandidates(steps,horizon){return(
steps.filter(
  (s) => +s[1] > horizon - 5 && !Number.isInteger(+s[0][1])
)
)}

function _42(hoverPredicate){return(
hoverPredicate
)}

function _43(hasSeen,hoverPredicate){return(
hasSeen(hoverPredicate)
)}

function _hasSeen(q){return(
async function (args) {
  return (await q.getTraces()).filter((trace) =>
    trace.find((p) => p == `visited(${args.join(",")})`)
  );
}
)}

function _mungePredicate(){return(
(s, justArgs = true) => {
  let getArgs = /([-\w]+)\(([-\w,]+)\)/;
  let res = getArgs.exec(s);

  if (justArgs) return res[2].split(",");
  return [res[1], ...res[2].split(",")];
  // return { predicate: res[1], args: res[2].split(",") };
}
)}

function _timeout(Inputs){return(
Inputs.range([0, 5], {
  label: "(ignore) give up after this many seconds",
  step: 0.5,
  value: 3
})
)}

function _DendryQuery(ruleString,domainString,run){return(
class DendryQuery {
  constructor(
    constraint = { require: [], forbid: [], pin: [] },
    horizon = 25,
    timeout = 3,
    maxWorlds = 100, // might not need this w/ time limit
    maxTraces = 200
  ) {
    // goal(${constraint.ending}).
    // ${constraint.seen.map((id_step) => `:- not seen(${id_step.join(",")}).`).join("\n")}

    if (!constraint.require) constraint.require = [];
    if (!constraint.forbid) constraint.forbid = [];
    if (!constraint.pin) constraint.pin = [];

    this.argumentString = `
${constraint.require.map((u) => `goal(${u}).`).join("\n")}
${constraint.forbid.map((u) => `poison(${u}).`).join("\n")}
${constraint.pin.map((uv) => `pin(${uv}).`).join("\n")}

quality(Q) :- wants(X,Q,Op,V).
quality(Q) :- sets(X,Q,Op,V).
has(Q,0,1) :- quality(Q). 

#const n=${horizon}.
`;
    this.programString = [this.argumentString, ruleString, domainString].join(
      "\n"
    );
    let aspCode = this.programString;

    this.analysis = new Promise(async function (resolve, reject) {
      // clingo-wasm doesn't want to run in parallel, so avoid that.
      let frontier = await run(aspCode, maxWorlds, [
        "--enum-mode=brave",
        "--time-limit=2"
        // `--time-limit=${timeout}`
      ]);
      let traces = await run(aspCode, maxTraces, ["--time-limit=3"]);
      // necessity = run(programString, 300, ["--enum-mode=cautious"])

      // TODO: reject on timeout
      if (frontier.Result === "ERROR") reject("oops - frontier failed");
      if (traces.Result === "ERROR") reject("oops - trace failed");
      resolve({
        frontier: frontier.Call[0].Witnesses.map((w) => w.Value),
        traces: traces.Call[0].Witnesses.map((w) => w.Value)
      });
    });
    this.getFrontier = async function () {
      return (await this.analysis).frontier;
    };
    this.getTraces = async function () {
      return (await this.analysis).traces;
    };
  }
  // function run () { }
}
)}

function _ruleString(){return(
`
step(1..n).                                 % bounded time
value(-1..24). 

seen(enter,0).
% :- ending(X), not 1 <= { seen(X,T) : step(T) }.
:- node(X), not hub(X), { seen(X,T) : step(T) } > 1.  % do not repeat yourself
:- hub(X), seen(X,T), seen(X,T+1), step(T).           % do not sit on the hub

:- goal(X), { seen(X,T) : step(T) } < 1.              % I need to see each goal once
% 1 <= { seen(X,T) : step(T) } :- goal(X).            % I may *choose to* see each goal once
:- poison(X), seen(X,T), step(T).                     % I can't see poison

% :- not seen(X,T), pin(X,T).                           % I need to see each pin
seen(X,T) :- pin(X,T).
% :- seen(X,T), seen(Y,T), X != Y, step(T).
:- step(T), 2 { seen(X,T): node(X) }.

% walk along the trace
{ seen(Y,T) : link(X,Y), available(Y,T) } = 1 :-
  seen(X,T-1),
  not T-1 == n.
available(Y,T) :-
  step(T),
  node(Y),
  satisfied(Q, Op, V, T) : wants(Y, Q, Op, V).

% enforce preconditions
satisfied(Q, eq, V, T) :- has(Q, V, T).
satisfied(Q, geq, Thresh, T) :- has(Q, V, T), V >= Thresh, wants(_Y, Q, geq, Thresh).
satisfied(Q, leq, Thresh, T) :- has(Q, V, T), V <= Thresh, wants(_Y, Q, leq, Thresh).
satisfied(Q, gt, Thresh, T) :- has(Q, V, T), V > Thresh, wants(_Y, Q, gt, Thresh).
satisfied(Q, lt, Thresh, T) :- has(Q, V, T), V < Thresh, wants(_Y, Q, lt, Thresh).

% satisfied(Q, geq, Thresh, T) :- step(T), wants(_Y, Q, geq, Thresh), #sum { V : has(Q,V,T)} >= Thresh.
% satisfied(Q, leq, Thresh, T) :- step(T), wants(_Y, Q, geq, Thresh), #sum { V : has(Q,V,T)} <= Thresh.
% satisfied(Q, gt, Thresh, T) :- step(T), wants(_Y, Q, geq, Thresh), #sum { V : has(Q,V,T)} > Thresh.
% satisfied(Q, lt, Thresh, T) :- step(T), wants(_Y, Q, geq, Thresh), #sum { V : has(Q,V,T)} < Thresh.

% satisfied(Q, gt, Thresh, T) :- step(T), wants(_Y, Q, gt, Thresh), #sum { V : has(Q,V,T); -Thresh : 1=1 } > 0.

link(enter, Y) :- root(Y).                  % link every root to hub
link(X, enter) :- leaf(X).
link(X, Y) :- parent(X,Y).                  % link every choice to parent

% reaches(Q,V) :- has(Q,V,T).
visited(X,T) :- seen(X,T), not hub(X).

% apply postconditions
has(Q,V,T+1) :- seen(X,T), sets(X,Q,set,V), value(V).
has(Q,V,T+1) :- seen(X,T), sets(X,Q,inc,Delta), has(Q,V-Delta,T), value(V), value(Delta).
has(Q,V,T+1) :- seen(X,T), sets(X,Q,dec,Delta), has(Q,V+Delta,T), value(V), value(Delta).

updated(Q,T) :- seen(X,T), sets(X,Q,_Op,_V).   % mark when the quality is touched
has(Q,V,T+1) :-                                % floodfill values until mark
	has(Q,V,T),
  step(T),
	not updated(Q,T).

% #show time_1(Q,V): has(Q,V,1), V > 0.
% #show has(Q,V,T): has(Q,V,T), V > 0.

#show reaches(Q,V): has(Q,V,T), T == n, V != 0.
#show visited/2.
`
)}

function _preconditions(mungeOpsTree,nodesIn){return(
(s) => {
  let munge = mungeOpsTree({
    "<=": "lte",
    "<": "lt",
    "=": "eq",
    ">=": "gte",
    ">": "gt"
  });

  let ret = nodesIn(s, "inclusive")
    .map((node) =>
      [...munge(node["view-if"]), ...munge(node["choose-if"])].map((v) => [
        node["label"],
        v
      ])
    )
    .flat()
    .map(([k, v]) => `wants(${k}, ${v.join(", ")}).`);
  return ret;
}
)}

function _postconditions(mungeOpsTree,nodesIn){return(
(s) => {
  let munge = mungeOpsTree({ "+=": "inc", "-=": "dec", "=": "set" });

  let ret = nodesIn(s, "inclusive")
    .map((node) => munge(node["on-arrival"]).map((v) => [node["label"], v]))
    .flat()
    .map(([k, v]) => `sets(${k}, ${v.join(", ")}).`);
  return ret;
}
)}

function _domainString(scenes,leavesIn,linksIn,preconditions,postconditions,nodes){return(
`
hub(enter).
root(${scenes.map((s) => s.label).join("; ")}).
leaf(${scenes
  .map((s) =>
    leavesIn(s)
      .filter((s) => s[0] == "@")
      .map((k) => s[k].label)
  )
  .flat()
  .join("; ")}).
parent(${scenes
  .map((s) =>
    linksIn(s)
      .map((vw) => vw.join(", "))
      .join("; ")
  )
  .filter((s) => s)
  .join(").\n parent(")}).

${scenes
  .map((s) => preconditions(s))
  .flat()
  .join("\n")}
${scenes
  .map((s) => postconditions(s))
  .flat()
  .join("\n")}

node(${nodes.join("; ")}).
`
)}

function _54(md){return(
md`### ui helpers`
)}

function _pres(scenes,extract){return(
scenes.reduce((acc, scene) => {
  acc.push(extract(scene["view-if"]));
  return acc;
}, [])
)}

function _posts(scenes,extract){return(
scenes.reduce((acc, scene) => {
  acc.push(extract(scene["on-arrival"]));
  return acc;
}, [])
)}

function _variables(pres,posts){return(
new Set([...pres.flat(), ...posts.flat()])
)}

function _makeToggle(Inputs){return(
(variable, prompt, value = false) =>
  Object.assign(Inputs.toggle({ label: `${prompt} ${variable}`, value }), {
    variable
  })
)}

function _59(md){return(
md`### ast helpers`
)}

function _filterEffectsBuffer(){return(
[]
)}

function _conditionsByVar(){return(
(v) => (scene) => {
  let src = scene["view-if"] || {};
  return Object.entries(src).reduce((acc, [op, kv]) => {
    if (Object.keys(kv).includes(v)) acc.push({ value: kv[v], op });
    return acc;
  }, []);
}
)}

function _effectsByVar(){return(
(v) => (scene) => {
  let src = scene["on-arrival"] || {};
  return Object.entries(src).reduce((acc, [op, kv]) => {
    if (Object.keys(kv).includes(v)) acc.push({ value: kv[v], op });
    return acc;
  }, []);
}
)}

function _extract(){return(
(ops) => {
  if (!ops) return [];
  let res = Object.values(ops);
  return res.map((u) => Object.keys(u)).flat();
}
)}

function _64(md){return(
md`### requirements`
)}

async function _run(require)
{
  const clingo = await require("clingo-wasm@0.0.14");
  await clingo.init(
    "https://cdn.jsdelivr.net/npm/clingo-wasm@0.0.14/dist/clingo.wasm"
  );
  return clingo.run;
}


function _67(md){return(
md`### scratch`
)}

function _pathsFrom(scenes){return(
(node) => {
  function follow(node) {
    // fixme: ground

    let choices = node["title"]
      ? Object.keys(node[node["title"]])
      : Object.keys(node).filter((k) => k[0] == "@");

    if (!choices) {
      let goto = Object.entries(node).find(([k, v]) => k == "go-to");
      if (goto !== undefined) {
        return follow(scenes[goto[1].split("; ")]);
      }
    }
    return follow(choices);
  }
  return follow(node);
}
)}

function _paths(pathsFrom){return(
(scene) => {
  let ret = pathsFrom(scene);
  // FIXME: follow go-to. accumulate view-if and on-arrival.

  ret = ret.reduce((acc, [key, choice]) => {
    acc.push(...pathsFrom(choice).map((u) => [key, ...u]));
    return acc;
  }, []);

  // FIXME: to arbitrary depth
  return ret;
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["bee-scenes-ast@1.json", {url: new URL("./files/e62e7deda336c2fc24b25ca4a88d1540482a7c703801a370b043149cdb74206856926adf419c159c7aac7efde50c008d34e9b993cf10fb49257d384a2e5792e1.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Swatches","colorByTag"], _2);
  main.define("initial hoverPredicate", _hoverPredicate);
  main.variable(observer("mutable hoverPredicate")).define("mutable hoverPredicate", ["Mutable", "initial hoverPredicate"], (M, _) => new M(_));
  main.variable(observer("hoverPredicate")).define("hoverPredicate", ["mutable hoverPredicate"], _ => _.generator);
  main.variable(observer("viewof peek")).define("viewof peek", ["d3","width","steps","x","horizon","Event","mutable xSelection","visibilityChart"], _peek);
  main.variable(observer("peek")).define("peek", ["Generators", "viewof peek"], (G, _) => G.input(_));
  main.variable(observer("visibilityChart")).define("visibilityChart", ["html","d3","legend","colorByTag","legendTags","mutable requiredNodes","mutable forbiddenNodes","stepFrequencies","mutable xSelection","mutable pinnedNodes","steps","mutable hoverPredicate"], _visibilityChart);
  main.variable(observer()).define(["html","makeCard","scene","makeStateChart"], _6);
  main.variable(observer("viewof horizon")).define("viewof horizon", ["Inputs"], _horizon);
  main.variable(observer("horizon")).define("horizon", ["Generators", "viewof horizon"], (G, _) => G.input(_));
  main.variable(observer("viewof doQuery")).define("viewof doQuery", ["html"], _doQuery);
  main.variable(observer("doQuery")).define("doQuery", ["Generators", "viewof doQuery"], (G, _) => G.input(_));
  main.variable(observer("q")).define("q", ["doQuery","DendryQuery","mutable requiredNodes","mutable forbiddenNodes","mutable pinnedNodes","viewof horizon","viewof timeout"], _q);
  main.define("initial pinnedNodes", _pinnedNodes);
  main.variable(observer("mutable pinnedNodes")).define("mutable pinnedNodes", ["Mutable", "initial pinnedNodes"], (M, _) => new M(_));
  main.variable(observer("pinnedNodes")).define("pinnedNodes", ["mutable pinnedNodes"], _ => _.generator);
  main.define("initial requiredNodes", _requiredNodes);
  main.variable(observer("mutable requiredNodes")).define("mutable requiredNodes", ["Mutable", "initial requiredNodes"], (M, _) => new M(_));
  main.variable(observer("requiredNodes")).define("requiredNodes", ["mutable requiredNodes"], _ => _.generator);
  main.define("initial forbiddenNodes", _forbiddenNodes);
  main.variable(observer("mutable forbiddenNodes")).define("mutable forbiddenNodes", ["Mutable", "initial forbiddenNodes"], (M, _) => new M(_));
  main.variable(observer("forbiddenNodes")).define("forbiddenNodes", ["mutable forbiddenNodes"], _ => _.generator);
  main.variable(observer("viewof browseTag")).define("viewof browseTag", ["Inputs","scenes"], _browseTag);
  main.variable(observer("browseTag")).define("browseTag", ["Generators", "viewof browseTag"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","scenes","browseTag","d3"], _14);
  main.variable(observer("makeStateChart")).define("makeStateChart", ["hasSeen","hoverPredicate","mungePredicate","html","d3","mutable traceBuilder","viewof horizon"], _makeStateChart);
  main.define("initial traceBuilder", _traceBuilder);
  main.variable(observer("mutable traceBuilder")).define("mutable traceBuilder", ["Mutable", "initial traceBuilder"], (M, _) => new M(_));
  main.variable(observer("traceBuilder")).define("traceBuilder", ["mutable traceBuilder"], _ => _.generator);
  main.variable(observer("viewof filterIndex")).define("viewof filterIndex", ["Inputs","visibility"], _filterIndex);
  main.variable(observer("filterIndex")).define("filterIndex", ["Generators", "viewof filterIndex"], (G, _) => G.input(_));
  main.variable(observer("x")).define("x", ["d3","horizon","width"], _x);
  main.define("initial xSelection", ["x"], _xSelection);
  main.variable(observer("mutable xSelection")).define("mutable xSelection", ["Mutable", "initial xSelection"], (M, _) => new M(_));
  main.variable(observer("xSelection")).define("xSelection", ["mutable xSelection"], _ => _.generator);
  main.variable(observer("getLabels")).define("getLabels", _getLabels);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("scenes")).define("scenes", ["FileAttachment","getLabels"], _scenes);
  main.variable(observer("egress")).define("egress", _egress);
  main.variable(observer("labelsIn")).define("labelsIn", _labelsIn);
  main.variable(observer("nodesIn")).define("nodesIn", _nodesIn);
  main.variable(observer("nodes")).define("nodes", ["scenes","labelsIn"], _nodes);
  main.variable(observer("linksIn")).define("linksIn", ["egress"], _linksIn);
  main.variable(observer("leavesIn")).define("leavesIn", ["egress"], _leavesIn);
  main.variable(observer("mungeOpsTree")).define("mungeOpsTree", _mungeOpsTree);
  main.variable(observer("scene")).define("scene", ["scenes","labelsIn","hoverPredicate"], _scene);
  main.variable(observer("makeCard")).define("makeCard", ["html","d3","steps","stepFrequencies","commonVariables"], _makeCard);
  main.variable(observer("commonVariables")).define("commonVariables", ["variables","pres","scenes"], _commonVariables);
  main.variable(observer("earliestSeen")).define("earliestSeen", ["scenes","steps"], _earliestSeen);
  main.variable(observer("legend")).define("legend", ["steps","scenes","earliestSeen"], _legend);
  main.variable(observer("colorByTag")).define("colorByTag", ["d3","scenes"], _colorByTag);
  main.variable(observer("legendTags")).define("legendTags", ["scenes","legend","nodesIn"], _legendTags);
  main.variable(observer("visibility")).define("visibility", ["q"], _visibility);
  main.variable(observer("steps")).define("steps", ["visibility","filterIndex","mungePredicate"], _steps);
  main.variable(observer("stepFrequencies")).define("stepFrequencies", ["steps","hasSeen"], _stepFrequencies);
  main.variable(observer("lastSceneCandidates")).define("lastSceneCandidates", ["steps","horizon"], _lastSceneCandidates);
  main.variable(observer()).define(["hoverPredicate"], _42);
  main.variable(observer()).define(["hasSeen","hoverPredicate"], _43);
  main.variable(observer("hasSeen")).define("hasSeen", ["q"], _hasSeen);
  main.variable(observer("mungePredicate")).define("mungePredicate", _mungePredicate);
  main.variable(observer("viewof timeout")).define("viewof timeout", ["Inputs"], _timeout);
  main.variable(observer("timeout")).define("timeout", ["Generators", "viewof timeout"], (G, _) => G.input(_));
  main.variable(observer("DendryQuery")).define("DendryQuery", ["ruleString","domainString","run"], _DendryQuery);
  main.variable(observer("ruleString")).define("ruleString", _ruleString);
  main.variable(observer("preconditions")).define("preconditions", ["mungeOpsTree","nodesIn"], _preconditions);
  main.variable(observer("postconditions")).define("postconditions", ["mungeOpsTree","nodesIn"], _postconditions);
  main.variable(observer("domainString")).define("domainString", ["scenes","leavesIn","linksIn","preconditions","postconditions","nodes"], _domainString);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer("pres")).define("pres", ["scenes","extract"], _pres);
  main.variable(observer("posts")).define("posts", ["scenes","extract"], _posts);
  main.variable(observer("variables")).define("variables", ["pres","posts"], _variables);
  main.variable(observer("makeToggle")).define("makeToggle", ["Inputs"], _makeToggle);
  main.variable(observer()).define(["md"], _59);
  main.define("initial filterEffectsBuffer", _filterEffectsBuffer);
  main.variable(observer("mutable filterEffectsBuffer")).define("mutable filterEffectsBuffer", ["Mutable", "initial filterEffectsBuffer"], (M, _) => new M(_));
  main.variable(observer("filterEffectsBuffer")).define("filterEffectsBuffer", ["mutable filterEffectsBuffer"], _ => _.generator);
  main.variable(observer("conditionsByVar")).define("conditionsByVar", _conditionsByVar);
  main.variable(observer("effectsByVar")).define("effectsByVar", _effectsByVar);
  main.variable(observer("extract")).define("extract", _extract);
  main.variable(observer()).define(["md"], _64);
  const child1 = runtime.module(define1);
  main.import("Swatches", child1);
  main.variable(observer("run")).define("run", ["require"], _run);
  main.variable(observer()).define(["md"], _67);
  main.variable(observer("pathsFrom")).define("pathsFrom", ["scenes"], _pathsFrom);
  main.variable(observer("paths")).define("paths", ["pathsFrom"], _paths);
  return main;
}
