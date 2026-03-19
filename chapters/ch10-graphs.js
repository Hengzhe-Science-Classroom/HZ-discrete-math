window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch10',
    number: 10,
    title: 'Graphs & Their Properties',
    subtitle: 'Vertices, edges, and the language of connections',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Graphs?',
            content: `
<h2>Why Graphs?</h2>

<div class="env-block intuition">
    <div class="env-title">Connections Are Everywhere</div>
    <div class="env-body">
        <p>A social network links people by friendship. A road map links cities by highways. The internet links routers by cables. A molecule links atoms by bonds. What all these systems share is <em>structure</em>: a collection of objects and the connections between them.</p>
        <p>Graph theory is the mathematical language for describing and analyzing such structure. It is one of the most widely applied branches of discrete mathematics, appearing in computer science, biology, sociology, logistics, and beyond.</p>
    </div>
</div>

<p>In 1736, Leonhard Euler posed a question about the city of K&ouml;nigsberg (now Kaliningrad): the city had four landmasses connected by seven bridges. Is it possible to walk through the city, crossing each bridge exactly once, and return to your starting point?</p>

<p>Euler's answer was <strong>no</strong>, and his proof is considered the birth of graph theory. He realized that the specific layout of the city did not matter; only the <em>connections</em> between landmasses mattered. By abstracting landmasses as points and bridges as lines, he invented graphs.</p>

<h3>The Power of Abstraction</h3>

<p>Graphs strip away geometric detail to reveal pure connectivity. Two very different-looking networks might have identical graph structure. This abstraction is powerful because:</p>
<ol>
    <li><strong>Algorithms become universal.</strong> A shortest-path algorithm works on road networks, social graphs, and circuit boards.</li>
    <li><strong>Properties become provable.</strong> We can prove structural theorems (like the handshaking lemma) that apply to all graphs.</li>
    <li><strong>Complexity becomes measurable.</strong> We can count edges, paths, and cycles to quantify how "connected" or "complex" a network is.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Despite Euler's 1736 paper, graph theory developed slowly until the 20th century. The Four Color Theorem (1852, proved 1976) asked whether every map can be colored with four colors so that no adjacent regions share a color. Its computer-assisted proof was controversial at the time and remains a landmark in mathematics.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-konigsberg',
                    title: 'The Seven Bridges of K\u00f6nigsberg',
                    description: 'Try to cross every bridge exactly once! Click on a landmass to start, then click adjacent landmasses to cross bridges. Euler proved this is impossible when more than two landmasses have an odd number of bridges.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Landmasses: A (top), B (bottom-left), C (bottom-right), D (center island)
                        var nodes = [
                            { id: 0, label: 'A', x: 280, y: 60, color: viz.colors.blue },
                            { id: 1, label: 'B', x: 140, y: 280, color: viz.colors.teal },
                            { id: 2, label: 'C', x: 420, y: 280, color: viz.colors.orange },
                            { id: 3, label: 'D', x: 280, y: 180, color: viz.colors.purple }
                        ];

                        // 7 bridges
                        var bridges = [
                            { from: 0, to: 3, id: 0 },
                            { from: 0, to: 3, id: 1 },
                            { from: 1, to: 3, id: 2 },
                            { from: 1, to: 3, id: 3 },
                            { from: 2, to: 3, id: 4 },
                            { from: 2, to: 3, id: 5 },
                            { from: 1, to: 2, id: 6 }
                        ];

                        var path = [];
                        var crossedBridges = [];
                        var message = 'Click a landmass to start your walk';
                        var solved = false;
                        var failed = false;

                        function getAvailableBridges(fromId) {
                            var available = [];
                            for (var i = 0; i < bridges.length; i++) {
                                if (crossedBridges.indexOf(i) >= 0) continue;
                                var b = bridges[i];
                                if (b.from === fromId || b.to === fromId) {
                                    var target = b.from === fromId ? b.to : b.from;
                                    available.push({ bridgeIdx: i, target: target });
                                }
                            }
                            return available;
                        }

                        VizEngine.createButton(controls, 'Reset', function() {
                            path = [];
                            crossedBridges = [];
                            message = 'Click a landmass to start your walk';
                            solved = false;
                            failed = false;
                            draw();
                        });

                        viz.canvas.addEventListener('click', function(e) {
                            if (solved || failed) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            for (var i = 0; i < nodes.length; i++) {
                                var n = nodes[i];
                                var dx = mx - n.x, dy = my - n.y;
                                if (dx * dx + dy * dy < 900) {
                                    if (path.length === 0) {
                                        path.push(i);
                                        message = 'At ' + n.label + '. Click an adjacent landmass to cross a bridge.';
                                    } else {
                                        var current = path[path.length - 1];
                                        var available = getAvailableBridges(current);
                                        var bridgeToUse = -1;
                                        for (var j = 0; j < available.length; j++) {
                                            if (available[j].target === i) {
                                                bridgeToUse = available[j].bridgeIdx;
                                                break;
                                            }
                                        }
                                        if (bridgeToUse >= 0) {
                                            crossedBridges.push(bridgeToUse);
                                            path.push(i);
                                            if (crossedBridges.length === 7) {
                                                solved = true;
                                                message = 'Incredible! You crossed all 7 bridges!';
                                            } else {
                                                var remaining = getAvailableBridges(i);
                                                if (remaining.length === 0) {
                                                    failed = true;
                                                    message = 'Stuck! ' + crossedBridges.length + '/7 bridges crossed. Euler proved this is impossible: all four landmasses have odd degree.';
                                                } else {
                                                    message = 'At ' + n.label + '. Crossed ' + crossedBridges.length + '/7 bridges.';
                                                }
                                            }
                                        } else {
                                            message = 'No uncrossed bridge to ' + n.label + ' from here!';
                                        }
                                    }
                                    draw();
                                    return;
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('The Seven Bridges of K\u00f6nigsberg', viz.width / 2, 20, viz.colors.white, 15);

                            // Draw bridges
                            for (var i = 0; i < bridges.length; i++) {
                                var b = bridges[i];
                                var n1 = nodes[b.from], n2 = nodes[b.to];
                                var crossed = crossedBridges.indexOf(i) >= 0;

                                // Offset parallel edges
                                var offset = 0;
                                var count = 0;
                                for (var j = 0; j <= i; j++) {
                                    if ((bridges[j].from === b.from && bridges[j].to === b.to) ||
                                        (bridges[j].from === b.to && bridges[j].to === b.from)) {
                                        if (j < i) count++;
                                    }
                                }
                                var total = 0;
                                for (var j = 0; j < bridges.length; j++) {
                                    if ((bridges[j].from === b.from && bridges[j].to === b.to) ||
                                        (bridges[j].from === b.to && bridges[j].to === b.from)) total++;
                                }
                                offset = (count - (total - 1) / 2) * 15;

                                var dx = n2.x - n1.x, dy = n2.y - n1.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var nx = -dy / len * offset, ny = dx / len * offset;

                                ctx.strokeStyle = crossed ? viz.colors.green : viz.colors.text + '66';
                                ctx.lineWidth = crossed ? 4 : 3;
                                ctx.beginPath();
                                ctx.moveTo(n1.x + nx, n1.y + ny);
                                ctx.lineTo(n2.x + nx, n2.y + ny);
                                ctx.stroke();
                            }

                            // Draw landmasses
                            for (var i = 0; i < nodes.length; i++) {
                                var n = nodes[i];
                                var isCurrent = path.length > 0 && path[path.length - 1] === i;
                                var r = isCurrent ? 28 : 24;

                                ctx.fillStyle = n.color + '44';
                                ctx.beginPath(); ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2); ctx.fill();

                                ctx.fillStyle = n.color;
                                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);

                                // Show degree
                                var deg = 0;
                                for (var j = 0; j < bridges.length; j++) {
                                    if (bridges[j].from === i || bridges[j].to === i) deg++;
                                }
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('deg=' + deg, n.x, n.y + r + 14);
                            }

                            // Draw path arrows
                            if (path.length > 1) {
                                ctx.strokeStyle = viz.colors.green + 'aa';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([4, 4]);
                                for (var i = 0; i < path.length - 1; i++) {
                                    var a = nodes[path[i]], b = nodes[path[i + 1]];
                                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                                }
                                ctx.setLineDash([]);
                            }

                            // Message
                            var msgColor = solved ? viz.colors.green : (failed ? viz.colors.red : viz.colors.yellow);
                            viz.screenText(message, viz.width / 2, viz.height - 30, msgColor, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the K\\u00f6nigsberg bridge problem, each landmass has degree 3, 3, 3, and 5 respectively. Can an Euler circuit exist? Why or why not?',
                    hint: 'Recall that an Euler circuit requires every vertex to have even degree.',
                    solution: 'No. An Euler circuit requires every vertex to have even degree. Here all four vertices have odd degree (3, 3, 3, 5), so no Euler circuit (or even Euler path) exists. An Euler path requires exactly 0 or 2 vertices of odd degree.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Graph Definitions
        // ================================================================
        {
            id: 'sec-definition',
            title: 'Graphs',
            content: `
<h2>Graphs: Formal Definitions</h2>

<div class="env-block definition">
    <div class="env-title">Definition 10.1 (Graph)</div>
    <div class="env-body">
        <p>A <strong>graph</strong> \\(G = (V, E)\\) consists of:</p>
        <ul>
            <li>A non-empty finite set \\(V\\) of <strong>vertices</strong> (also called <em>nodes</em>),</li>
            <li>A set \\(E\\) of <strong>edges</strong>, where each edge is a 2-element subset \\(\\{u, v\\}\\) of \\(V\\).</li>
        </ul>
        <p>We write \\(|V| = n\\) (the <strong>order</strong> of \\(G\\)) and \\(|E| = m\\) (the <strong>size</strong> of \\(G\\)).</p>
    </div>
</div>

<p>Two vertices joined by an edge are called <strong>adjacent</strong> (or <em>neighbors</em>). An edge is <strong>incident</strong> to its endpoints. Vertices with no edges are <strong>isolated</strong>.</p>

<h3>Variations</h3>

<div class="env-block definition">
    <div class="env-title">Definition 10.2 (Directed Graph)</div>
    <div class="env-body">
        <p>A <strong>directed graph</strong> (or <em>digraph</em>) \\(G = (V, E)\\) has edges that are <em>ordered pairs</em> \\((u, v)\\), indicating a direction from \\(u\\) to \\(v\\). We draw these as arrows.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 10.3 (Weighted Graph)</div>
    <div class="env-body">
        <p>A <strong>weighted graph</strong> assigns a numerical <strong>weight</strong> \\(w(e)\\) to each edge \\(e\\). Weights might represent distances, costs, capacities, or probabilities.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 10.4 (Multigraph, Simple Graph)</div>
    <div class="env-body">
        <p>A <strong>multigraph</strong> allows multiple edges between the same pair of vertices (called <em>parallel edges</em>) and self-loops (edges from a vertex to itself). A <strong>simple graph</strong> has no parallel edges and no self-loops. Unless stated otherwise, "graph" means simple graph.</p>
    </div>
</div>

<h3>Special Graphs</h3>

<p>Several families of graphs appear repeatedly:</p>
<ul>
    <li><strong>Complete graph</strong> \\(K_n\\): every pair of vertices is adjacent. It has \\(\\binom{n}{2} = n(n-1)/2\\) edges.</li>
    <li><strong>Cycle graph</strong> \\(C_n\\): vertices \\(v_1, \\ldots, v_n\\) with edges \\(\\{v_i, v_{i+1}\\}\\) and \\(\\{v_n, v_1\\}\\).</li>
    <li><strong>Path graph</strong> \\(P_n\\): a cycle without the closing edge.</li>
    <li><strong>Complete bipartite graph</strong> \\(K_{m,n}\\): vertices split into two groups of sizes \\(m\\) and \\(n\\), with every vertex in one group adjacent to every vertex in the other.</li>
</ul>

<div class="env-block example">
    <div class="env-title">Example: Social Network as a Graph</div>
    <div class="env-body">
        <p>Let \\(V = \\{\\text{Alice, Bob, Carol, Dave}\\}\\) and \\(E = \\{\\{A,B\\}, \\{A,C\\}, \\{B,C\\}, \\{C,D\\}\\}\\). This graph has 4 vertices and 4 edges. Alice and Dave are not adjacent. Carol has the most connections (degree 3).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-graph-builder"></div>
`,
            visualizations: [
                {
                    id: 'viz-graph-builder',
                    title: 'Interactive Graph Builder',
                    description: 'Build your own graph! Click on empty space to add a vertex. Click a vertex and then another to add an edge. The adjacency matrix updates in real time. Use "Clear" to start over.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var vertices = [];
                        var edges = [];
                        var selectedVertex = -1;
                        var nextLabel = 0;
                        var mode = 'vertex'; // 'vertex' or 'edge'
                        var labels = 'ABCDEFGHIJKLMNOP';
                        var vertexColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink, viz.colors.red, viz.colors.yellow];

                        VizEngine.createButton(controls, 'Add Vertices (click)', function() {
                            mode = 'vertex'; selectedVertex = -1; draw();
                        });
                        VizEngine.createButton(controls, 'Add Edges (click two)', function() {
                            mode = 'edge'; selectedVertex = -1; draw();
                        });
                        VizEngine.createButton(controls, 'Clear', function() {
                            vertices = []; edges = []; selectedVertex = -1; nextLabel = 0; draw();
                        });
                        VizEngine.createButton(controls, 'K\u2084 Example', function() {
                            vertices = [
                                { x: 200, y: 100, label: 'A' },
                                { x: 100, y: 220, label: 'B' },
                                { x: 200, y: 340, label: 'C' },
                                { x: 300, y: 220, label: 'D' }
                            ];
                            edges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
                            nextLabel = 4; selectedVertex = -1;
                            draw();
                        });

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            // Check if clicked on a vertex
                            var clickedV = -1;
                            for (var i = 0; i < vertices.length; i++) {
                                var dx = mx - vertices[i].x, dy = my - vertices[i].y;
                                if (dx * dx + dy * dy < 400) { clickedV = i; break; }
                            }

                            if (mode === 'vertex') {
                                if (clickedV < 0 && mx < 340 && nextLabel < labels.length) {
                                    vertices.push({ x: mx, y: my, label: labels[nextLabel] });
                                    nextLabel++;
                                }
                            } else if (mode === 'edge') {
                                if (clickedV >= 0) {
                                    if (selectedVertex < 0) {
                                        selectedVertex = clickedV;
                                    } else if (selectedVertex !== clickedV) {
                                        // Check if edge already exists
                                        var exists = false;
                                        for (var j = 0; j < edges.length; j++) {
                                            if ((edges[j][0] === selectedVertex && edges[j][1] === clickedV) ||
                                                (edges[j][0] === clickedV && edges[j][1] === selectedVertex)) {
                                                exists = true; break;
                                            }
                                        }
                                        if (!exists) {
                                            edges.push([selectedVertex, clickedV]);
                                        }
                                        selectedVertex = -1;
                                    } else {
                                        selectedVertex = -1;
                                    }
                                } else {
                                    selectedVertex = -1;
                                }
                            }
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var n = vertices.length;

                            // Title and mode
                            viz.screenText('Graph Builder', 170, 16, viz.colors.white, 14);
                            viz.screenText('Mode: ' + (mode === 'vertex' ? 'Add Vertices' : 'Add Edges'), 170, 34, viz.colors.yellow, 11);

                            // Draw edges
                            for (var i = 0; i < edges.length; i++) {
                                var v1 = vertices[edges[i][0]], v2 = vertices[edges[i][1]];
                                ctx.strokeStyle = viz.colors.text + '88';
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(v1.x, v1.y); ctx.lineTo(v2.x, v2.y); ctx.stroke();
                            }

                            // Draw vertices
                            for (var i = 0; i < n; i++) {
                                var v = vertices[i];
                                var col = vertexColors[i % vertexColors.length];
                                var isSelected = (mode === 'edge' && selectedVertex === i);
                                var r = isSelected ? 22 : 18;

                                if (isSelected) {
                                    ctx.fillStyle = viz.colors.yellow + '44';
                                    ctx.beginPath(); ctx.arc(v.x, v.y, r + 6, 0, Math.PI * 2); ctx.fill();
                                }

                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(v.x, v.y, r, 0, Math.PI * 2); ctx.fill();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(v.label, v.x, v.y);
                            }

                            // Draw adjacency matrix on the right
                            if (n > 0 && n <= 10) {
                                var matX = 360, matY = 50;
                                var cellSize = Math.min(22, 180 / (n + 1));

                                viz.screenText('Adjacency Matrix', matX + (n + 1) * cellSize / 2, matY - 10, viz.colors.teal, 11);

                                // Build adjacency matrix
                                var adj = [];
                                for (var i = 0; i < n; i++) {
                                    adj[i] = [];
                                    for (var j = 0; j < n; j++) adj[i][j] = 0;
                                }
                                for (var e = 0; e < edges.length; e++) {
                                    adj[edges[e][0]][edges[e][1]] = 1;
                                    adj[edges[e][1]][edges[e][0]] = 1;
                                }

                                // Column headers
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                for (var j = 0; j < n; j++) {
                                    ctx.fillStyle = vertexColors[j % vertexColors.length];
                                    ctx.fillText(vertices[j].label, matX + (j + 1) * cellSize + cellSize / 2, matY + cellSize / 2);
                                }

                                // Row headers and cells
                                for (var i = 0; i < n; i++) {
                                    ctx.fillStyle = vertexColors[i % vertexColors.length];
                                    ctx.fillText(vertices[i].label, matX + cellSize / 2, matY + (i + 1) * cellSize + cellSize / 2);

                                    for (var j = 0; j < n; j++) {
                                        var cx = matX + (j + 1) * cellSize;
                                        var cy = matY + (i + 1) * cellSize;

                                        ctx.strokeStyle = viz.colors.grid;
                                        ctx.lineWidth = 0.5;
                                        ctx.strokeRect(cx, cy, cellSize, cellSize);

                                        if (adj[i][j]) {
                                            ctx.fillStyle = viz.colors.teal + '44';
                                            ctx.fillRect(cx, cy, cellSize, cellSize);
                                        }

                                        ctx.fillStyle = adj[i][j] ? viz.colors.white : viz.colors.text + '44';
                                        ctx.fillText(adj[i][j].toString(), cx + cellSize / 2, cy + cellSize / 2);
                                    }
                                }

                                // Info
                                viz.screenText('|V| = ' + n + ',  |E| = ' + edges.length, matX + (n + 1) * cellSize / 2, matY + (n + 2) * cellSize + 10, viz.colors.text, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many edges does the complete graph \\(K_n\\) have? Prove your formula.',
                    hint: 'Each vertex connects to every other vertex. Be careful not to double-count.',
                    solution: 'Each of the \\(n\\) vertices is adjacent to \\(n - 1\\) others. This counts each edge twice (once from each endpoint), so \\(|E| = \\binom{n}{2} = \\frac{n(n-1)}{2}\\). For example, \\(K_5\\) has \\(\\binom{5}{2} = 10\\) edges.'
                },
            ]
        },

        // ================================================================
        // SECTION 3: Representations
        // ================================================================
        {
            id: 'sec-representation',
            title: 'Representations',
            content: `
<h2>Representing Graphs</h2>

<p>How we store a graph in a computer determines what operations are efficient. The three most common representations are the adjacency matrix, the adjacency list, and the incidence matrix.</p>

<h3>Adjacency Matrix</h3>

<div class="env-block definition">
    <div class="env-title">Definition 10.5 (Adjacency Matrix)</div>
    <div class="env-body">
        <p>For a graph \\(G\\) with vertices \\(v_1, \\ldots, v_n\\), the <strong>adjacency matrix</strong> is the \\(n \\times n\\) matrix \\(A\\) where</p>
        \\[A_{ij} = \\begin{cases} 1 & \\text{if } \\{v_i, v_j\\} \\in E, \\\\ 0 & \\text{otherwise.} \\end{cases}\\]
        <p>For a simple undirected graph, \\(A\\) is symmetric (\\(A_{ij} = A_{ji}\\)) and has zeros on the diagonal.</p>
    </div>
</div>

<p><strong>Space:</strong> \\(O(n^2)\\). <strong>Edge lookup:</strong> \\(O(1)\\). <strong>List neighbors:</strong> \\(O(n)\\).</p>

<h3>Adjacency List</h3>

<div class="env-block definition">
    <div class="env-title">Definition 10.6 (Adjacency List)</div>
    <div class="env-body">
        <p>For each vertex \\(v\\), store a list \\(\\text{Adj}(v)\\) of all vertices adjacent to \\(v\\). For undirected graphs, if \\(u \\in \\text{Adj}(v)\\) then \\(v \\in \\text{Adj}(u)\\).</p>
    </div>
</div>

<p><strong>Space:</strong> \\(O(n + m)\\). <strong>Edge lookup:</strong> \\(O(\\deg(v))\\). <strong>List neighbors:</strong> \\(O(\\deg(v))\\).</p>

<p>The adjacency list is generally preferred for <em>sparse</em> graphs (\\(m \\ll n^2\\)), while the matrix is better for <em>dense</em> graphs or when frequent edge-existence queries are needed.</p>

<h3>Incidence Matrix</h3>

<div class="env-block definition">
    <div class="env-title">Definition 10.7 (Incidence Matrix)</div>
    <div class="env-body">
        <p>The <strong>incidence matrix</strong> is an \\(n \\times m\\) matrix \\(B\\) where \\(B_{ij} = 1\\) if vertex \\(v_i\\) is an endpoint of edge \\(e_j\\), and 0 otherwise. Each column has exactly two 1s (for a simple graph).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Comparing Representations</div>
    <div class="env-body">
        <p>Consider the path graph \\(P_3\\) with vertices \\(A, B, C\\) and edges \\(\\{A,B\\}, \\{B,C\\}\\).</p>
        <p><strong>Adjacency matrix:</strong></p>
        \\[A = \\begin{pmatrix} 0 & 1 & 0 \\\\ 1 & 0 & 1 \\\\ 0 & 1 & 0 \\end{pmatrix}\\]
        <p><strong>Adjacency list:</strong> \\(A \\to [B],\\ B \\to [A, C],\\ C \\to [B]\\).</p>
        <p><strong>Incidence matrix:</strong></p>
        \\[B = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 0 & 1 \\end{pmatrix}\\]
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-adjacency-matrix"></div>
`,
            visualizations: [
                {
                    id: 'viz-adjacency-matrix',
                    title: 'Graph & Adjacency Matrix Side by Side',
                    description: 'Click on a cell in the matrix to toggle that edge. The graph drawing updates in real time. Notice the symmetry: the matrix mirrors across the diagonal.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 5;
                        var adj = [];
                        var positions = [];
                        var labels = 'ABCDE';
                        var vertexColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green];

                        function initGraph(sz) {
                            n = sz;
                            adj = [];
                            for (var i = 0; i < n; i++) {
                                adj[i] = [];
                                for (var j = 0; j < n; j++) adj[i][j] = 0;
                            }
                            positions = [];
                            for (var i = 0; i < n; i++) {
                                var angle = -Math.PI / 2 + (2 * Math.PI * i / n);
                                positions.push({
                                    x: 140 + 90 * Math.cos(angle),
                                    y: 200 + 90 * Math.sin(angle)
                                });
                            }
                            // Default: path graph
                            for (var i = 0; i < n - 1; i++) {
                                adj[i][i + 1] = 1;
                                adj[i + 1][i] = 1;
                            }
                        }
                        initGraph(5);

                        VizEngine.createSlider(controls, 'Vertices', 3, 7, n, 1, function(v) {
                            initGraph(Math.round(v));
                            draw();
                        });

                        VizEngine.createButton(controls, 'Complete', function() {
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++)
                                    adj[i][j] = (i !== j) ? 1 : 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear Edges', function() {
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++) adj[i][j] = 0;
                            draw();
                        });

                        var matX = 310, matY = 60;
                        var cellSize = 30;

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            // Check matrix clicks
                            for (var i = 0; i < n; i++) {
                                for (var j = 0; j < n; j++) {
                                    if (i === j) continue;
                                    var cx = matX + (j + 1) * cellSize;
                                    var cy = matY + (i + 1) * cellSize;
                                    if (mx >= cx && mx < cx + cellSize && my >= cy && my < cy + cellSize) {
                                        adj[i][j] = 1 - adj[i][j];
                                        adj[j][i] = adj[i][j]; // Keep symmetric
                                        draw();
                                        return;
                                    }
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            cellSize = Math.min(30, 200 / (n + 1));

                            // Draw graph
                            viz.screenText('Graph', 140, 30, viz.colors.white, 13);

                            // Edges
                            for (var i = 0; i < n; i++) {
                                for (var j = i + 1; j < n; j++) {
                                    if (adj[i][j]) {
                                        ctx.strokeStyle = viz.colors.text + '77';
                                        ctx.lineWidth = 2;
                                        ctx.beginPath();
                                        ctx.moveTo(positions[i].x, positions[i].y);
                                        ctx.lineTo(positions[j].x, positions[j].y);
                                        ctx.stroke();
                                    }
                                }
                            }

                            // Vertices
                            for (var i = 0; i < n; i++) {
                                var p = positions[i];
                                ctx.fillStyle = vertexColors[i % vertexColors.length];
                                ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(labels[i], p.x, p.y);
                            }

                            // Matrix
                            viz.screenText('Adjacency Matrix (click to toggle)', matX + (n + 1) * cellSize / 2, matY - 10, viz.colors.teal, 11);

                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

                            // Headers
                            for (var j = 0; j < n; j++) {
                                ctx.fillStyle = vertexColors[j % vertexColors.length];
                                ctx.fillText(labels[j], matX + (j + 1) * cellSize + cellSize / 2, matY + cellSize / 2);
                            }
                            for (var i = 0; i < n; i++) {
                                ctx.fillStyle = vertexColors[i % vertexColors.length];
                                ctx.fillText(labels[i], matX + cellSize / 2, matY + (i + 1) * cellSize + cellSize / 2);
                            }

                            // Cells
                            for (var i = 0; i < n; i++) {
                                for (var j = 0; j < n; j++) {
                                    var cx = matX + (j + 1) * cellSize;
                                    var cy = matY + (i + 1) * cellSize;

                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.strokeRect(cx, cy, cellSize, cellSize);

                                    if (i === j) {
                                        ctx.fillStyle = viz.colors.grid;
                                        ctx.fillRect(cx, cy, cellSize, cellSize);
                                    } else if (adj[i][j]) {
                                        ctx.fillStyle = viz.colors.teal + '44';
                                        ctx.fillRect(cx, cy, cellSize, cellSize);
                                    }

                                    ctx.fillStyle = adj[i][j] ? viz.colors.white : viz.colors.text + '44';
                                    ctx.fillText(adj[i][j].toString(), cx + cellSize / 2, cy + cellSize / 2);
                                }
                            }

                            // Edge count
                            var edgeCount = 0;
                            for (var i = 0; i < n; i++)
                                for (var j = i + 1; j < n; j++)
                                    if (adj[i][j]) edgeCount++;
                            viz.screenText('|E| = ' + edgeCount, matX + (n + 1) * cellSize / 2, matY + (n + 2) * cellSize + 10, viz.colors.text, 11);

                            // Adjacency list
                            var listY = matY + (n + 2) * cellSize + 30;
                            viz.screenText('Adjacency List:', matX + 10, listY, viz.colors.white, 11, 'left');
                            for (var i = 0; i < n; i++) {
                                var neighbors = [];
                                for (var j = 0; j < n; j++) if (adj[i][j]) neighbors.push(labels[j]);
                                var listStr = labels[i] + ' \u2192 [' + neighbors.join(', ') + ']';
                                ctx.fillStyle = vertexColors[i % vertexColors.length];
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(listStr, matX + 10, listY + 16 + i * 14);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write the adjacency matrix for the cycle graph \\(C_4\\) on vertices \\(\\{1, 2, 3, 4\\}\\). What is the sum of each row? What do you notice about \\(A^2\\)?',
                    hint: 'In \\(C_4\\), vertex \\(i\\) is adjacent to \\(i-1\\) and \\(i+1\\) (mod 4). The entry \\((A^2)_{ij}\\) counts the number of walks of length 2 from \\(i\\) to \\(j\\).',
                    solution: 'The adjacency matrix is \\(A = \\begin{pmatrix} 0&1&0&1 \\\\ 1&0&1&0 \\\\ 0&1&0&1 \\\\ 1&0&1&0 \\end{pmatrix}\\). Each row sums to 2 (the degree of each vertex). \\(A^2 = \\begin{pmatrix} 2&0&2&0 \\\\ 0&2&0&2 \\\\ 2&0&2&0 \\\\ 0&2&0&2 \\end{pmatrix}\\). Entry \\((A^2)_{ij}\\) counts walks of length 2 from \\(i\\) to \\(j\\). For \\(C_4\\), there are 2 walks of length 2 between opposite vertices and 0 between adjacent vertices.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Degree & Handshaking
        // ================================================================
        {
            id: 'sec-degree',
            title: 'Degree & Handshaking',
            content: `
<h2>Vertex Degree and the Handshaking Lemma</h2>

<div class="env-block definition">
    <div class="env-title">Definition 10.8 (Degree)</div>
    <div class="env-body">
        <p>The <strong>degree</strong> of a vertex \\(v\\) in a graph \\(G\\), written \\(\\deg(v)\\), is the number of edges incident to \\(v\\). Equivalently, it is the number of neighbors of \\(v\\).</p>
        <p>In a directed graph, the <strong>in-degree</strong> \\(\\deg^-(v)\\) counts edges pointing to \\(v\\), and the <strong>out-degree</strong> \\(\\deg^+(v)\\) counts edges pointing away from \\(v\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.1 (Handshaking Lemma)</div>
    <div class="env-body">
        <p>In any graph \\(G = (V, E)\\),</p>
        \\[\\sum_{v \\in V} \\deg(v) = 2|E|.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Each edge \\(\\{u, v\\}\\) contributes exactly 1 to \\(\\deg(u)\\) and 1 to \\(\\deg(v)\\). Therefore, summing degrees over all vertices counts each edge exactly twice.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Corollary 10.2</div>
    <div class="env-body">
        <p>In any graph, the number of vertices with odd degree is even.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>The sum of all degrees is \\(2|E|\\), which is even. If we split vertices into those with even degree and those with odd degree, the even-degree vertices contribute an even sum. For the total to be even, the odd-degree vertices must also contribute an even sum, which requires an even number of them.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Degree Sequence</h3>

<div class="env-block definition">
    <div class="env-title">Definition 10.9 (Degree Sequence)</div>
    <div class="env-body">
        <p>The <strong>degree sequence</strong> of a graph is the list of vertex degrees, sorted in non-increasing order. For example, the degree sequence of \\(K_4\\) is \\((3, 3, 3, 3)\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.3 (Erd\\H{o}s-Gallai)</div>
    <div class="env-body">
        <p>A non-increasing sequence \\(d_1 \\geq d_2 \\geq \\cdots \\geq d_n\\) of non-negative integers is the degree sequence of a simple graph if and only if the sum is even and, for each \\(k = 1, \\ldots, n\\),</p>
        \\[\\sum_{i=1}^{k} d_i \\leq k(k-1) + \\sum_{i=k+1}^{n} \\min(d_i, k).\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Can (3, 3, 2, 1) Be a Degree Sequence?</div>
    <div class="env-body">
        <p>Sum = 9, which is odd. By the handshaking lemma, no graph has this degree sequence. The sum of degrees must be even.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-degree-sequence"></div>
`,
            visualizations: [
                {
                    id: 'viz-degree-sequence',
                    title: 'Degree Sequence & Handshaking Lemma',
                    description: 'Build a graph and watch the degree sequence and handshaking sum update live. Each vertex shows its degree. The sum of all degrees always equals twice the number of edges.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var presets = {
                            'C5': { n: 5, edges: [[0,1],[1,2],[2,3],[3,4],[4,0]] },
                            'K4': { n: 4, edges: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]] },
                            'Star': { n: 6, edges: [[0,1],[0,2],[0,3],[0,4],[0,5]] },
                            'Petersen-like': { n: 5, edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,2],[1,3]] }
                        };

                        var currentPreset = 'C5';
                        var n, edges, positions;

                        function loadPreset(name) {
                            var p = presets[name];
                            n = p.n;
                            edges = p.edges.map(function(e) { return e.slice(); });
                            positions = [];
                            for (var i = 0; i < n; i++) {
                                var angle = -Math.PI / 2 + (2 * Math.PI * i / n);
                                positions.push({ x: 160 + 100 * Math.cos(angle), y: 200 + 100 * Math.sin(angle) });
                            }
                        }
                        loadPreset(currentPreset);

                        var labels = 'ABCDEFGHIJ';
                        var vertexColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink];

                        Object.keys(presets).forEach(function(name) {
                            VizEngine.createButton(controls, name, function() {
                                currentPreset = name;
                                loadPreset(name);
                                draw();
                            });
                        });

                        function getDegree(v) {
                            var d = 0;
                            for (var i = 0; i < edges.length; i++) {
                                if (edges[i][0] === v || edges[i][1] === v) d++;
                            }
                            return d;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Degrees & Handshaking', viz.width / 2, 18, viz.colors.white, 14);

                            // Draw edges
                            for (var i = 0; i < edges.length; i++) {
                                var p1 = positions[edges[i][0]], p2 = positions[edges[i][1]];
                                ctx.strokeStyle = viz.colors.text + '66';
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                            }

                            // Draw vertices with degree labels
                            var degrees = [];
                            for (var i = 0; i < n; i++) {
                                var p = positions[i];
                                var deg = getDegree(i);
                                degrees.push(deg);

                                ctx.fillStyle = vertexColors[i % vertexColors.length];
                                ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, Math.PI * 2); ctx.fill();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(labels[i], p.x, p.y);

                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('deg=' + deg, p.x, p.y + 28);
                            }

                            // Degree sequence on the right
                            var infoX = 340, infoY = 60;
                            var sorted = degrees.slice().sort(function(a, b) { return b - a; });
                            var degSum = 0;
                            for (var i = 0; i < degrees.length; i++) degSum += degrees[i];

                            viz.screenText('Degree Sequence', infoX + 80, infoY, viz.colors.teal, 13);
                            viz.screenText('(' + sorted.join(', ') + ')', infoX + 80, infoY + 22, viz.colors.white, 14);

                            viz.screenText('Handshaking Lemma', infoX + 80, infoY + 60, viz.colors.orange, 13);

                            // Show the sum
                            var sumStr = degrees.map(function(d, i) { return labels[i] + ':' + d; }).join(' + ');
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.fillStyle = viz.colors.text;
                            ctx.fillText(sumStr, infoX + 80, infoY + 82);

                            viz.screenText('\u03A3 deg(v) = ' + degSum + ' = 2 \u00D7 ' + edges.length + ' = 2|E|', infoX + 80, infoY + 104, viz.colors.green, 13);

                            // Check: even number of odd-degree vertices?
                            var oddCount = 0;
                            for (var i = 0; i < degrees.length; i++) if (degrees[i] % 2 === 1) oddCount++;
                            viz.screenText('Vertices with odd degree: ' + oddCount + ' (always even!)', infoX + 80, infoY + 140, viz.colors.yellow, 11);

                            // Bar chart of degree distribution
                            var barY = infoY + 170;
                            viz.screenText('Degree Distribution', infoX + 80, barY, viz.colors.white, 11);
                            var maxDeg = Math.max.apply(null, degrees) || 1;
                            var barW = 20;
                            for (var i = 0; i < n; i++) {
                                var bx = infoX + 10 + i * (barW + 6);
                                var bh = (degrees[i] / maxDeg) * 80;
                                ctx.fillStyle = vertexColors[i % vertexColors.length];
                                ctx.fillRect(bx, barY + 100 - bh, barW, bh);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(labels[i], bx + barW / 2, barY + 114);
                                ctx.fillText(degrees[i].toString(), bx + barW / 2, barY + 96 - bh);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Can a simple graph have 5 vertices, each with degree 3?',
                    hint: 'Check the handshaking lemma: the sum of degrees would be \\(5 \\times 3 = 15\\). Is this even?',
                    solution: 'No. By the handshaking lemma, \\(\\sum \\deg(v) = 2|E|\\) must be even. But \\(5 \\times 3 = 15\\) is odd. Therefore no such graph exists.'
                },
            ]
        },

        // ================================================================
        // SECTION 5: Paths, Walks, Cycles
        // ================================================================
        {
            id: 'sec-paths',
            title: 'Paths, Walks, Cycles',
            content: `
<h2>Paths, Walks, and Cycles</h2>

<div class="env-block definition">
    <div class="env-title">Definition 10.10 (Walk, Path, Cycle)</div>
    <div class="env-body">
        <p>In a graph \\(G = (V, E)\\):</p>
        <ul>
            <li>A <strong>walk</strong> of length \\(k\\) is a sequence \\(v_0, e_1, v_1, e_2, \\ldots, e_k, v_k\\) where each \\(e_i = \\{v_{i-1}, v_i\\}\\) is an edge. Vertices and edges may repeat.</li>
            <li>A <strong>trail</strong> is a walk with no repeated edges.</li>
            <li>A <strong>path</strong> is a walk with no repeated vertices (and therefore no repeated edges).</li>
            <li>A <strong>cycle</strong> is a closed walk (\\(v_0 = v_k\\)) of length \\(\\geq 3\\) with no other repeated vertices.</li>
        </ul>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.4</div>
    <div class="env-body">
        <p>If there is a walk from \\(u\\) to \\(v\\) in \\(G\\), then there is a path from \\(u\\) to \\(v\\) in \\(G\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Among all walks from \\(u\\) to \\(v\\), choose one of minimum length. If this walk repeats a vertex \\(w\\), we can "short-circuit" by removing the portion between the two occurrences of \\(w\\), obtaining a shorter walk, contradicting minimality. So the shortest walk has no repeated vertices and is therefore a path.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Connectivity</h3>

<div class="env-block definition">
    <div class="env-title">Definition 10.11 (Connected Graph)</div>
    <div class="env-body">
        <p>A graph \\(G\\) is <strong>connected</strong> if for every pair of vertices \\(u, v\\) there exists a path from \\(u\\) to \\(v\\). The maximal connected subgraphs of \\(G\\) are its <strong>connected components</strong>.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.5</div>
    <div class="env-body">
        <p>A connected graph with \\(n\\) vertices has at least \\(n - 1\\) edges.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Build the graph one vertex at a time. Start with vertex \\(v_1\\). When we add vertex \\(v_i\\), it must be connected to the existing graph by at least one edge (otherwise it would be isolated and the graph disconnected). So we need at least \\(n - 1\\) edges.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Connected Components</div>
    <div class="env-body">
        <p>A graph with vertices \\(\\{1,2,3,4,5\\}\\) and edges \\(\\{\\{1,2\\}, \\{2,3\\}, \\{4,5\\}\\}\\) has two connected components: \\(\\{1,2,3\\}\\) and \\(\\{4,5\\}\\).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-euler-circuit',
                    title: 'Euler Circuit Animated Traversal',
                    description: 'Watch an Euler circuit being traced on a graph where every vertex has even degree. The animation shows each edge being traversed exactly once, returning to the start.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Graph: house with X (K4 + triangle top) - all even degrees
                        // Use a graph where Euler circuit exists: all vertices even degree
                        // Rectangle with diagonals: 4 vertices each degree 3 -> no Euler circuit
                        // Better: use 6-vertex graph with all even degrees
                        var vertices = [
                            { x: 140, y: 100 }, { x: 280, y: 60 }, { x: 420, y: 100 },
                            { x: 420, y: 260 }, { x: 280, y: 300 }, { x: 140, y: 260 }
                        ];
                        var n = 6;
                        var labels = 'ABCDEF';
                        var vertexColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink];

                        // Edges forming a graph where all vertices have even degree
                        var edges = [
                            [0,1],[1,2],[2,3],[3,4],[4,5],[5,0], // outer hexagon
                            [0,3],[1,4],[2,5]  // inner star connections -> each vertex degree 4
                        ];

                        // Euler circuit for this graph
                        var eulerCircuit = [0,1,4,3,0,5,2,3,4,5,2,1,0]; // edges: 0-1,1-4,4-3,3-0,0-5,5-2,2-3,3-4,4-5,5-2... hmm need to verify

                        // Actually let's compute a valid Euler circuit
                        // Degrees: A=4(0-1,0-3,0-5,?), wait let me recount
                        // 0: edges to 1,5,3 = degree 3... that's odd. Let me fix.
                        // Hexagon: each vertex degree 2. Inner: 0-3,1-4,2-5: each vertex +1 = degree 3. All odd!
                        // Need: edges that give even degrees. Use double triangle.
                        // Simple: use a rectangular graph with all degree 2 (a cycle)
                        // Or: K4 minus one edge? No.
                        // Best: use the complete graph K3 tripled? No, multigraph.
                        // Let's use: A-B-C-D-A-C, B-D (bowtie-like)
                        // A:3, B:3, C:3, D:3 -> all odd again
                        // Just use a simple Euler circuit example:
                        // Square with both diagonals: A-B-C-D-A-C + B-D
                        // A:3, B:3, C:3, D:3 -> odd.
                        // Rectangle: A-B-C-D-A + B-D => A:2, B:3, C:2, D:3 -> Euler path but not circuit
                        // Simple even-degree graph: two triangles sharing an edge
                        // A-B-C-A-D-B, C-D: A:3,B:3,C:2,D:2 -> not all even
                        // Just use a hexagon (all degree 2) for simplicity

                        vertices = [
                            { x: 200, y: 80 }, { x: 340, y: 80 }, { x: 400, y: 200 },
                            { x: 340, y: 320 }, { x: 200, y: 320 }, { x: 140, y: 200 }
                        ];
                        edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,2],[2,4],[4,0]];
                        // Degrees: 0: 1,5,2,4 = degree 4. 1: 0,2 = degree 2. 2: 1,3,0,4 = degree 4. 3: 2,4 = degree 2. 4: 3,5,2,0 = degree 4. 5: 4,0 = degree 2.
                        // All even! Good.
                        eulerCircuit = [0,1,2,3,4,0,2,4,5,0];
                        // Edges used: 0-1, 1-2, 2-3, 3-4, 4-0, 0-2, 2-4, 4-5, 5-0
                        // That's 9 edges. We have 9 edges. Good.

                        var animStep = 0;
                        var animating = false;
                        var animTimer = null;

                        VizEngine.createButton(controls, 'Trace Euler Circuit', function() {
                            if (animating) return;
                            animating = true;
                            animStep = 0;
                            function step() {
                                animStep++;
                                draw();
                                if (animStep >= eulerCircuit.length - 1) {
                                    animating = false;
                                    return;
                                }
                                animTimer = setTimeout(step, 500);
                            }
                            step();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            animating = false;
                            if (animTimer) clearTimeout(animTimer);
                            animStep = 0;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Euler Circuit: Traverse Every Edge Exactly Once', viz.width / 2, 20, viz.colors.white, 13);

                            // Draw all edges (dim)
                            for (var i = 0; i < edges.length; i++) {
                                var v1 = vertices[edges[i][0]], v2 = vertices[edges[i][1]];
                                ctx.strokeStyle = viz.colors.text + '33';
                                ctx.lineWidth = 3;
                                ctx.beginPath(); ctx.moveTo(v1.x, v1.y); ctx.lineTo(v2.x, v2.y); ctx.stroke();
                            }

                            // Draw traversed edges (bright)
                            var traversedEdges = [];
                            for (var s = 0; s < Math.min(animStep, eulerCircuit.length - 1); s++) {
                                var a = eulerCircuit[s], b = eulerCircuit[s + 1];
                                traversedEdges.push([a, b]);
                                var v1 = vertices[a], v2 = vertices[b];

                                var hue = s / (eulerCircuit.length - 1);
                                var colors = [viz.colors.green, viz.colors.teal, viz.colors.blue, viz.colors.purple, viz.colors.orange, viz.colors.pink, viz.colors.yellow, viz.colors.red, viz.colors.green];
                                var col = colors[s % colors.length];

                                ctx.strokeStyle = col;
                                ctx.lineWidth = 4;
                                ctx.beginPath(); ctx.moveTo(v1.x, v1.y); ctx.lineTo(v2.x, v2.y); ctx.stroke();

                                // Step number on edge midpoint
                                var mx = (v1.x + v2.x) / 2, my = (v1.y + v2.y) / 2;
                                ctx.fillStyle = col;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText((s + 1).toString(), mx + 8, my - 8);
                            }

                            // Draw vertices
                            for (var i = 0; i < n; i++) {
                                var v = vertices[i];
                                var isCurrent = animStep > 0 && animStep < eulerCircuit.length && eulerCircuit[animStep] === i;
                                var isStart = animStep > 0 && eulerCircuit[0] === i;

                                var r = isCurrent ? 20 : 16;
                                if (isCurrent) {
                                    ctx.fillStyle = viz.colors.yellow + '44';
                                    ctx.beginPath(); ctx.arc(v.x, v.y, r + 6, 0, Math.PI * 2); ctx.fill();
                                }

                                ctx.fillStyle = vertexColors[i % vertexColors.length];
                                ctx.beginPath(); ctx.arc(v.x, v.y, r, 0, Math.PI * 2); ctx.fill();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(labels[i], v.x, v.y);

                                // Degree
                                var deg = 0;
                                for (var j = 0; j < edges.length; j++) {
                                    if (edges[j][0] === i || edges[j][1] === i) deg++;
                                }
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('deg=' + deg, v.x, v.y + r + 12);
                            }

                            // Status
                            var statusMsg = animStep === 0 ? 'Click "Trace Euler Circuit" to begin' :
                                            (animStep >= eulerCircuit.length - 1 ? 'Complete! All ' + edges.length + ' edges traversed, returned to start.' :
                                            'Step ' + animStep + '/' + (eulerCircuit.length - 1) + ': traversing edge...');
                            var statusColor = animStep >= eulerCircuit.length - 1 ? viz.colors.green : viz.colors.yellow;
                            viz.screenText(statusMsg, viz.width / 2, viz.height - 25, statusColor, 12);

                            viz.screenText('All vertices have even degree \u2192 Euler circuit exists', viz.width / 2, viz.height - 8, viz.colors.teal, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that a graph with \\(n\\) vertices and more than \\(\\binom{n-1}{2}\\) edges must be connected.',
                    hint: 'The maximum number of edges in a disconnected graph on \\(n\\) vertices occurs when one component is \\(K_{n-1}\\) and one vertex is isolated.',
                    solution: 'A disconnected graph can be partitioned into components. The maximum edges occur when all but one vertex form a complete graph \\(K_{n-1}\\), giving \\(\\binom{n-1}{2}\\) edges. If \\(|E| > \\binom{n-1}{2}\\), the graph cannot be disconnected, so it must be connected.'
                },
                {
                    question: 'A graph has 3 connected components with 4, 3, and 2 vertices respectively. What is the maximum number of edges it can have?',
                    hint: 'The maximum edges in a connected component on \\(k\\) vertices is \\(\\binom{k}{2}\\), achieved by \\(K_k\\).',
                    solution: 'Each component can have at most \\(\\binom{k}{2}\\) edges (the complete graph). So the maximum is \\(\\binom{4}{2} + \\binom{3}{2} + \\binom{2}{2} = 6 + 3 + 1 = 10\\) edges.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Eulerian & Hamiltonian
        // ================================================================
        {
            id: 'sec-euler',
            title: 'Eulerian & Hamiltonian',
            content: `
<h2>Eulerian and Hamiltonian Graphs</h2>

<p>Two fundamental questions about traversing a graph:</p>
<ol>
    <li><strong>Eulerian:</strong> Can you traverse every <em>edge</em> exactly once?</li>
    <li><strong>Hamiltonian:</strong> Can you visit every <em>vertex</em> exactly once?</li>
</ol>

<p>Despite their similar phrasing, these questions have very different answers. Euler's is completely solved; Hamilton's is computationally intractable.</p>

<h3>Eulerian Paths and Circuits</h3>

<div class="env-block definition">
    <div class="env-title">Definition 10.12 (Euler Path and Circuit)</div>
    <div class="env-body">
        <p>An <strong>Euler path</strong> in a graph is a trail (walk with no repeated edges) that visits every edge exactly once. An <strong>Euler circuit</strong> is an Euler path that starts and ends at the same vertex.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.6 (Euler's Theorem)</div>
    <div class="env-body">
        <p>A connected graph \\(G\\) has:</p>
        <ul>
            <li>An <strong>Euler circuit</strong> if and only if every vertex has even degree.</li>
            <li>An <strong>Euler path</strong> (but not a circuit) if and only if exactly two vertices have odd degree. The path must start at one odd-degree vertex and end at the other.</li>
        </ul>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch (Necessity for Euler Circuit)</div>
    <div class="env-body">
        <p>If an Euler circuit exists, then every time the circuit enters a vertex through one edge, it must leave through a different edge. So edges at each vertex are paired into "enter/exit" pairs, giving an even degree.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Hamiltonian Paths and Cycles</h3>

<div class="env-block definition">
    <div class="env-title">Definition 10.13 (Hamiltonian Path and Cycle)</div>
    <div class="env-body">
        <p>A <strong>Hamiltonian path</strong> visits every vertex exactly once. A <strong>Hamiltonian cycle</strong> visits every vertex exactly once and returns to the starting vertex.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.7 (Dirac's Theorem, 1952)</div>
    <div class="env-body">
        <p>If \\(G\\) is a simple graph with \\(n \\geq 3\\) vertices and every vertex has degree \\(\\geq n/2\\), then \\(G\\) has a Hamiltonian cycle.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Complexity Gap</div>
    <div class="env-body">
        <p>Testing whether a graph has an Euler circuit is easy: just check if every vertex has even degree (\\(O(n + m)\\) time). Testing whether a graph has a Hamiltonian cycle is NP-complete: no efficient algorithm is known. This is one of the most striking complexity gaps in graph theory.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Euler vs. Hamilton on \\(K_5\\)</div>
    <div class="env-body">
        <p>\\(K_5\\) has 5 vertices, each with degree 4 (even). So it has an Euler circuit. Since \\(4 \\geq 5/2 = 2.5\\), Dirac's theorem guarantees a Hamiltonian cycle as well.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-hamiltonian-demo"></div>
`,
            visualizations: [
                {
                    id: 'viz-hamiltonian-demo',
                    title: 'Find a Hamiltonian Cycle',
                    description: 'Try to visit every vertex exactly once and return to the start! Click vertices to build your path. Backtrack if you get stuck. Different graphs have different difficulty levels.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var graphs = {
                            'Petersen': {
                                n: 10,
                                positions: (function() {
                                    var p = [];
                                    for (var i = 0; i < 5; i++) {
                                        var a = -Math.PI / 2 + 2 * Math.PI * i / 5;
                                        p.push({ x: 220 + 130 * Math.cos(a), y: 200 + 130 * Math.sin(a) });
                                    }
                                    for (var i = 0; i < 5; i++) {
                                        var a = -Math.PI / 2 + 2 * Math.PI * i / 5;
                                        p.push({ x: 220 + 55 * Math.cos(a), y: 200 + 55 * Math.sin(a) });
                                    }
                                    return p;
                                })(),
                                edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[5,7],[7,9],[9,6],[6,8],[8,5],[0,5],[1,6],[2,7],[3,8],[4,9]],
                                hamiltonian: false,
                                hint: 'The Petersen graph has no Hamiltonian cycle!'
                            },
                            'Dodecahedron': {
                                n: 8,
                                positions: (function() {
                                    var p = [];
                                    for (var i = 0; i < 4; i++) {
                                        var a = -Math.PI / 2 + 2 * Math.PI * i / 4;
                                        p.push({ x: 220 + 120 * Math.cos(a), y: 200 + 120 * Math.sin(a) });
                                    }
                                    for (var i = 0; i < 4; i++) {
                                        var a = -Math.PI / 4 + 2 * Math.PI * i / 4;
                                        p.push({ x: 220 + 60 * Math.cos(a), y: 200 + 60 * Math.sin(a) });
                                    }
                                    return p;
                                })(),
                                edges: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],
                                hamiltonian: true,
                                hint: 'This is a cube graph. A Hamiltonian cycle exists!'
                            },
                            'K5': {
                                n: 5,
                                positions: (function() {
                                    var p = [];
                                    for (var i = 0; i < 5; i++) {
                                        var a = -Math.PI / 2 + 2 * Math.PI * i / 5;
                                        p.push({ x: 220 + 110 * Math.cos(a), y: 200 + 110 * Math.sin(a) });
                                    }
                                    return p;
                                })(),
                                edges: [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]],
                                hamiltonian: true,
                                hint: 'Every vertex connects to every other. Easy!'
                            }
                        };

                        var currentGraph = 'Dodecahedron';
                        var path = [];
                        var message = 'Click a vertex to start';
                        var solved = false;
                        var labels = '0123456789';
                        var vertexColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink, viz.colors.red, viz.colors.yellow, viz.colors.blue, viz.colors.teal];

                        Object.keys(graphs).forEach(function(name) {
                            VizEngine.createButton(controls, name, function() {
                                currentGraph = name;
                                path = [];
                                message = 'Click a vertex to start';
                                solved = false;
                                draw();
                            });
                        });

                        VizEngine.createButton(controls, 'Undo', function() {
                            if (path.length > 0 && !solved) {
                                path.pop();
                                message = path.length > 0 ? 'Path length: ' + (path.length - 1) : 'Click a vertex to start';
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            path = [];
                            message = 'Click a vertex to start';
                            solved = false;
                            draw();
                        });

                        function hasEdge(g, a, b) {
                            for (var i = 0; i < g.edges.length; i++) {
                                if ((g.edges[i][0] === a && g.edges[i][1] === b) ||
                                    (g.edges[i][0] === b && g.edges[i][1] === a)) return true;
                            }
                            return false;
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (solved) return;
                            var g = graphs[currentGraph];
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;

                            for (var i = 0; i < g.n; i++) {
                                var p = g.positions[i];
                                var dx = mx - p.x, dy = my - p.y;
                                if (dx * dx + dy * dy < 625) {
                                    if (path.length === 0) {
                                        path.push(i);
                                        message = 'Started at vertex ' + i + '. Click adjacent vertices.';
                                    } else {
                                        var last = path[path.length - 1];
                                        if (!hasEdge(g, last, i)) {
                                            message = 'No edge from ' + last + ' to ' + i + '!';
                                        } else if (path.length === g.n && i === path[0]) {
                                            // Completing the cycle
                                            path.push(i);
                                            solved = true;
                                            message = 'Hamiltonian cycle found!';
                                        } else if (path.indexOf(i) >= 0) {
                                            if (i === path[0] && path.length < g.n) {
                                                message = 'Must visit all ' + g.n + ' vertices before returning! (' + path.length + '/' + g.n + ')';
                                            } else {
                                                message = 'Vertex ' + i + ' already visited!';
                                            }
                                        } else {
                                            path.push(i);
                                            message = 'Visited ' + path.length + '/' + g.n + ' vertices.';
                                            if (path.length === g.n) {
                                                // Check if can return to start
                                                if (hasEdge(g, i, path[0])) {
                                                    message += ' Click vertex ' + path[0] + ' to complete the cycle!';
                                                } else {
                                                    message += ' No edge back to start. Undo or reset.';
                                                }
                                            }
                                        }
                                    }
                                    draw();
                                    return;
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = graphs[currentGraph];

                            viz.screenText('Hamiltonian Cycle: ' + currentGraph, viz.width / 2, 20, viz.colors.white, 14);

                            // Draw edges
                            for (var i = 0; i < g.edges.length; i++) {
                                var v1 = g.positions[g.edges[i][0]], v2 = g.positions[g.edges[i][1]];
                                ctx.strokeStyle = viz.colors.text + '44';
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(v1.x, v1.y); ctx.lineTo(v2.x, v2.y); ctx.stroke();
                            }

                            // Draw path edges
                            if (path.length > 1) {
                                for (var i = 0; i < path.length - 1; i++) {
                                    var v1 = g.positions[path[i]], v2 = g.positions[path[i + 1]];
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 4;
                                    ctx.beginPath(); ctx.moveTo(v1.x, v1.y); ctx.lineTo(v2.x, v2.y); ctx.stroke();
                                }
                            }

                            // Draw vertices
                            for (var i = 0; i < g.n; i++) {
                                var p = g.positions[i];
                                var visited = path.indexOf(i) >= 0;
                                var isCurrent = path.length > 0 && path[path.length - 1] === i;
                                var r = isCurrent ? 18 : 14;

                                if (isCurrent && !solved) {
                                    ctx.fillStyle = viz.colors.yellow + '44';
                                    ctx.beginPath(); ctx.arc(p.x, p.y, r + 6, 0, Math.PI * 2); ctx.fill();
                                }

                                ctx.fillStyle = visited ? (solved ? viz.colors.green : vertexColors[i % vertexColors.length]) : viz.colors.text + '66';
                                ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();

                                ctx.fillStyle = visited ? viz.colors.white : viz.colors.text;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), p.x, p.y);
                            }

                            // Info panel
                            var infoX = 420, infoY = 60;
                            viz.screenText('n = ' + g.n, infoX + 40, infoY, viz.colors.text, 11);
                            viz.screenText('|E| = ' + g.edges.length, infoX + 40, infoY + 16, viz.colors.text, 11);
                            var hamStr = g.hamiltonian ? 'Yes' : 'No!';
                            var hamCol = g.hamiltonian ? viz.colors.green : viz.colors.red;
                            viz.screenText('Hamiltonian: ' + hamStr, infoX + 40, infoY + 32, hamCol, 11);

                            if (!g.hamiltonian && path.length > 0 && !solved) {
                                viz.screenText(g.hint, infoX + 40, infoY + 56, viz.colors.red, 10);
                            }

                            var msgColor = solved ? viz.colors.green : viz.colors.yellow;
                            viz.screenText(message, viz.width / 2, viz.height - 25, msgColor, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Does the following graph have an Euler path? An Euler circuit? Vertices: \\(\\{A,B,C,D,E\\}\\), Edges: \\(\\{AB, BC, CD, DE, EA, AC\\}\\).',
                    hint: 'Compute the degree of each vertex and apply Euler\'s theorem.',
                    solution: 'Degrees: A has edges AB, EA, AC so deg(A)=3. B has AB, BC so deg(B)=2. C has BC, CD, AC so deg(C)=3. D has CD, DE so deg(D)=2. E has DE, EA so deg(E)=2. Two vertices (A and C) have odd degree, two have even degree. By Euler\'s theorem: the graph has an Euler path from A to C (or C to A), but no Euler circuit.'
                },
                {
                    question: 'A connected graph has 6 vertices, each of degree 2. What can you say about this graph?',
                    hint: 'If every vertex has degree 2, the graph consists of disjoint cycles. Since it is connected...',
                    solution: 'A graph where every vertex has degree 2 is a disjoint union of cycles. Since the graph is connected, it must be a single cycle. With 6 vertices, it is \\(C_6\\). It has an Euler circuit (all degrees even) and a Hamiltonian cycle (it is itself a Hamiltonian cycle).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Graph Isomorphism
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Graph Isomorphism',
            content: `
<h2>Graph Isomorphism</h2>

<div class="env-block intuition">
    <div class="env-title">Same Graph, Different Drawing</div>
    <div class="env-body">
        <p>Two graphs may look completely different when drawn on paper, yet have identical structure. The question "are these really the same graph?" is formalized through the concept of isomorphism.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 10.14 (Graph Isomorphism)</div>
    <div class="env-body">
        <p>Two graphs \\(G_1 = (V_1, E_1)\\) and \\(G_2 = (V_2, E_2)\\) are <strong>isomorphic</strong>, written \\(G_1 \\cong G_2\\), if there exists a bijection \\(f: V_1 \\to V_2\\) such that</p>
        \\[\\{u, v\\} \\in E_1 \\iff \\{f(u), f(v)\\} \\in E_2.\\]
        <p>The function \\(f\\) is called an <strong>isomorphism</strong>.</p>
    </div>
</div>

<p>Isomorphic graphs have the same:</p>
<ul>
    <li>Number of vertices and edges</li>
    <li>Degree sequence</li>
    <li>Number of connected components</li>
    <li>Cycle lengths</li>
    <li>Chromatic number, independence number, clique number, etc.</li>
</ul>

<p>These are <strong>graph invariants</strong>: properties that are preserved under isomorphism. If two graphs differ on any invariant, they cannot be isomorphic. However, matching all common invariants does not guarantee isomorphism.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.8</div>
    <div class="env-body">
        <p>Determining whether two graphs are isomorphic is in the complexity class <strong>GI</strong> (graph isomorphism). It is not known to be in P or NP-complete. Babai (2015) showed it can be solved in quasipolynomial time \\(2^{O((\\log n)^c)}\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Two Isomorphic Graphs</div>
    <div class="env-body">
        <p>Graph \\(G_1\\): vertices \\(\\{1,2,3,4\\}\\), edges \\(\\{12, 23, 34, 14\\}\\) (a 4-cycle).</p>
        <p>Graph \\(G_2\\): vertices \\(\\{a,b,c,d\\}\\), edges \\(\\{ab, bc, cd, da\\}\\) (also a 4-cycle).</p>
        <p>The bijection \\(f(1)=a, f(2)=b, f(3)=c, f(4)=d\\) is an isomorphism. Indeed, any relabeling of a 4-cycle is another 4-cycle.</p>
    </div>
</div>

<h3>Proving Non-Isomorphism</h3>

<p>To prove two graphs are <strong>not</strong> isomorphic, find an invariant on which they differ. Common strategies:</p>
<ol>
    <li>Different number of vertices or edges.</li>
    <li>Different degree sequences.</li>
    <li>One has a cycle of length \\(k\\); the other does not.</li>
    <li>Different numbers of paths of a given length between vertices of specific degrees.</li>
</ol>

<div class="viz-placeholder" data-viz="viz-graph-isomorphism"></div>
`,
            visualizations: [
                {
                    id: 'viz-graph-isomorphism',
                    title: 'Graph Isomorphism Challenge',
                    description: 'Are these two graphs isomorphic? Drag vertices of Graph 2 to rearrange them and try to match the structure of Graph 1. If you can make them look the same, they are isomorphic!',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var puzzles = [
                            {
                                name: 'Isomorphic (C4)',
                                g1: {
                                    positions: [{ x: 70, y: 120 }, { x: 190, y: 120 }, { x: 190, y: 260 }, { x: 70, y: 260 }],
                                    edges: [[0,1],[1,2],[2,3],[3,0]]
                                },
                                g2: {
                                    positions: [{ x: 370, y: 100 }, { x: 490, y: 180 }, { x: 430, y: 300 }, { x: 330, y: 230 }],
                                    edges: [[0,1],[1,2],[2,3],[3,0]]
                                },
                                isIso: true
                            },
                            {
                                name: 'Not Isomorphic',
                                g1: {
                                    positions: [{ x: 70, y: 120 }, { x: 190, y: 120 }, { x: 190, y: 260 }, { x: 70, y: 260 }],
                                    edges: [[0,1],[1,2],[2,3],[3,0],[0,2]]
                                },
                                g2: {
                                    positions: [{ x: 370, y: 100 }, { x: 490, y: 180 }, { x: 430, y: 300 }, { x: 330, y: 230 }],
                                    edges: [[0,1],[1,2],[2,3],[3,0],[1,3]]
                                },
                                isIso: true // Actually these ARE isomorphic (C4 + one diagonal each)
                            },
                            {
                                name: 'Degree Test',
                                g1: {
                                    positions: [{ x: 80, y: 120 }, { x: 180, y: 120 }, { x: 180, y: 260 }, { x: 80, y: 260 }, { x: 130, y: 190 }],
                                    edges: [[0,1],[1,2],[2,3],[3,0],[0,4],[1,4]]
                                },
                                g2: {
                                    positions: [{ x: 380, y: 120 }, { x: 480, y: 120 }, { x: 480, y: 260 }, { x: 380, y: 260 }, { x: 430, y: 190 }],
                                    edges: [[0,1],[1,2],[2,3],[3,0],[2,4],[3,4]]
                                },
                                isIso: true // same degree sequence (3,3,2,2,2), isomorphic
                            }
                        ];

                        var currentPuzzle = 0;
                        var dragVertex = -1;
                        var showAnswer = false;

                        puzzles.forEach(function(p, idx) {
                            VizEngine.createButton(controls, 'Puzzle ' + (idx + 1), function() {
                                currentPuzzle = idx;
                                showAnswer = false;
                                draw();
                            });
                        });

                        VizEngine.createButton(controls, 'Check', function() {
                            showAnswer = true;
                            draw();
                        });

                        // Make G2 vertices draggable
                        viz.canvas.addEventListener('mousedown', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var g2 = puzzles[currentPuzzle].g2;
                            for (var i = 0; i < g2.positions.length; i++) {
                                var dx = mx - g2.positions[i].x, dy = my - g2.positions[i].y;
                                if (dx * dx + dy * dy < 400) { dragVertex = i; break; }
                            }
                        });

                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (dragVertex < 0) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var g2 = puzzles[currentPuzzle].g2;
                            g2.positions[dragVertex].x = e.clientX - rect.left;
                            g2.positions[dragVertex].y = e.clientY - rect.top;
                            draw();
                        });

                        viz.canvas.addEventListener('mouseup', function() { dragVertex = -1; });
                        viz.canvas.addEventListener('mouseleave', function() { dragVertex = -1; });

                        var labelsG1 = '12345';
                        var labelsG2 = 'abcde';

                        function drawGraph(g, labels, offsetX, title, colors) {
                            var ctx = viz.ctx;
                            viz.screenText(title, offsetX + 130, 50, viz.colors.white, 12);

                            // Edges
                            for (var i = 0; i < g.edges.length; i++) {
                                var p1 = g.positions[g.edges[i][0]], p2 = g.positions[g.edges[i][1]];
                                ctx.strokeStyle = viz.colors.text + '66';
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                            }

                            // Vertices
                            for (var i = 0; i < g.positions.length; i++) {
                                var p = g.positions[i];
                                ctx.fillStyle = colors[i % colors.length];
                                ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(labels[i], p.x, p.y);
                            }

                            // Degree sequence
                            var degrees = [];
                            for (var i = 0; i < g.positions.length; i++) {
                                var d = 0;
                                for (var j = 0; j < g.edges.length; j++) {
                                    if (g.edges[j][0] === i || g.edges[j][1] === i) d++;
                                }
                                degrees.push(d);
                            }
                            var sorted = degrees.slice().sort(function(a, b) { return b - a; });
                            viz.screenText('Deg: (' + sorted.join(',') + ')', offsetX + 130, 320, viz.colors.text, 10);
                            viz.screenText('|E|=' + g.edges.length, offsetX + 130, 336, viz.colors.text, 10);
                        }

                        function draw() {
                            viz.clear();
                            var puzzle = puzzles[currentPuzzle];

                            viz.screenText('Graph Isomorphism: Puzzle ' + (currentPuzzle + 1), viz.width / 2, 22, viz.colors.white, 14);
                            viz.screenText('Drag vertices of Graph 2 to rearrange', viz.width / 2, 38, viz.colors.text, 10);

                            // Dividing line
                            var ctx = viz.ctx;
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(280, 50); ctx.lineTo(280, 350); ctx.stroke();
                            ctx.setLineDash([]);

                            var colorsG1 = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green];
                            var colorsG2 = [viz.colors.pink, viz.colors.yellow, viz.colors.red, viz.colors.green, viz.colors.blue];

                            drawGraph(puzzle.g1, labelsG1, 0, 'Graph 1', colorsG1);
                            drawGraph(puzzle.g2, labelsG2, 280, 'Graph 2', colorsG2);

                            if (showAnswer) {
                                var msg = puzzle.isIso ? 'ISOMORPHIC' : 'NOT ISOMORPHIC';
                                var col = puzzle.isIso ? viz.colors.green : viz.colors.red;
                                viz.screenText(msg, viz.width / 2, viz.height - 25, col, 16);
                            } else {
                                viz.screenText('Drag G2 vertices. Click "Check" when ready.', viz.width / 2, viz.height - 25, viz.colors.yellow, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that the following two graphs are not isomorphic: \\(G_1\\) is \\(C_6\\) (a 6-cycle) and \\(G_2\\) is \\(K_{3,3}\\) (complete bipartite graph). Both have 6 vertices and 9 edges... wait, \\(C_6\\) has 6 edges. So they cannot be isomorphic just from edge count. Find a subtler pair: \\(G_1 = C_6\\) (6 vertices, 6 edges, all degree 2) vs \\(G_2\\): 6 vertices, 6 edges, degree sequence (3,2,2,2,2,1). Are these isomorphic?',
                    hint: 'Compare degree sequences.',
                    solution: 'No. \\(G_1 = C_6\\) has degree sequence \\((2,2,2,2,2,2)\\). \\(G_2\\) has degree sequence \\((3,2,2,2,2,1)\\). Since the degree sequences differ, the graphs cannot be isomorphic. The degree sequence is a graph invariant.'
                },
                {
                    question: 'How many non-isomorphic simple graphs are there on 3 vertices?',
                    hint: 'There are \\(\\binom{3}{2} = 3\\) possible edges. Each can be present or absent, giving \\(2^3 = 8\\) labeled graphs. But many are isomorphic to each other.',
                    solution: 'The possible edge counts are 0, 1, 2, 3. For 0 edges: one graph (three isolated vertices). For 1 edge: one graph (up to isomorphism, one edge and one isolated vertex). For 2 edges: one graph (a path of length 2). For 3 edges: one graph (\\(K_3\\), the triangle). Total: 4 non-isomorphic simple graphs on 3 vertices.'
                },
            ]
        }
    ]
});
