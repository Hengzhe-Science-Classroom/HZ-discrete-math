window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch13',
    number: 13,
    title: 'Planar Graphs & Coloring',
    subtitle: 'Drawing graphs without crossings and coloring maps',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Planarity and Coloring?</h2>

<div class="env-block intuition">
    <div class="env-title">The Bridges of Konigsberg, Revisited</div>
    <div class="env-body">
        <p>Euler's solution to the Konigsberg bridge problem launched graph theory, but it was about <em>traversal</em>. A different, equally natural question is about <em>drawing</em>: can you draw a graph on a flat surface so that no edges cross? This question underpins circuit board layout, map design, and the most famous conjecture in combinatorics.</p>
    </div>
</div>

<p>Two of the most beautiful topics in graph theory are tightly linked. <strong>Planarity</strong> asks which graphs can be embedded in the plane without edge crossings. <strong>Graph coloring</strong> asks how many colors are needed to label vertices so that adjacent vertices get different colors. The connection: the Four Color Theorem says every planar graph can be properly colored with at most 4 colors.</p>

<p>These ideas have far-reaching applications:</p>
<ul>
    <li><strong>Circuit design:</strong> A planar circuit can be printed on a single layer of a PCB, avoiding costly vias.</li>
    <li><strong>Map coloring:</strong> Coloring countries on a map so no two neighbors share a color is a direct graph coloring problem on the dual graph.</li>
    <li><strong>Register allocation:</strong> Compilers assign variables to CPU registers by coloring an interference graph.</li>
    <li><strong>Scheduling:</strong> Exam scheduling, frequency assignment, and Sudoku are all graph coloring problems in disguise.</li>
</ul>

<p>This chapter develops planarity from Euler's formula through Kuratowski's forbidden-subgraph characterization, then moves to chromatic theory from the greedy algorithm through the Four Color Theorem and chromatic polynomials.</p>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Planar Graphs
        // ================================================================
        {
            id: 'sec-planar',
            title: 'Planar Graphs',
            content: `
<h2>Planar Graphs</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Planar Graph)</div>
    <div class="env-body">
        <p>A graph \\(G\\) is <strong>planar</strong> if it can be drawn in the plane so that no two edges cross (except at shared endpoints). Such a drawing is called a <strong>planar embedding</strong> or <strong>plane graph</strong>.</p>
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">Key Insight</div>
    <div class="env-body">
        <p>Planarity is a property of the <em>graph</em>, not of any particular drawing. A graph might look tangled in one drawing but can be redrawn without crossings. The question is whether <em>some</em> crossing-free drawing exists.</p>
    </div>
</div>

<h3>Faces</h3>

<p>A planar embedding divides the plane into connected regions called <strong>faces</strong>. Every planar embedding has exactly one unbounded face, called the <strong>outer face</strong> or <strong>infinite face</strong>. The bounded regions are the <strong>interior faces</strong>.</p>

<div class="env-block example">
    <div class="env-title">Example: Triangle</div>
    <div class="env-body">
        <p>A triangle (\\(K_3\\)) drawn in the plane has 3 vertices, 3 edges, and 2 faces: the interior of the triangle and the outer face.</p>
    </div>
</div>

<h3>Euler's Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.1 (Euler's Formula for Planar Graphs)</div>
    <div class="env-body">
        <p>If \\(G\\) is a connected planar graph with \\(V\\) vertices, \\(E\\) edges, and \\(F\\) faces (in any planar embedding), then</p>
        \\[V - E + F = 2.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>Start with a spanning tree of \\(G\\), which has \\(V\\) vertices, \\(V - 1\\) edges, and 1 face (the outer face). So \\(V - (V-1) + 1 = 2\\). Each time we add a back-edge, it creates exactly one new face, increasing both \\(E\\) and \\(F\\) by 1. The quantity \\(V - E + F\\) remains 2 throughout.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Euler Characteristic</div>
    <div class="env-body">
        <p>The quantity \\(\\chi = V - E + F\\) is called the <strong>Euler characteristic</strong>. For the plane (or sphere), \\(\\chi = 2\\). For a torus, \\(\\chi = 0\\). This is a topological invariant: it depends only on the surface, not on the particular graph embedded in it.</p>
    </div>
</div>

<h3>Consequences of Euler's Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Corollary 13.2 (Edge Bound)</div>
    <div class="env-body">
        <p>If \\(G\\) is a simple connected planar graph with \\(V \\geq 3\\) vertices and \\(E\\) edges, then</p>
        \\[E \\leq 3V - 6.\\]
        <p>If \\(G\\) has no triangles (no 3-cycles), then \\(E \\leq 2V - 4\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Every face is bounded by at least 3 edges (or at least 4 if there are no triangles). Each edge borders at most 2 faces. So \\(3F \\leq 2E\\) (or \\(4F \\leq 2E\\)). Substituting \\(F = 2 - V + E\\) from Euler's formula:</p>
        \\[3(2 - V + E) \\leq 2E \\implies E \\leq 3V - 6.\\]
        <p>For triangle-free graphs: \\(4(2 - V + E) \\leq 2E \\implies E \\leq 2V - 4\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Is \\(K_5\\) Planar?</div>
    <div class="env-body">
        <p>\\(K_5\\) has \\(V = 5\\) and \\(E = 10\\). The bound gives \\(E \\leq 3(5) - 6 = 9\\). Since \\(10 > 9\\), \\(K_5\\) is not planar.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-planar-test"></div>
<div class="viz-placeholder" data-viz="viz-euler-formula"></div>
`,
            visualizations: [
                {
                    id: 'viz-planar-test',
                    title: 'Planar Graph Tester',
                    description: 'Select a graph from the dropdown and try to drag vertices to create a crossing-free drawing. The engine detects crossings in real time.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var graphs = {
                            'K4 (planar)': {
                                verts: [[180,120],[380,120],[380,300],[180,300]],
                                edges: [[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]],
                                planar: true
                            },
                            'Petersen (not planar)': {
                                verts: (function() {
                                    var v = [];
                                    for (var i = 0; i < 5; i++) {
                                        var a = -Math.PI/2 + 2*Math.PI*i/5;
                                        v.push([280 + 150*Math.cos(a), 210 + 150*Math.sin(a)]);
                                    }
                                    for (var j = 0; j < 5; j++) {
                                        var b = -Math.PI/2 + 2*Math.PI*j/5;
                                        v.push([280 + 60*Math.cos(b), 210 + 60*Math.sin(b)]);
                                    }
                                    return v;
                                })(),
                                edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[5,7],[7,9],[9,6],[6,8],[8,5],[0,5],[1,6],[2,7],[3,8],[4,9]],
                                planar: false
                            },
                            'Cube Q3 (planar)': {
                                verts: [[140,100],[320,100],[380,180],[200,180],[160,260],[340,260],[400,340],[220,340]],
                                edges: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],
                                planar: true
                            },
                            'K3,3 (not planar)': {
                                verts: [[150,100],[150,210],[150,320],[410,100],[410,210],[410,320]],
                                edges: [[0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5]],
                                planar: false
                            }
                        };
                        var graphNames = Object.keys(graphs);
                        var currentName = graphNames[0];
                        var verts, edges, isPlanar;

                        function loadGraph(name) {
                            var g = graphs[name];
                            verts = g.verts.map(function(v) { return [v[0], v[1]]; });
                            edges = g.edges;
                            isPlanar = g.planar;
                        }
                        loadGraph(currentName);

                        // Dropdown
                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        graphNames.forEach(function(name) {
                            var opt = document.createElement('option');
                            opt.value = name; opt.textContent = name;
                            sel.appendChild(opt);
                        });
                        sel.addEventListener('change', function() {
                            currentName = sel.value;
                            loadGraph(currentName);
                            draw();
                        });
                        controls.appendChild(sel);

                        // Dragging
                        var dragIdx = -1;
                        viz.canvas.addEventListener('mousedown', function(e) {
                            var r = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - r.left, my = e.clientY - r.top;
                            for (var i = 0; i < verts.length; i++) {
                                var dx = mx - verts[i][0], dy = my - verts[i][1];
                                if (dx*dx + dy*dy < 200) { dragIdx = i; break; }
                            }
                        });
                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (dragIdx < 0) return;
                            var r = viz.canvas.getBoundingClientRect();
                            verts[dragIdx][0] = e.clientX - r.left;
                            verts[dragIdx][1] = e.clientY - r.top;
                            draw();
                        });
                        viz.canvas.addEventListener('mouseup', function() { dragIdx = -1; });
                        viz.canvas.addEventListener('mouseleave', function() { dragIdx = -1; });

                        function segIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
                            var denom = (bx-ax)*(dy-cy) - (by-ay)*(dx-cx);
                            if (Math.abs(denom) < 1e-10) return false;
                            var t = ((cx-ax)*(dy-cy) - (cy-ay)*(dx-cx)) / denom;
                            var u = ((cx-ax)*(by-ay) - (cy-ay)*(bx-ax)) / denom;
                            return t > 0.01 && t < 0.99 && u > 0.01 && u < 0.99;
                        }

                        function countCrossings() {
                            var count = 0;
                            for (var i = 0; i < edges.length; i++) {
                                for (var j = i + 1; j < edges.length; j++) {
                                    var e1 = edges[i], e2 = edges[j];
                                    // Skip edges that share a vertex
                                    if (e1[0] === e2[0] || e1[0] === e2[1] || e1[1] === e2[0] || e1[1] === e2[1]) continue;
                                    var a = verts[e1[0]], b = verts[e1[1]], c = verts[e2[0]], d = verts[e2[1]];
                                    if (segIntersect(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1])) count++;
                                }
                            }
                            return count;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var crossings = countCrossings();

                            // Draw edges
                            for (var i = 0; i < edges.length; i++) {
                                var a = verts[edges[i][0]], b = verts[edges[i][1]];
                                ctx.strokeStyle = viz.colors.text;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(a[0], a[1]);
                                ctx.lineTo(b[0], b[1]);
                                ctx.stroke();
                            }

                            // Draw vertices
                            for (var j = 0; j < verts.length; j++) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(verts[j][0], verts[j][1], 8, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(j.toString(), verts[j][0], verts[j][1]);
                            }

                            // Status
                            var statusColor = crossings === 0 ? viz.colors.green : viz.colors.red;
                            var statusText = crossings === 0 ? 'No crossings! Planar embedding found.' : crossings + ' crossing' + (crossings > 1 ? 's' : '') + ' detected. Keep dragging!';
                            viz.screenText(statusText, viz.width / 2, 20, statusColor, 14);
                            viz.screenText('V=' + verts.length + '  E=' + edges.length + '  Planar: ' + (isPlanar ? 'Yes' : 'No'), viz.width / 2, viz.height - 15, viz.colors.text, 12);
                            viz.screenText('Drag vertices to rearrange', viz.width / 2, viz.height - 35, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-euler-formula',
                    title: "Euler's Formula: V - E + F = 2",
                    description: 'See Euler\'s formula verified on several polyhedra and planar graphs. Each example shows vertices, edges, and faces with the invariant V - E + F = 2.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var examples = [
                            { name: 'Tetrahedron', V: 4, E: 6, F: 4,
                              verts: [[280,60],[140,320],[420,320],[280,220]],
                              edges: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]] },
                            { name: 'Cube', V: 8, E: 12, F: 6,
                              verts: [[160,120],[340,120],[400,200],[220,200],[180,260],[360,260],[420,340],[240,340]],
                              edges: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]] },
                            { name: 'Octahedron', V: 6, E: 12, F: 8,
                              verts: [[280,40],[140,200],[420,200],[280,360],[200,120],[360,120]],
                              edges: [[0,4],[0,5],[4,1],[5,2],[1,3],[2,3],[4,5],[1,2],[0,1],[0,2],[4,3],[5,3]] },
                            { name: 'Triangle (K3)', V: 3, E: 3, F: 2,
                              verts: [[280,80],[140,320],[420,320]],
                              edges: [[0,1],[1,2],[2,0]] },
                            { name: 'K4', V: 4, E: 6, F: 4,
                              verts: [[280,60],[140,340],[420,340],[280,200]],
                              edges: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]] }
                        ];
                        var idx = 0;

                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;';
                        examples.forEach(function(ex, i) {
                            var opt = document.createElement('option');
                            opt.value = i; opt.textContent = ex.name;
                            sel.appendChild(opt);
                        });
                        sel.addEventListener('change', function() { idx = parseInt(sel.value); draw(); });
                        controls.appendChild(sel);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var ex = examples[idx];

                            // Title
                            viz.screenText(ex.name, viz.width / 2, 25, viz.colors.white, 16);

                            // Draw edges
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            for (var i = 0; i < ex.edges.length; i++) {
                                var a = ex.verts[ex.edges[i][0]], b = ex.verts[ex.edges[i][1]];
                                ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
                            }

                            // Draw vertices
                            for (var j = 0; j < ex.verts.length; j++) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(ex.verts[j][0], ex.verts[j][1], 8, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText((j + 1).toString(), ex.verts[j][0], ex.verts[j][1]);
                            }

                            // Euler formula display
                            var euler = ex.V - ex.E + ex.F;
                            var formula = 'V - E + F = ' + ex.V + ' - ' + ex.E + ' + ' + ex.F + ' = ' + euler;
                            viz.screenText(formula, viz.width / 2, viz.height - 50, viz.colors.white, 16);
                            var checkColor = euler === 2 ? viz.colors.green : viz.colors.red;
                            viz.screenText(euler === 2 ? 'Euler\'s formula confirmed!' : 'Something is off...', viz.width / 2, viz.height - 25, checkColor, 13);

                            // Stats
                            viz.screenText('V = ' + ex.V, 70, viz.height - 50, viz.colors.blue, 13);
                            viz.screenText('E = ' + ex.E, 70, viz.height - 35, viz.colors.teal, 13);
                            viz.screenText('F = ' + ex.F, 70, viz.height - 20, viz.colors.orange, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A connected planar graph has 10 vertices and 15 edges. How many faces does it have?',
                    hint: 'Apply Euler\'s formula: \\(V - E + F = 2\\).',
                    solution: '\\(F = 2 - V + E = 2 - 10 + 15 = 7\\) faces.'
                },
                {
                    question: 'Prove that every simple planar graph has a vertex of degree at most 5.',
                    hint: 'Use the edge bound \\(E \\leq 3V - 6\\) and the handshaking lemma \\(\\sum \\deg(v) = 2E\\).',
                    solution: 'Suppose every vertex has degree at least 6. Then \\(2E = \\sum \\deg(v) \\geq 6V\\), so \\(E \\geq 3V\\). But \\(E \\leq 3V - 6 < 3V\\), a contradiction. So some vertex has degree \\(\\leq 5\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Kuratowski's Theorem
        // ================================================================
        {
            id: 'sec-kuratowski',
            title: "Kuratowski's Theorem",
            content: `
<h2>Kuratowski's Theorem</h2>

<p>Euler's formula gives a <em>necessary</em> condition for planarity (edge bounds), but it is not <em>sufficient</em>. The Petersen graph satisfies \\(E \\leq 3V - 6\\) (\\(15 \\leq 3 \\cdot 10 - 6 = 24\\)) yet is not planar. We need a complete characterization.</p>

<h3>Subdivisions</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Subdivision)</div>
    <div class="env-body">
        <p>A <strong>subdivision</strong> of a graph \\(G\\) is obtained by replacing edges with paths (inserting degree-2 vertices along edges). Two graphs are <strong>homeomorphic</strong> if they have the same subdivision.</p>
    </div>
</div>

<h3>The Two Forbidden Subgraphs</h3>

<p>The two "minimal" non-planar graphs are:</p>
<ul>
    <li><strong>\\(K_5\\)</strong>: the complete graph on 5 vertices (every pair connected). It has \\(V = 5, E = 10\\), violating the bound \\(E \\leq 3V - 6 = 9\\).</li>
    <li><strong>\\(K_{3,3}\\)</strong>: the complete bipartite graph with 3 vertices on each side (every vertex in one part connected to every vertex in the other). It has \\(V = 6, E = 9\\). Since \\(K_{3,3}\\) is triangle-free, the relevant bound is \\(E \\leq 2V - 4 = 8\\), which is violated.</li>
</ul>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.3 (Kuratowski, 1930)</div>
    <div class="env-body">
        <p>A graph is planar if and only if it contains no subgraph that is a subdivision of \\(K_5\\) or \\(K_{3,3}\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Wagner's Formulation</div>
    <div class="env-body">
        <p>An equivalent formulation (Wagner, 1937): \\(G\\) is planar if and only if it has no \\(K_5\\) or \\(K_{3,3}\\) <em>minor</em> (where a minor is obtained by contracting edges and deleting vertices/edges).</p>
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">Why These Two?</div>
    <div class="env-body">
        <p>\\(K_5\\) fails planarity because of too many edges among 5 vertices. \\(K_{3,3}\\) fails for a subtler reason: there are not too many edges overall, but the bipartite structure forces crossings. Together, they are the only two "obstructions" to planarity, a remarkably clean characterization.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-k5-k33"></div>
`,
            visualizations: [
                {
                    id: 'viz-k5-k33',
                    title: 'K5 and K3,3: The Non-Planar Obstructions',
                    description: 'Try to drag the vertices of K5 and K3,3 to eliminate all crossings. You will fail, because these graphs are not planar!',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var mode = 'K5';
                        var k5Verts, k5Edges, k33Verts, k33Edges;

                        function initK5() {
                            k5Verts = [];
                            for (var i = 0; i < 5; i++) {
                                var a = -Math.PI/2 + 2*Math.PI*i/5;
                                k5Verts.push([160 + 100*Math.cos(a), 220 + 100*Math.sin(a)]);
                            }
                            k5Edges = [];
                            for (var u = 0; u < 5; u++)
                                for (var v = u + 1; v < 5; v++)
                                    k5Edges.push([u, v]);
                        }

                        function initK33() {
                            k33Verts = [];
                            for (var i = 0; i < 3; i++) k33Verts.push([370, 110 + i * 110]);
                            for (var j = 0; j < 3; j++) k33Verts.push([500, 110 + j * 110]);
                            k33Edges = [];
                            for (var u = 0; u < 3; u++)
                                for (var v = 0; v < 3; v++)
                                    k33Edges.push([u, v + 3]);
                        }

                        initK5();
                        initK33();

                        var btnK5 = VizEngine.createButton(controls, 'K5', function() { mode = 'K5'; draw(); });
                        var btnK33 = VizEngine.createButton(controls, 'K3,3', function() { mode = 'K3,3'; draw(); });

                        var dragIdx = -1;
                        viz.canvas.addEventListener('mousedown', function(e) {
                            var r = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - r.left, my = e.clientY - r.top;
                            var vv = mode === 'K5' ? k5Verts : k33Verts;
                            for (var i = 0; i < vv.length; i++) {
                                if ((mx-vv[i][0])*(mx-vv[i][0]) + (my-vv[i][1])*(my-vv[i][1]) < 200) {
                                    dragIdx = i; break;
                                }
                            }
                        });
                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (dragIdx < 0) return;
                            var r = viz.canvas.getBoundingClientRect();
                            var vv = mode === 'K5' ? k5Verts : k33Verts;
                            vv[dragIdx][0] = e.clientX - r.left;
                            vv[dragIdx][1] = e.clientY - r.top;
                            draw();
                        });
                        viz.canvas.addEventListener('mouseup', function() { dragIdx = -1; });
                        viz.canvas.addEventListener('mouseleave', function() { dragIdx = -1; });

                        function segIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
                            var denom = (bx-ax)*(dy-cy) - (by-ay)*(dx-cx);
                            if (Math.abs(denom) < 1e-10) return false;
                            var t = ((cx-ax)*(dy-cy) - (cy-ay)*(dx-cx)) / denom;
                            var u = ((cx-ax)*(by-ay) - (cy-ay)*(bx-ax)) / denom;
                            return t > 0.01 && t < 0.99 && u > 0.01 && u < 0.99;
                        }

                        function countCrossings(vv, ee) {
                            var count = 0;
                            for (var i = 0; i < ee.length; i++) {
                                for (var j = i + 1; j < ee.length; j++) {
                                    var e1 = ee[i], e2 = ee[j];
                                    if (e1[0] === e2[0] || e1[0] === e2[1] || e1[1] === e2[0] || e1[1] === e2[1]) continue;
                                    var a = vv[e1[0]], b = vv[e1[1]], c = vv[e2[0]], d = vv[e2[1]];
                                    if (segIntersect(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1])) count++;
                                }
                            }
                            return count;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw K5
                            var k5Cross = countCrossings(k5Verts, k5Edges);
                            viz.screenText('K5', 160, 30, mode === 'K5' ? viz.colors.white : viz.colors.text, 16);
                            viz.screenText('Crossings: ' + k5Cross, 160, 50, k5Cross === 0 ? viz.colors.green : viz.colors.orange, 12);
                            ctx.strokeStyle = (mode === 'K5' ? viz.colors.teal : viz.colors.text + '66');
                            ctx.lineWidth = mode === 'K5' ? 2 : 1;
                            for (var i = 0; i < k5Edges.length; i++) {
                                var a = k5Verts[k5Edges[i][0]], b = k5Verts[k5Edges[i][1]];
                                ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
                            }
                            for (var j = 0; j < k5Verts.length; j++) {
                                ctx.fillStyle = mode === 'K5' ? viz.colors.blue : viz.colors.blue + '88';
                                ctx.beginPath(); ctx.arc(k5Verts[j][0], k5Verts[j][1], 8, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText((j+1).toString(), k5Verts[j][0], k5Verts[j][1]);
                            }

                            // Draw K3,3
                            var k33Cross = countCrossings(k33Verts, k33Edges);
                            viz.screenText('K3,3', 435, 30, mode === 'K3,3' ? viz.colors.white : viz.colors.text, 16);
                            viz.screenText('Crossings: ' + k33Cross, 435, 50, k33Cross === 0 ? viz.colors.green : viz.colors.orange, 12);
                            ctx.strokeStyle = (mode === 'K3,3' ? viz.colors.teal : viz.colors.text + '66');
                            ctx.lineWidth = mode === 'K3,3' ? 2 : 1;
                            for (var i2 = 0; i2 < k33Edges.length; i2++) {
                                var c = k33Verts[k33Edges[i2][0]], d = k33Verts[k33Edges[i2][1]];
                                ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
                            }
                            var partColors = [viz.colors.purple, viz.colors.orange];
                            for (var j2 = 0; j2 < k33Verts.length; j2++) {
                                ctx.fillStyle = mode === 'K3,3' ? partColors[j2 < 3 ? 0 : 1] : partColors[j2 < 3 ? 0 : 1] + '88';
                                ctx.beginPath(); ctx.arc(k33Verts[j2][0], k33Verts[j2][1], 8, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText((j2+1).toString(), k33Verts[j2][0], k33Verts[j2][1]);
                            }

                            // Divider
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(280, 60); ctx.lineTo(280, 400); ctx.stroke();
                            ctx.setLineDash([]);

                            viz.screenText('Try to eliminate all crossings by dragging. (You can\'t!)', viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the Petersen graph is not planar by finding a subdivision of \\(K_{3,3}\\) within it.',
                    hint: 'Label the outer cycle vertices 0-4 and inner star vertices 5-9. Find three outer and three inner vertices forming a \\(K_{3,3}\\) subdivision using the edges and paths of the Petersen graph.',
                    solution: 'Take outer vertices \\(\\{0, 2, 4\\}\\) and inner vertices \\(\\{5, 7, 9\\}\\). Vertex 0 connects to 5 directly, to 7 via \\(0{-}1{-}6{-}8{-}3{-}7\\)... wait, more carefully: use the known subdivision. The Petersen graph minus any edge is still non-planar; it contains \\(K_{3,3}\\) as a minor. One explicit subdivision: partition vertices into \\(\\{0,2,4\\}\\) and \\(\\{6,8,5\\}\\); the paths through degree-2 subdivisions of the remaining vertices give \\(K_{3,3}\\).'
                },
                {
                    question: 'A graph \\(G\\) has 7 vertices and 13 edges. Can \\(G\\) be planar?',
                    hint: 'Check the edge bound from Corollary 13.2.',
                    solution: 'For a simple planar graph, \\(E \\leq 3V - 6 = 3(7) - 6 = 15\\). Since \\(13 \\leq 15\\), the bound alone does not rule it out. Further analysis is needed (the answer depends on the specific graph). For instance, \\(K_7\\) has 21 edges and is not planar, but some graphs with 7 vertices and 13 edges are planar.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Graph Coloring
        // ================================================================
        {
            id: 'sec-coloring',
            title: 'Graph Coloring',
            content: `
<h2>Graph Coloring</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Proper Coloring)</div>
    <div class="env-body">
        <p>A <strong>proper \\(k\\)-coloring</strong> of a graph \\(G\\) is an assignment of colors \\(\\{1, 2, \\ldots, k\\}\\) to the vertices such that no two adjacent vertices share the same color. The minimum \\(k\\) for which a proper \\(k\\)-coloring exists is the <strong>chromatic number</strong>, denoted \\(\\chi(G)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Basic Examples</div>
    <div class="env-body">
        <ul>
            <li>\\(\\chi(K_n) = n\\): every vertex is adjacent to every other, so all need distinct colors.</li>
            <li>\\(\\chi(C_n) = 2\\) if \\(n\\) is even, \\(3\\) if \\(n\\) is odd. Even cycles are bipartite; odd cycles need a third color for the closing vertex.</li>
            <li>\\(\\chi(T) = 1\\) if the tree has one vertex, \\(2\\) otherwise. Trees are bipartite.</li>
        </ul>
    </div>
</div>

<h3>Bounds on the Chromatic Number</h3>

<div class="env-block theorem">
    <div class="env-title">Proposition 13.4</div>
    <div class="env-body">
        <p>For any graph \\(G\\):</p>
        <ol>
            <li>\\(\\chi(G) \\geq \\omega(G)\\), where \\(\\omega(G)\\) is the size of the largest clique.</li>
            <li>\\(\\chi(G) \\leq \\Delta(G) + 1\\), where \\(\\Delta(G)\\) is the maximum degree.</li>
        </ol>
    </div>
</div>

<h3>The Greedy Algorithm</h3>

<p>The <strong>greedy coloring</strong> algorithm processes vertices in some order \\(v_1, v_2, \\ldots, v_n\\) and assigns each vertex the smallest color not used by its already-colored neighbors.</p>

<div class="env-block theorem">
    <div class="env-title">Proposition 13.5 (Greedy Bound)</div>
    <div class="env-body">
        <p>The greedy algorithm uses at most \\(\\Delta(G) + 1\\) colors, regardless of vertex ordering. With a clever ordering, it can sometimes achieve \\(\\chi(G)\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Brooks' Theorem (1941)</div>
    <div class="env-body">
        <p>If \\(G\\) is a connected graph that is neither a complete graph nor an odd cycle, then \\(\\chi(G) \\leq \\Delta(G)\\). This improves the greedy bound by 1 for most graphs.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-graph-coloring"></div>
`,
            visualizations: [
                {
                    id: 'viz-graph-coloring',
                    title: 'Greedy Graph Coloring',
                    description: 'Watch the greedy coloring algorithm color vertices one by one, always choosing the smallest available color. Try different graphs and vertex orderings.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var colorPalette = ['#58a6ff', '#f85149', '#3fb950', '#d29922', '#bc8cff', '#f778ba', '#f0883e', '#3fb9a0'];

                        var graphs = {
                            'Petersen': {
                                verts: (function() {
                                    var v = [];
                                    for (var i = 0; i < 5; i++) {
                                        var a = -Math.PI/2 + 2*Math.PI*i/5;
                                        v.push([280 + 150*Math.cos(a), 200 + 150*Math.sin(a)]);
                                    }
                                    for (var j = 0; j < 5; j++) {
                                        var b = -Math.PI/2 + 2*Math.PI*j/5;
                                        v.push([280 + 60*Math.cos(b), 200 + 60*Math.sin(b)]);
                                    }
                                    return v;
                                })(),
                                edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[5,7],[7,9],[9,6],[6,8],[8,5],[0,5],[1,6],[2,7],[3,8],[4,9]],
                                chi: 3
                            },
                            'Cycle C5': {
                                verts: (function() {
                                    var v = [];
                                    for (var i = 0; i < 5; i++) {
                                        var a = -Math.PI/2 + 2*Math.PI*i/5;
                                        v.push([280 + 120*Math.cos(a), 210 + 120*Math.sin(a)]);
                                    }
                                    return v;
                                })(),
                                edges: [[0,1],[1,2],[2,3],[3,4],[4,0]],
                                chi: 3
                            },
                            'Cycle C6': {
                                verts: (function() {
                                    var v = [];
                                    for (var i = 0; i < 6; i++) {
                                        var a = -Math.PI/2 + 2*Math.PI*i/6;
                                        v.push([280 + 120*Math.cos(a), 210 + 120*Math.sin(a)]);
                                    }
                                    return v;
                                })(),
                                edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
                                chi: 2
                            },
                            'K4': {
                                verts: [[200,100],[360,100],[360,300],[200,300]],
                                edges: [[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]],
                                chi: 4
                            },
                            'Bipartite K2,3': {
                                verts: [[180,140],[180,280],[380,100],[380,210],[380,320]],
                                edges: [[0,2],[0,3],[0,4],[1,2],[1,3],[1,4]],
                                chi: 2
                            }
                        };
                        var graphNames = Object.keys(graphs);
                        var currentName = graphNames[0];
                        var vertColors = [];
                        var animStep = -1;
                        var animTimer = null;

                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        graphNames.forEach(function(name) {
                            var opt = document.createElement('option');
                            opt.value = name; opt.textContent = name;
                            sel.appendChild(opt);
                        });
                        sel.addEventListener('change', function() {
                            currentName = sel.value; resetAnim();
                        });
                        controls.appendChild(sel);

                        VizEngine.createButton(controls, 'Run Greedy', function() { startAnim(); });
                        VizEngine.createButton(controls, 'Reset', function() { resetAnim(); });

                        function resetAnim() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            var g = graphs[currentName];
                            vertColors = new Array(g.verts.length).fill(-1);
                            animStep = -1;
                            draw();
                        }

                        function greedyColor(vi, g) {
                            var used = {};
                            for (var e = 0; e < g.edges.length; e++) {
                                var ei = g.edges[e];
                                if (ei[0] === vi && vertColors[ei[1]] >= 0) used[vertColors[ei[1]]] = true;
                                if (ei[1] === vi && vertColors[ei[0]] >= 0) used[vertColors[ei[0]]] = true;
                            }
                            for (var c = 0; c < colorPalette.length; c++) {
                                if (!used[c]) return c;
                            }
                            return 0;
                        }

                        function startAnim() {
                            resetAnim();
                            var g = graphs[currentName];
                            animStep = 0;
                            animTimer = setInterval(function() {
                                if (animStep >= g.verts.length) {
                                    clearInterval(animTimer); animTimer = null;
                                    return;
                                }
                                vertColors[animStep] = greedyColor(animStep, g);
                                animStep++;
                                draw();
                            }, 600);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = graphs[currentName];

                            viz.screenText('Greedy Coloring: ' + currentName, viz.width / 2, 25, viz.colors.white, 15);

                            // Edges
                            ctx.strokeStyle = viz.colors.text + '88';
                            ctx.lineWidth = 2;
                            for (var i = 0; i < g.edges.length; i++) {
                                var a = g.verts[g.edges[i][0]], b = g.verts[g.edges[i][1]];
                                ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
                            }

                            // Vertices
                            var maxColorUsed = -1;
                            for (var j = 0; j < g.verts.length; j++) {
                                var col = vertColors[j] >= 0 ? colorPalette[vertColors[j]] : viz.colors.text + '44';
                                if (vertColors[j] > maxColorUsed) maxColorUsed = vertColors[j];
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(g.verts[j][0], g.verts[j][1], 14, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText('v' + j, g.verts[j][0], g.verts[j][1]);
                            }

                            // Info
                            var colorsUsed = maxColorUsed + 1;
                            if (colorsUsed > 0) {
                                viz.screenText('Colors used: ' + colorsUsed, viz.width / 2, viz.height - 45, viz.colors.white, 13);
                            }
                            viz.screenText('Chromatic number chi(G) = ' + g.chi, viz.width / 2, viz.height - 25, viz.colors.teal, 13);

                            // Legend
                            for (var c = 0; c <= maxColorUsed && c < colorPalette.length; c++) {
                                ctx.fillStyle = colorPalette[c];
                                ctx.fillRect(20 + c * 50, viz.height - 70, 14, 14);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText('C' + (c+1), 38 + c * 50, viz.height - 63);
                            }
                        }
                        resetAnim();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'What is the chromatic number of the wheel graph \\(W_n\\) (a cycle \\(C_n\\) with an extra vertex connected to all cycle vertices)?',
                    hint: 'The center vertex is adjacent to all others, so it needs its own color. The remaining cycle can be 2-colored if even, 3-colored if odd.',
                    solution: 'The center needs a unique color. The cycle \\(C_n\\) needs 2 colors if \\(n\\) is even, 3 if odd. So \\(\\chi(W_n) = 3\\) if \\(n\\) is even, \\(4\\) if \\(n\\) is odd.'
                },
                {
                    question: 'Give an example of a graph where the greedy algorithm, with a bad vertex ordering, uses more than \\(\\chi(G)\\) colors.',
                    hint: 'Consider a path on 4 vertices \\(v_1{-}v_2{-}v_3{-}v_4\\). Its chromatic number is 2. Try the ordering \\(v_1, v_3, v_2, v_4\\).',
                    solution: 'Take the path \\(v_1{-}v_2{-}v_3{-}v_4\\), which has \\(\\chi = 2\\). Order: \\(v_1, v_3, v_2, v_4\\). Greedy gives \\(v_1\\) color 1, \\(v_3\\) color 1 (no conflict), \\(v_2\\) color 2 (adjacent to \\(v_1\\) and \\(v_3\\), both color 1), \\(v_4\\) color 1. This uses 2 colors (optimal). But for the crown graph \\(K_{3,3}\\) minus a perfect matching with a bad ordering, greedy can use 3 colors on a bipartite (\\(\\chi=2\\)) graph.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: The Four Color Theorem
        // ================================================================
        {
            id: 'sec-four-color',
            title: 'The Four Color Theorem',
            content: `
<h2>The Four Color Theorem</h2>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.6 (Four Color Theorem, Appel and Haken, 1976)</div>
    <div class="env-body">
        <p>Every planar graph is 4-colorable. That is, if \\(G\\) is planar, then \\(\\chi(G) \\leq 4\\).</p>
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">What This Says About Maps</div>
    <div class="env-body">
        <p>Any map of countries (where each country is a contiguous region) can be colored with at most 4 colors so that no two adjacent countries share a color. This is the map-coloring formulation that drove over a century of mathematical effort.</p>
    </div>
</div>

<h3>Historical Timeline</h3>

<ul>
    <li><strong>1852:</strong> Francis Guthrie, a law student, conjectures that 4 colors suffice for any map while coloring the counties of England.</li>
    <li><strong>1879:</strong> Alfred Kempe publishes a "proof" in the <em>American Journal of Mathematics</em>. It is accepted for over a decade.</li>
    <li><strong>1890:</strong> Percy Heawood finds a fatal flaw in Kempe's proof, but salvages the <strong>Five Color Theorem</strong>: every planar graph is 5-colorable.</li>
    <li><strong>1976:</strong> Kenneth Appel and Wolfgang Haken prove the Four Color Theorem using a computer to check 1,936 reducible configurations. It is the first major theorem whose proof requires a computer.</li>
    <li><strong>1997:</strong> Robertson, Sanders, Seymour, and Thomas give a simplified proof, still computer-assisted, reducing the configurations to 633.</li>
    <li><strong>2005:</strong> Gonthier formalizes the proof in the Coq proof assistant, providing machine-verified certainty.</li>
</ul>

<h3>The Five Color Theorem</h3>

<p>The Five Color Theorem is provable by hand and illustrates the key ideas.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.7 (Five Color Theorem, Heawood, 1890)</div>
    <div class="env-body">
        <p>Every planar graph is 5-colorable.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>By induction on \\(|V|\\). Since every planar graph has a vertex \\(v\\) of degree \\(\\leq 5\\) (from the edge bound), remove \\(v\\) and 5-color \\(G - v\\) by induction. If \\(v\\) has fewer than 5 neighbors, some color is unused among them, and we give it to \\(v\\). If \\(v\\) has exactly 5 neighbors all with distinct colors, Kempe's chain argument shows we can always recolor two of them to free a color for \\(v\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why Is the Gap from 5 to 4 So Hard?</div>
    <div class="env-body">
        <p>Kempe's chain argument works perfectly for 5 colors. For 4 colors, when \\(v\\) has 4 neighbors with all 4 colors, you try to swap Kempe chains on two pairs of colors simultaneously. The chains can interfere with each other, and this is where Kempe's original proof broke. Resolving these interferences ultimately required the computer-assisted discharging method of Appel and Haken.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-four-color-map"></div>
`,
            visualizations: [
                {
                    id: 'viz-four-color-map',
                    title: 'Four Color Map Challenge',
                    description: 'Color this map using at most 4 colors so that no two adjacent regions share a color. Click a region, then click a color.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        // A simple map of 8 regions with adjacency
                        var regions = [
                            { name: 'A', cx: 140, cy: 120, path: [[80,60],[200,60],[200,180],[80,180]], adj: [1,3] },
                            { name: 'B', cx: 310, cy: 100, path: [[200,60],[420,60],[420,140],[200,140]], adj: [0,2,3,4] },
                            { name: 'C', cx: 480, cy: 120, path: [[420,60],[540,60],[540,180],[420,180]], adj: [1,4] },
                            { name: 'D', cx: 170, cy: 250, path: [[80,180],[230,140],[280,250],[80,320]], adj: [0,1,5,6] },
                            { name: 'E', cx: 420, cy: 240, path: [[280,140],[420,140],[540,180],[540,320],[380,320],[280,250]], adj: [1,2,5,7] },
                            { name: 'F', cx: 280, cy: 280, path: [[280,250],[380,320],[280,350],[180,320]], adj: [3,4,6,7] },
                            { name: 'G', cx: 130, cy: 360, path: [[80,320],[180,320],[280,350],[280,420],[80,420]], adj: [3,5,7] },
                            { name: 'H', cx: 410, cy: 380, path: [[280,350],[380,320],[540,320],[540,420],[280,420]], adj: [4,5,6] }
                        ];
                        var regionColors = new Array(regions.length).fill(-1);
                        var selectedRegion = -1;
                        var palColors = ['#58a6ff', '#f85149', '#3fb950', '#d29922'];
                        var palNames = ['Blue', 'Red', 'Green', 'Yellow'];

                        // Color buttons
                        var colorDiv = document.createElement('div');
                        colorDiv.style.cssText = 'display:flex;gap:6px;align-items:center;';
                        var clabel = document.createElement('span');
                        clabel.style.cssText = 'color:#8b949e;font-size:0.78rem;';
                        clabel.textContent = 'Colors:';
                        colorDiv.appendChild(clabel);
                        palColors.forEach(function(col, ci) {
                            var btn = document.createElement('button');
                            btn.style.cssText = 'width:28px;height:28px;border:2px solid #30363d;border-radius:4px;background:' + col + ';cursor:pointer;';
                            btn.addEventListener('click', function() {
                                if (selectedRegion >= 0) {
                                    regionColors[selectedRegion] = ci;
                                    selectedRegion = -1;
                                    draw();
                                }
                            });
                            colorDiv.appendChild(btn);
                        });
                        controls.appendChild(colorDiv);

                        VizEngine.createButton(controls, 'Reset', function() {
                            regionColors = new Array(regions.length).fill(-1);
                            selectedRegion = -1;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Auto-Solve', function() {
                            // Simple greedy 4-color
                            for (var i = 0; i < regions.length; i++) {
                                var used = {};
                                for (var a = 0; a < regions[i].adj.length; a++) {
                                    var nc = regionColors[regions[i].adj[a]];
                                    if (nc >= 0) used[nc] = true;
                                }
                                for (var c = 0; c < 4; c++) {
                                    if (!used[c]) { regionColors[i] = c; break; }
                                }
                            }
                            draw();
                        });

                        function pointInPolygon(px, py, poly) {
                            var inside = false;
                            for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                                var xi = poly[i][0], yi = poly[i][1];
                                var xj = poly[j][0], yj = poly[j][1];
                                if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
                                    inside = !inside;
                                }
                            }
                            return inside;
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var r = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - r.left, my = e.clientY - r.top;
                            for (var i = 0; i < regions.length; i++) {
                                if (pointInPolygon(mx, my, regions[i].path)) {
                                    selectedRegion = i;
                                    draw();
                                    return;
                                }
                            }
                            selectedRegion = -1;
                            draw();
                        });

                        function checkConflicts() {
                            var conflicts = 0;
                            for (var i = 0; i < regions.length; i++) {
                                if (regionColors[i] < 0) continue;
                                for (var a = 0; a < regions[i].adj.length; a++) {
                                    var nb = regions[i].adj[a];
                                    if (nb > i && regionColors[nb] === regionColors[i]) conflicts++;
                                }
                            }
                            return conflicts;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Four Color Map Challenge', viz.width / 2, 25, viz.colors.white, 15);
                            viz.screenText('Click a region, then click a color', viz.width / 2, 45, viz.colors.text, 11);

                            // Draw regions
                            for (var i = 0; i < regions.length; i++) {
                                var reg = regions[i];
                                ctx.beginPath();
                                reg.path.forEach(function(p, idx) {
                                    idx === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
                                });
                                ctx.closePath();

                                var fillColor = regionColors[i] >= 0 ? palColors[regionColors[i]] + '88' : '#1a1a4066';
                                if (i === selectedRegion) fillColor = '#ffffff33';
                                ctx.fillStyle = fillColor;
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.white;
                                ctx.lineWidth = i === selectedRegion ? 3 : 1.5;
                                ctx.stroke();

                                // Label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(reg.name, reg.cx, reg.cy);
                            }

                            // Status
                            var allColored = regionColors.every(function(c) { return c >= 0; });
                            var conflicts = checkConflicts();
                            if (allColored && conflicts === 0) {
                                var numUsed = new Set(regionColors).size;
                                viz.screenText('Proper coloring with ' + numUsed + ' colors!', viz.width / 2, viz.height - 15, viz.colors.green, 14);
                            } else if (conflicts > 0) {
                                viz.screenText(conflicts + ' conflict' + (conflicts > 1 ? 's' : '') + ' (adjacent regions share a color)', viz.width / 2, viz.height - 15, viz.colors.red, 13);
                            } else {
                                var remaining = regionColors.filter(function(c) { return c < 0; }).length;
                                viz.screenText(remaining + ' region' + (remaining > 1 ? 's' : '') + ' left to color', viz.width / 2, viz.height - 15, viz.colors.text, 13);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove the Five Color Theorem by induction. Carefully explain how Kempe chains are used in the case where a vertex of degree 5 has 5 differently-colored neighbors.',
                    hint: 'After removing a degree-5 vertex and coloring the rest, if all 5 neighbors have distinct colors, consider a Kempe chain from one neighbor using colors 1 and 3. If it does not reach another neighbor with color 3, swap to free up a color.',
                    solution: 'Induction on \\(V\\). Base case is trivial. For the inductive step, take \\(v\\) with \\(\\deg(v) \\leq 5\\). Remove \\(v\\), 5-color \\(G - v\\). If \\(v\\) has \\(\\leq 4\\) neighbors or two neighbors share a color, assign \\(v\\) an unused color. If \\(v\\) has 5 neighbors \\(v_1, \\ldots, v_5\\) with distinct colors \\(1, \\ldots, 5\\), consider the Kempe chain of colors 1 and 3 starting at \\(v_1\\). If this chain does not reach \\(v_3\\), swap colors 1 and 3 in the chain; now \\(v_1\\) has color 3, freeing color 1 for \\(v\\). If it does reach \\(v_3\\), then consider the chain of colors 2 and 4 from \\(v_2\\). This chain cannot reach \\(v_4\\) (it would cross the 1-3 chain, which forms a connected path from \\(v_1\\) to \\(v_3\\) in the planar embedding). So swap colors 2 and 4 in that chain, freeing color 2 for \\(v\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Chromatic Polynomial
        // ================================================================
        {
            id: 'sec-chromatic-polynomial',
            title: 'Chromatic Polynomial',
            content: `
<h2>The Chromatic Polynomial</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Chromatic Polynomial)</div>
    <div class="env-body">
        <p>For a graph \\(G\\) and positive integer \\(k\\), the <strong>chromatic polynomial</strong> \\(P(G, k)\\) counts the number of proper \\(k\\)-colorings of \\(G\\). Despite the name, \\(P(G, k)\\) is always a polynomial in \\(k\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Basic Examples</div>
    <div class="env-body">
        <ul>
            <li><strong>Empty graph \\(\\overline{K_n}\\):</strong> No edges, so every coloring is proper. \\(P(\\overline{K_n}, k) = k^n\\).</li>
            <li><strong>Complete graph \\(K_n\\):</strong> All vertices must get different colors. \\(P(K_n, k) = k(k-1)(k-2) \\cdots (k-n+1)\\).</li>
            <li><strong>Single edge \\(K_2\\):</strong> \\(P(K_2, k) = k(k-1)\\).</li>
            <li><strong>Tree on \\(n\\) vertices:</strong> \\(P(T_n, k) = k(k-1)^{n-1}\\).</li>
        </ul>
    </div>
</div>

<h3>Deletion-Contraction</h3>

<p>The key recursive tool for computing chromatic polynomials:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.8 (Deletion-Contraction)</div>
    <div class="env-body">
        <p>For any edge \\(e = uv\\) of \\(G\\):</p>
        \\[P(G, k) = P(G - e, k) - P(G / e, k)\\]
        <p>where \\(G - e\\) is \\(G\\) with edge \\(e\\) deleted, and \\(G / e\\) is \\(G\\) with edge \\(e\\) contracted (merge \\(u\\) and \\(v\\) into one vertex).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Idea</div>
    <div class="env-body">
        <p>Colorings of \\(G - e\\) can be split into two groups: those where \\(u\\) and \\(v\\) get different colors (these are exactly the proper colorings of \\(G\\)) and those where \\(u\\) and \\(v\\) get the same color (these correspond to proper colorings of \\(G / e\\)). So \\(P(G - e, k) = P(G, k) + P(G / e, k)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Triangle \\(C_3\\)</div>
    <div class="env-body">
        <p>Take \\(C_3\\) with edge \\(e\\). Then \\(C_3 - e = P_3\\) (a path) and \\(C_3 / e = K_2\\).</p>
        \\[P(C_3, k) = P(P_3, k) - P(K_2, k) = k(k-1)^2 - k(k-1) = k(k-1)(k-2).\\]
        <p>This equals \\(P(K_3, k)\\), confirming that \\(C_3 = K_3\\).</p>
    </div>
</div>

<h3>Properties of the Chromatic Polynomial</h3>

<div class="env-block theorem">
    <div class="env-title">Proposition 13.9</div>
    <div class="env-body">
        <p>For a graph \\(G\\) on \\(n\\) vertices and \\(m\\) edges:</p>
        <ol>
            <li>\\(P(G, k)\\) is a monic polynomial of degree \\(n\\).</li>
            <li>The coefficient of \\(k^{n-1}\\) is \\(-m\\).</li>
            <li>\\(P(G, 0) = 0\\) (no coloring with 0 colors).</li>
            <li>The chromatic number \\(\\chi(G)\\) is the smallest positive integer \\(k\\) with \\(P(G, k) > 0\\).</li>
            <li>The coefficients alternate in sign.</li>
        </ol>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-chromatic-polynomial"></div>
`,
            visualizations: [
                {
                    id: 'viz-chromatic-polynomial',
                    title: 'Chromatic Polynomial by Deletion-Contraction',
                    description: 'See the chromatic polynomial computed for several graphs. The deletion-contraction tree shows how the recursion unfolds.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var examples = [
                            {
                                name: 'K3 (Triangle)',
                                poly: 'P(K3, k) = k(k-1)(k-2)',
                                evalFn: function(k) { return k * (k-1) * (k-2); },
                                tree: [
                                    { label: 'K3', x: 280, y: 60 },
                                    { label: 'P3', x: 160, y: 150, edge: 'delete' },
                                    { label: 'K2', x: 400, y: 150, edge: 'contract' },
                                    { label: 'k(k-1)^2', x: 160, y: 240 },
                                    { label: 'k(k-1)', x: 400, y: 240 }
                                ],
                                treeEdges: [[0,1],[0,2],[1,3],[2,4]]
                            },
                            {
                                name: 'C4 (4-cycle)',
                                poly: 'P(C4, k) = k^4 - 4k^3 + 6k^2 - 3k',
                                evalFn: function(k) { return k*k*k*k - 4*k*k*k + 6*k*k - 3*k; },
                                tree: [
                                    { label: 'C4', x: 280, y: 50 },
                                    { label: 'P4', x: 140, y: 130, edge: 'delete' },
                                    { label: 'K3', x: 420, y: 130, edge: 'contract' },
                                    { label: 'k(k-1)^3', x: 140, y: 220 },
                                    { label: 'k(k-1)(k-2)', x: 420, y: 220 }
                                ],
                                treeEdges: [[0,1],[0,2],[1,3],[2,4]]
                            },
                            {
                                name: 'K4',
                                poly: 'P(K4, k) = k(k-1)(k-2)(k-3)',
                                evalFn: function(k) { return k*(k-1)*(k-2)*(k-3); },
                                tree: [
                                    { label: 'K4', x: 280, y: 50 },
                                    { label: 'K4-e', x: 140, y: 130, edge: 'delete' },
                                    { label: 'K3', x: 420, y: 130, edge: 'contract' },
                                    { label: '...', x: 140, y: 220 },
                                    { label: 'k(k-1)(k-2)', x: 420, y: 220 }
                                ],
                                treeEdges: [[0,1],[0,2],[1,3],[2,4]]
                            },
                            {
                                name: 'Path P4',
                                poly: 'P(P4, k) = k(k-1)^3',
                                evalFn: function(k) { return k * Math.pow(k-1, 3); },
                                tree: [
                                    { label: 'P4 (tree)', x: 280, y: 100 },
                                    { label: 'k(k-1)^3', x: 280, y: 220 }
                                ],
                                treeEdges: [[0,1]]
                            }
                        ];
                        var idx = 0;

                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        examples.forEach(function(ex, i) {
                            var opt = document.createElement('option');
                            opt.value = i; opt.textContent = ex.name;
                            sel.appendChild(opt);
                        });
                        sel.addEventListener('change', function() { idx = parseInt(sel.value); draw(); });
                        controls.appendChild(sel);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var ex = examples[idx];

                            viz.screenText(ex.name + ': Deletion-Contraction', viz.width / 2, 25, viz.colors.white, 15);

                            // Draw tree
                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 1.5;
                            for (var i = 0; i < ex.treeEdges.length; i++) {
                                var from = ex.tree[ex.treeEdges[i][0]];
                                var to = ex.tree[ex.treeEdges[i][1]];
                                ctx.beginPath(); ctx.moveTo(from.x, from.y + 12); ctx.lineTo(to.x, to.y - 12); ctx.stroke();
                                // Edge label
                                if (to.edge) {
                                    var mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
                                    var col = to.edge === 'delete' ? viz.colors.red : viz.colors.teal;
                                    ctx.fillStyle = col;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(to.edge === 'delete' ? 'G-e' : 'G/e', mx + (to.edge === 'delete' ? -20 : 20), my);
                                }
                            }

                            // Draw nodes
                            for (var j = 0; j < ex.tree.length; j++) {
                                var node = ex.tree[j];
                                ctx.fillStyle = viz.colors.bg;
                                ctx.fillRect(node.x - 50, node.y - 12, 100, 24);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(node.label, node.x, node.y);
                            }

                            // Polynomial
                            viz.screenText(ex.poly, viz.width / 2, 290, viz.colors.teal, 14);

                            // Evaluation table
                            viz.screenText('k:', 80, 320, viz.colors.text, 12);
                            viz.screenText('P(G,k):', 80, 340, viz.colors.text, 12);
                            for (var k = 0; k <= 6; k++) {
                                var xp = 150 + k * 55;
                                var val = ex.evalFn(k);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(k.toString(), xp, 320);
                                ctx.fillStyle = val > 0 ? viz.colors.green : (val === 0 ? viz.colors.red : viz.colors.orange);
                                ctx.fillText(val.toString(), xp, 340);
                            }

                            // Find chi
                            var chi = 0;
                            for (var kk = 1; kk <= 10; kk++) {
                                if (ex.evalFn(kk) > 0) { chi = kk; break; }
                            }
                            viz.screenText('chi(G) = ' + chi + '  (smallest k with P(G,k) > 0)', viz.width / 2, 375, viz.colors.purple, 13);
                            viz.screenText('P(G, k) = P(G-e, k) - P(G/e, k)', viz.width / 2, 400, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the chromatic polynomial of the cycle \\(C_4\\) using deletion-contraction.',
                    hint: 'Delete an edge of \\(C_4\\) to get \\(P_4\\), and contract it to get \\(K_3\\). Then \\(P(C_4,k) = P(P_4,k) - P(K_3,k)\\).',
                    solution: '\\(P(P_4, k) = k(k-1)^3\\). \\(P(K_3, k) = k(k-1)(k-2)\\). So \\(P(C_4, k) = k(k-1)^3 - k(k-1)(k-2) = k(k-1)[(k-1)^2 - (k-2)] = k(k-1)(k^2 - 3k + 3)\\). Expanding: \\(k^4 - 4k^3 + 6k^2 - 3k\\).'
                },
                {
                    question: 'Show that the chromatic polynomial of any tree on \\(n\\) vertices is \\(k(k-1)^{n-1}\\).',
                    hint: 'Use induction on \\(n\\). A tree on \\(n\\) vertices has a leaf (degree 1 vertex).',
                    solution: 'Base case: \\(n = 1\\), \\(P = k\\). For \\(n \\geq 2\\), pick a leaf \\(v\\) with unique neighbor \\(u\\). The root vertex can be any of \\(k\\) colors; each subsequent vertex along any branch from root to leaf must differ from its parent, giving \\(k-1\\) choices. By induction (or directly by the multiplication rule along the unique path), \\(P(T_n, k) = k(k-1)^{n-1}\\).'
                },
                {
                    question: 'If \\(P(G, k) = k^4 - 5k^3 + 9k^2 - 7k + 2\\), how many vertices and edges does \\(G\\) have? What is \\(\\chi(G)\\)?',
                    hint: 'The degree of \\(P\\) is the number of vertices. The coefficient of \\(k^{n-1}\\) is \\(-m\\).',
                    solution: 'Degree 4, so \\(n = 4\\) vertices. Coefficient of \\(k^3\\) is \\(-5\\), so \\(m = 5\\) edges. Check: \\(P(G,1) = 1-5+9-7+2 = 0\\), \\(P(G,2) = 16-40+36-14+2 = 0\\), \\(P(G,3) = 81-135+81-21+2 = 8 > 0\\). So \\(\\chi(G) = 3\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to the Next Chapter
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead</h2>

<p>Planarity and coloring showcase the interplay between combinatorial structure and topology. Here are some directions this leads:</p>

<h3>What We Have Established</h3>
<ul>
    <li>Planar graphs are characterized by forbidden subdivisions (Kuratowski) and satisfy Euler's formula \\(V - E + F = 2\\).</li>
    <li>Every planar graph can be properly colored with at most 4 colors (Four Color Theorem).</li>
    <li>The chromatic polynomial \\(P(G,k)\\) encodes all coloring information and can be computed by deletion-contraction.</li>
</ul>

<h3>Connections and Extensions</h3>
<ul>
    <li><strong>Surfaces and genus:</strong> Every graph can be embedded without crossings on <em>some</em> surface. The minimum genus surface needed is a graph invariant. The torus, for example, has Euler characteristic 0, so the formula becomes \\(V - E + F = 0\\).</li>
    <li><strong>List coloring:</strong> Instead of coloring from a common palette, each vertex has its own list of allowed colors. The <em>choosability</em> or <em>list chromatic number</em> can differ from \\(\\chi(G)\\).</li>
    <li><strong>Edge coloring:</strong> Color edges instead of vertices. Vizing's theorem says \\(\\chi'(G)\\) is either \\(\\Delta(G)\\) or \\(\\Delta(G) + 1\\).</li>
    <li><strong>The Tutte polynomial:</strong> A two-variable polynomial \\(T(G; x, y)\\) that generalizes the chromatic polynomial, counts spanning trees, and connects to statistical mechanics.</li>
    <li><strong>Graph minors:</strong> The Robertson-Seymour theorem proves that any minor-closed family of graphs has a finite set of forbidden minors, vastly generalizing Kuratowski's theorem.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">A Philosophical Note</div>
    <div class="env-body">
        <p>The Four Color Theorem occupies a unique place in mathematics. Its truth was verified by computer before any human could check the proof by hand. This raised deep questions about what constitutes a "proof." Today, with formal verification in proof assistants like Coq, we have proofs that are verified by software whose correctness is itself formally established. The boundary between human and machine reasoning continues to evolve.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-dual-graph"></div>
`,
            visualizations: [
                {
                    id: 'viz-dual-graph',
                    title: 'Planar Graphs and Their Duals',
                    description: 'A planar graph and its dual: each face of the original becomes a vertex of the dual, and two dual vertices are connected if the original faces share an edge.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        // A simple planar graph (tetrahedron / K4 planar embedding)
                        var primalVerts = [[280,70],[130,330],[430,330],[280,220]];
                        var primalEdges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];

                        // Dual: 4 faces (including outer face)
                        // Face 0 (outer): bounded by edges 0-1, 0-2, 1-2 => triangle 0,1,2
                        // Face 1: triangle 0,1,3
                        // Face 2: triangle 0,2,3
                        // Face 3: triangle 1,2,3
                        // Dual vertex positions: centroids of faces
                        var dualVerts = [
                            [280, 400], // outer face (place below)
                            [230, 180], // face: 0-1-3
                            [330, 180], // face: 0-2-3
                            [280, 290]  // face: 1-2-3
                        ];
                        // Dual edges: faces sharing an original edge
                        // Edge 0-1: faces 0,1 => dual edge [0,1]
                        // Edge 0-2: faces 0,2 => dual edge [0,2]
                        // Edge 1-2: faces 0,3 => dual edge [0,3]
                        // Edge 0-3: faces 1,2 => dual edge [1,2]
                        // Edge 1-3: faces 1,3 => dual edge [1,3]
                        // Edge 2-3: faces 2,3 => dual edge [2,3]
                        var dualEdges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];

                        var showDual = true;
                        var showPrimal = true;

                        var btnP = VizEngine.createButton(controls, 'Toggle Primal', function() { showPrimal = !showPrimal; draw(); });
                        var btnD = VizEngine.createButton(controls, 'Toggle Dual', function() { showDual = !showDual; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Planar Graph (blue) and Dual (orange)', viz.width / 2, 25, viz.colors.white, 14);

                            // Primal edges
                            if (showPrimal) {
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                for (var i = 0; i < primalEdges.length; i++) {
                                    var a = primalVerts[primalEdges[i][0]], b = primalVerts[primalEdges[i][1]];
                                    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
                                }
                            }

                            // Dual edges (curved to avoid overlap)
                            if (showDual) {
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.setLineDash([6, 3]);
                                for (var j = 0; j < dualEdges.length; j++) {
                                    var c = dualVerts[dualEdges[j][0]], d = dualVerts[dualEdges[j][1]];
                                    ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
                                }
                                ctx.setLineDash([]);
                            }

                            // Primal vertices
                            if (showPrimal) {
                                for (var k = 0; k < primalVerts.length; k++) {
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.beginPath(); ctx.arc(primalVerts[k][0], primalVerts[k][1], 8, 0, Math.PI * 2); ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText('v' + (k+1), primalVerts[k][0], primalVerts[k][1]);
                                }
                            }

                            // Dual vertices
                            if (showDual) {
                                var dualLabels = ['F*', 'A*', 'B*', 'C*'];
                                for (var m = 0; m < dualVerts.length; m++) {
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.beginPath(); ctx.arc(dualVerts[m][0], dualVerts[m][1], 8, 0, Math.PI * 2); ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(dualLabels[m], dualVerts[m][0], dualVerts[m][1]);
                                }
                            }

                            // Info
                            viz.screenText('Primal: V=4, E=6, F=4 (K4)', 140, viz.height - 40, viz.colors.blue, 12);
                            viz.screenText('Dual: V*=4, E*=6, F*=4 (also K4!)', 420, viz.height - 40, viz.colors.orange, 12);
                            viz.screenText('K4 is self-dual', viz.width / 2, viz.height - 15, viz.colors.purple, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'What is the dual of the cube graph \\(Q_3\\)? Verify that the dual has the same number of edges.',
                    hint: 'The cube has 8 vertices, 12 edges, 6 faces (by Euler: \\(8 - 12 + 6 = 2\\)). Each face of the cube is a square. The dual has one vertex per face.',
                    solution: 'The dual of the cube is the octahedron. The cube has \\(V=8, E=12, F=6\\). The dual has \\(V^*=6\\) (one per face), \\(E^*=12\\) (one per edge, preserved), \\(F^*=8\\) (one per vertex). Check: \\(6 - 12 + 8 = 2\\). The octahedron has \\(V=6, E=12, F=8\\), confirming the duality.'
                },
                {
                    question: 'Show that the chromatic number of a planar graph \\(G\\) equals the minimum number of colors needed to properly color the faces of its dual graph \\(G^*\\).',
                    hint: 'Proper coloring of faces of a planar graph means no two faces sharing an edge get the same color. The dual converts face adjacency to vertex adjacency.',
                    solution: 'Two faces of \\(G\\) share an edge if and only if the corresponding dual vertices in \\(G^*\\) are adjacent. So a proper face coloring of \\(G\\) is exactly a proper vertex coloring of \\(G^*\\). The minimum number of colors for face coloring of \\(G\\) is \\(\\chi(G^*)\\). The Four Color Theorem for maps (face coloring) is equivalent to saying \\(\\chi(G^*) \\leq 4\\) for every planar \\(G^*\\) (since duals of planar graphs are planar).'
                }
            ]
        }
    ]
});
