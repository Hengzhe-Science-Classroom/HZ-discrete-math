window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch12',
    number: 12,
    title: 'Graph Algorithms',
    subtitle: 'Searching, shortest paths, and matching',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Graph Algorithms Matter',
            content: `
<h2>Why Graph Algorithms Matter</h2>

<div class="env-block intuition">
    <div class="env-title">A Puzzle to Start</div>
    <div class="env-body">
        <p>A city has a network of one-way streets. A delivery driver starts at the warehouse and must reach every customer in the fewest total kilometers. Some streets are faster than others. How should the driver plan routes?</p>
        <p>This is fundamentally a graph problem: intersections are vertices, streets are directed edges with weights (distances), and the driver needs shortest paths. The algorithms in this chapter give systematic, efficient solutions to exactly this kind of question.</p>
    </div>
</div>

<p>In earlier chapters we studied graphs as combinatorial objects: their structure, connectivity, planarity, coloring. Now we shift perspective from <strong>what a graph is</strong> to <strong>what we can compute on a graph</strong>. This is the algorithmic viewpoint.</p>

<p>The transition matters because many real problems, from routing packets across the internet to scheduling jobs to matching organ donors with patients, reduce to well-studied graph problems with known efficient algorithms.</p>

<h3>The Algorithmic Questions</h3>

<p>Given a graph \\(G = (V, E)\\) with \\(n = |V|\\) vertices and \\(m = |E|\\) edges, the core algorithmic questions include:</p>
<ol>
    <li><strong>Traversal:</strong> How do we systematically visit every vertex? (BFS, DFS)</li>
    <li><strong>Shortest paths:</strong> What is the cheapest route between two vertices? (Dijkstra, Bellman-Ford)</li>
    <li><strong>Matching:</strong> What is the largest set of edges with no shared endpoints? (Bipartite matching)</li>
    <li><strong>Flow:</strong> How much "material" can we push through a network from source to sink? (Max-flow)</li>
</ol>

<h3>Complexity and Representation</h3>

<p>We typically represent graphs in one of two ways:</p>
<ul>
    <li><strong>Adjacency matrix:</strong> An \\(n \\times n\\) matrix \\(A\\) where \\(A[i][j] = 1\\) (or the edge weight) if \\((i,j) \\in E\\). Uses \\(\\Theta(n^2)\\) space.</li>
    <li><strong>Adjacency list:</strong> For each vertex, store a list of its neighbors. Uses \\(\\Theta(n + m)\\) space.</li>
</ul>

<p>For sparse graphs (\\(m \\ll n^2\\)), adjacency lists are more efficient. Most algorithms in this chapter work with adjacency lists and run in \\(O(n + m)\\) or \\(O((n + m) \\log n)\\) time.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Breadth-first search was formalized by Edward F. Moore in 1959 for finding shortest paths in mazes. Depth-first search was analyzed systematically by Robert Tarjan in 1972, who discovered its deep connection to graph structure (strongly connected components, biconnected components). Dijkstra published his shortest-path algorithm in 1959 in a two-page paper. The max-flow min-cut theorem was proved by Ford and Fulkerson in 1956.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Breadth-First Search
        // ================================================================
        {
            id: 'sec-bfs',
            title: 'Breadth-First Search',
            content: `
<h2>Breadth-First Search</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Intuition</div>
    <div class="env-body">
        <p>Imagine dropping a stone into still water. Ripples spread outward in concentric circles: first the points at distance 1, then distance 2, then distance 3, and so on. BFS explores a graph the same way, discovering all vertices at distance \\(k\\) before any vertex at distance \\(k+1\\).</p>
    </div>
</div>

<h3>The Algorithm</h3>

<p>BFS uses a <strong>queue</strong> (first-in, first-out) to manage the exploration frontier. Starting from a source vertex \\(s\\):</p>

<div class="env-block definition">
    <div class="env-title">Algorithm 12.1 (Breadth-First Search)</div>
    <div class="env-body">
        <p><strong>Input:</strong> Graph \\(G = (V, E)\\), source vertex \\(s\\).</p>
        <p><strong>Output:</strong> For each vertex \\(v\\), the distance \\(d(v)\\) from \\(s\\) and a predecessor \\(\\pi(v)\\).</p>
        <ol>
            <li>Set \\(d(s) = 0\\), \\(d(v) = \\infty\\) for all \\(v \\neq s\\). Mark all vertices as undiscovered.</li>
            <li>Initialize queue \\(Q = \\{s\\}\\). Mark \\(s\\) as discovered.</li>
            <li>While \\(Q\\) is not empty:
                <ol style="list-style-type: lower-alpha;">
                    <li>Dequeue vertex \\(u\\) from the front of \\(Q\\).</li>
                    <li>For each neighbor \\(v\\) of \\(u\\):
                        <ul>
                            <li>If \\(v\\) is undiscovered: set \\(d(v) = d(u) + 1\\), \\(\\pi(v) = u\\), mark \\(v\\) as discovered, enqueue \\(v\\).</li>
                        </ul>
                    </li>
                </ol>
            </li>
        </ol>
    </div>
</div>

<h3>Correctness and Complexity</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.1 (BFS Shortest Paths)</div>
    <div class="env-body">
        <p>For an unweighted graph \\(G\\), BFS from source \\(s\\) computes \\(d(v) = \\delta(s, v)\\) for every vertex \\(v\\), where \\(\\delta(s, v)\\) is the length of a shortest path from \\(s\\) to \\(v\\). The algorithm runs in \\(O(n + m)\\) time.</p>
    </div>
</div>

<p><strong>Proof sketch.</strong> Each vertex is enqueued at most once (it is marked discovered before enqueuing), so the total work for dequeuing and scanning neighbors is \\(O(n + m)\\). For correctness, one shows by induction on \\(k\\) that when BFS processes all vertices at distance \\(k\\), it has correctly computed distances for all vertices at distance \\(\\leq k\\).</p>

<h3>The BFS Tree</h3>

<p>The predecessor pointers \\(\\pi(v)\\) define a <strong>BFS tree</strong> rooted at \\(s\\). Every edge \\((\\pi(v), v)\\) lies on a shortest path from \\(s\\) to \\(v\\). To recover the actual shortest path, trace back from \\(v\\) through \\(\\pi(v), \\pi(\\pi(v)), \\ldots\\) until reaching \\(s\\).</p>

<div class="env-block example">
    <div class="env-title">Example: Social Network Distance</div>
    <div class="env-body">
        <p>In a social network, an edge means "friends." BFS from a person \\(s\\) finds all people at friendship distance 1 (direct friends), distance 2 (friends of friends), and so on. This is exactly how "degrees of separation" are computed.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-bfs"></div>
`,
            visualizations: [
                {
                    id: 'viz-bfs',
                    title: 'BFS: Level-by-Level Exploration',
                    description: 'Watch BFS explore a graph level by level. The queue is shown below. Vertices are colored by their distance from the source. Click "Step" to advance one step, or "Play" for animation.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Graph definition: positions and adjacency
                        var nodes = [
                            {id: 0, label: 'A', x: 80, y: 60},
                            {id: 1, label: 'B', x: 200, y: 40},
                            {id: 2, label: 'C', x: 160, y: 140},
                            {id: 3, label: 'D', x: 320, y: 60},
                            {id: 4, label: 'E', x: 280, y: 160},
                            {id: 5, label: 'F', x: 440, y: 100},
                            {id: 6, label: 'G', x: 400, y: 200},
                            {id: 7, label: 'H', x: 520, y: 60},
                            {id: 8, label: 'I', x: 240, y: 250}
                        ];
                        var edges = [
                            [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,6],[5,7],[5,6],[6,8],[4,8]
                        ];
                        var adj = nodes.map(function() { return []; });
                        edges.forEach(function(e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });

                        var levelColors = [viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange, viz.colors.purple, viz.colors.pink];

                        // BFS state
                        var dist = [];
                        var visited = [];
                        var queue = [];
                        var order = [];
                        var currentEdge = null;
                        var playing = false;
                        var playTimer = null;
                        var done = false;

                        function reset() {
                            dist = nodes.map(function() { return -1; });
                            visited = nodes.map(function() { return false; });
                            queue = [0];
                            dist[0] = 0;
                            visited[0] = true;
                            order = [0];
                            currentEdge = null;
                            done = false;
                            draw();
                        }

                        function step() {
                            if (queue.length === 0) { done = true; draw(); return; }
                            var u = queue.shift();
                            var neighbors = adj[u];
                            for (var i = 0; i < neighbors.length; i++) {
                                var v = neighbors[i];
                                if (!visited[v]) {
                                    visited[v] = true;
                                    dist[v] = dist[u] + 1;
                                    queue.push(v);
                                    order.push(v);
                                }
                            }
                            currentEdge = u;
                            if (queue.length === 0 && neighbors.every(function(v) { return visited[v]; })) {
                                done = true;
                            }
                            draw();
                        }

                        function togglePlay() {
                            if (playing) {
                                playing = false;
                                if (playTimer) clearInterval(playTimer);
                                playTimer = null;
                            } else {
                                playing = true;
                                playTimer = setInterval(function() {
                                    if (done || queue.length === 0) {
                                        done = true;
                                        playing = false;
                                        clearInterval(playTimer);
                                        playTimer = null;
                                        draw();
                                        return;
                                    }
                                    step();
                                }, 700);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Title
                            viz.screenText('Breadth-First Search', viz.width / 2, 18, viz.colors.white, 16);

                            // Draw edges
                            edges.forEach(function(e) {
                                var n1 = nodes[e[0]], n2 = nodes[e[1]];
                                var edgeColor = viz.colors.grid;
                                // Highlight tree edges
                                if (dist[e[0]] >= 0 && dist[e[1]] >= 0 && visited[e[0]] && visited[e[1]]) {
                                    if (Math.abs(dist[e[0]] - dist[e[1]]) === 1) {
                                        edgeColor = '#4a4a7a';
                                    }
                                }
                                ctx.strokeStyle = edgeColor;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(n1.x, n1.y);
                                ctx.lineTo(n2.x, n2.y);
                                ctx.stroke();
                            });

                            // Draw nodes
                            nodes.forEach(function(n, i) {
                                var color = viz.colors.text;
                                var r = 18;
                                if (visited[i]) {
                                    var d = dist[i];
                                    color = levelColors[d % levelColors.length];
                                }
                                if (i === currentEdge) {
                                    // Glow for currently processed
                                    ctx.fillStyle = color + '33';
                                    ctx.beginPath(); ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2); ctx.fill();
                                }
                                ctx.fillStyle = visited[i] ? color : '#1a1a40';
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();

                                ctx.fillStyle = visited[i] ? '#0c0c20' : viz.colors.text;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);

                                // Distance label
                                if (dist[i] >= 0) {
                                    ctx.fillStyle = color;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.fillText('d=' + dist[i], n.x, n.y + r + 14);
                                }
                            });

                            // Queue display
                            var queueY = 320;
                            viz.screenText('Queue:', 40, queueY, viz.colors.text, 13, 'left');
                            if (queue.length === 0 && done) {
                                viz.screenText('(empty, BFS complete)', 100, queueY, viz.colors.green, 12, 'left');
                            } else {
                                queue.forEach(function(id, idx) {
                                    var qx = 100 + idx * 40;
                                    var d = dist[id];
                                    var c = levelColors[d % levelColors.length];
                                    ctx.fillStyle = c;
                                    ctx.fillRect(qx - 14, queueY - 12, 28, 24);
                                    ctx.fillStyle = '#0c0c20';
                                    ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(nodes[id].label, qx, queueY);
                                });
                            }

                            // Visit order
                            var orderY = 360;
                            viz.screenText('Visit order:', 40, orderY, viz.colors.text, 13, 'left');
                            order.forEach(function(id, idx) {
                                var ox = 140 + idx * 30;
                                ctx.fillStyle = levelColors[dist[id] % levelColors.length];
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(nodes[id].label, ox, orderY);
                            });

                            // Legend
                            var legY = 395;
                            for (var lv = 0; lv < Math.min(5, levelColors.length); lv++) {
                                var lx = 80 + lv * 100;
                                ctx.fillStyle = levelColors[lv];
                                ctx.fillRect(lx, legY - 6, 12, 12);
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText('Level ' + lv, lx + 16, legY);
                            }
                        }

                        VizEngine.createButton(controls, 'Step', step);
                        VizEngine.createButton(controls, 'Play/Pause', togglePlay);
                        VizEngine.createButton(controls, 'Reset', function() {
                            if (playing) togglePlay();
                            reset();
                        });
                        reset();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Run BFS from vertex \\(a\\) on the graph with vertices \\(\\{a, b, c, d, e, f\\}\\) and edges \\(\\{ab, ac, bd, be, cf, de\\}\\). List the vertices in the order they are discovered, and give the BFS tree.',
                    hint: 'Start with \\(a\\) at distance 0. Its neighbors \\(b, c\\) are at distance 1. Then process \\(b\\) and \\(c\\) to find vertices at distance 2.',
                    solution: 'Discovery order: \\(a, b, c, d, e, f\\). Distances: \\(d(a)=0, d(b)=1, d(c)=1, d(d)=2, d(e)=2, d(f)=2\\). BFS tree edges: \\(ab, ac, bd, be, cf\\). Note that \\(de\\) is not a tree edge since both \\(d\\) and \\(e\\) are discovered from \\(b\\).'
                },
                {
                    question: 'Prove that BFS correctly computes shortest-path distances in an unweighted graph. That is, show that \\(d(v) = \\delta(s, v)\\) for all \\(v\\).',
                    hint: 'Prove by induction on \\(\\delta(s,v)\\). Key lemma: if \\(d(u) \\leq d(v)\\), then \\(u\\) is dequeued before \\(v\\) (the queue processes vertices in non-decreasing order of distance).',
                    solution: 'By induction on \\(k = \\delta(s,v)\\). Base: \\(d(s) = 0 = \\delta(s,s)\\). Inductive step: assume the claim holds for all vertices at distance \\(< k\\). Let \\(v\\) be at distance \\(k\\), and let \\(u\\) be the vertex preceding \\(v\\) on a shortest path. Then \\(\\delta(s,u) = k-1\\), so \\(d(u) = k-1\\) by hypothesis. When \\(u\\) is dequeued, if \\(v\\) is not yet discovered, BFS sets \\(d(v) = d(u) + 1 = k\\). If \\(v\\) was already discovered, then \\(d(v) \\leq k\\). But \\(d(v) \\geq \\delta(s,v) = k\\) (BFS never underestimates), so \\(d(v) = k\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Depth-First Search
        // ================================================================
        {
            id: 'sec-dfs',
            title: 'Depth-First Search',
            content: `
<h2>Depth-First Search</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Intuition</div>
    <div class="env-body">
        <p>DFS is like exploring a maze: go as deep as possible along one path before backtracking. When you reach a dead end, you retreat to the last unexplored fork and try a different direction. This "aggressive depth, lazy breadth" strategy reveals deep structural information about the graph.</p>
    </div>
</div>

<h3>The Algorithm</h3>

<p>DFS uses a <strong>stack</strong> (last-in, first-out), either explicitly or via recursion. It timestamps each vertex with a <em>discovery time</em> and a <em>finish time</em>.</p>

<div class="env-block definition">
    <div class="env-title">Algorithm 12.2 (Depth-First Search)</div>
    <div class="env-body">
        <p><strong>Input:</strong> Graph \\(G = (V, E)\\).</p>
        <p><strong>Output:</strong> For each vertex \\(v\\): discovery time \\(d(v)\\), finish time \\(f(v)\\), predecessor \\(\\pi(v)\\).</p>
        <p>Initialize: set all vertices to undiscovered, time \\(t = 0\\).</p>
        <p><strong>DFS-Visit</strong>\\((u)\\):</p>
        <ol>
            <li>\\(t \\gets t + 1\\); set \\(d(u) = t\\). Mark \\(u\\) as discovered.</li>
            <li>For each neighbor \\(v\\) of \\(u\\):
                <ul><li>If \\(v\\) is undiscovered: set \\(\\pi(v) = u\\), call <strong>DFS-Visit</strong>\\((v)\\).</li></ul>
            </li>
            <li>\\(t \\gets t + 1\\); set \\(f(u) = t\\). Mark \\(u\\) as finished.</li>
        </ol>
        <p>For each vertex \\(u \\in V\\): if \\(u\\) is undiscovered, call <strong>DFS-Visit</strong>\\((u)\\).</p>
    </div>
</div>

<h3>Discovery and Finish Times</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.2 (Parenthesis Theorem)</div>
    <div class="env-body">
        <p>For any two vertices \\(u\\) and \\(v\\) in a DFS, exactly one of the following holds:</p>
        <ol>
            <li>The intervals \\([d(u), f(u)]\\) and \\([d(v), f(v)]\\) are entirely disjoint (neither is an ancestor of the other in the DFS forest).</li>
            <li>\\([d(u), f(u)] \\subset [d(v), f(v)]\\) (\\(u\\) is a descendant of \\(v\\)).</li>
            <li>\\([d(v), f(v)] \\subset [d(u), f(u)]\\) (\\(v\\) is a descendant of \\(u\\)).</li>
        </ol>
    </div>
</div>

<p>The name comes from the analogy with properly nested parentheses: if we write "(" when discovering a vertex and ")" when finishing it, we get a valid parenthesization.</p>

<h3>Edge Classification</h3>

<p>DFS classifies edges into four types:</p>
<ul>
    <li><strong>Tree edges:</strong> Edges in the DFS forest (leading to undiscovered vertices).</li>
    <li><strong>Back edges:</strong> Edges from a vertex to an ancestor. A directed graph has a cycle if and only if DFS finds a back edge.</li>
    <li><strong>Forward edges:</strong> Edges from a vertex to a descendant (non-tree). Only in directed graphs.</li>
    <li><strong>Cross edges:</strong> All other edges (between vertices in different branches). Only in directed graphs.</li>
</ul>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.3 (Cycle Detection)</div>
    <div class="env-body">
        <p>A directed graph \\(G\\) is acyclic (a DAG) if and only if a DFS of \\(G\\) produces no back edges.</p>
    </div>
</div>

<h3>Applications of DFS</h3>

<p>DFS is a workhorse algorithm with many applications:</p>
<ul>
    <li><strong>Topological sorting</strong> of DAGs (Section 7 below)</li>
    <li><strong>Strongly connected components</strong> (Tarjan's algorithm or Kosaraju's algorithm)</li>
    <li><strong>Bridges and articulation points</strong> (finding critical edges/vertices whose removal disconnects the graph)</li>
    <li><strong>Cycle detection</strong> (back edge existence)</li>
</ul>

<div class="viz-placeholder" data-viz="viz-dfs"></div>
`,
            visualizations: [
                {
                    id: 'viz-dfs',
                    title: 'DFS: Deep Exploration with Timestamps',
                    description: 'Watch DFS explore a graph depth-first. The stack is shown below. Each vertex displays its discovery/finish times. Click "Step" to advance or "Play" for animation.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nodes = [
                            {id: 0, label: 'A', x: 80, y: 70},
                            {id: 1, label: 'B', x: 200, y: 50},
                            {id: 2, label: 'C', x: 160, y: 150},
                            {id: 3, label: 'D', x: 320, y: 70},
                            {id: 4, label: 'E', x: 280, y: 170},
                            {id: 5, label: 'F', x: 440, y: 110},
                            {id: 6, label: 'G', x: 400, y: 210},
                            {id: 7, label: 'H', x: 520, y: 60}
                        ];
                        var edges = [
                            [0,1],[0,2],[1,3],[2,4],[3,4],[3,5],[5,6],[5,7],[4,6]
                        ];
                        var adj = nodes.map(function() { return []; });
                        edges.forEach(function(e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });

                        var WHITE = 0, GRAY = 1, BLACK = 2;
                        var color, disc, fin, stack, time, steps, stepIdx;
                        var playing = false, playTimer = null;

                        function buildSteps() {
                            color = nodes.map(function() { return WHITE; });
                            disc = nodes.map(function() { return -1; });
                            fin = nodes.map(function() { return -1; });
                            time = 0;
                            steps = [];
                            var localStack = [];
                            function dfsVisit(u) {
                                time++;
                                disc[u] = time;
                                color[u] = GRAY;
                                localStack.push(u);
                                steps.push({
                                    type: 'discover', node: u,
                                    disc: disc.slice(), fin: fin.slice(),
                                    color: color.slice(), stack: localStack.slice()
                                });
                                var neighbors = adj[u].slice().sort(function(a, b) { return a - b; });
                                for (var i = 0; i < neighbors.length; i++) {
                                    var v = neighbors[i];
                                    if (color[v] === WHITE) {
                                        dfsVisit(v);
                                    }
                                }
                                time++;
                                fin[u] = time;
                                color[u] = BLACK;
                                localStack.pop();
                                steps.push({
                                    type: 'finish', node: u,
                                    disc: disc.slice(), fin: fin.slice(),
                                    color: color.slice(), stack: localStack.slice()
                                });
                            }
                            for (var i = 0; i < nodes.length; i++) {
                                if (color[i] === WHITE) dfsVisit(i);
                            }
                        }

                        function reset() {
                            buildSteps();
                            stepIdx = -1;
                            draw();
                        }

                        function advance() {
                            if (stepIdx >= steps.length - 1) return;
                            stepIdx++;
                            draw();
                        }

                        function togglePlay() {
                            if (playing) {
                                playing = false;
                                if (playTimer) clearInterval(playTimer);
                            } else {
                                playing = true;
                                playTimer = setInterval(function() {
                                    if (stepIdx >= steps.length - 1) {
                                        playing = false; clearInterval(playTimer); return;
                                    }
                                    advance();
                                }, 600);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Depth-First Search', viz.width / 2, 18, viz.colors.white, 16);

                            var curDisc = stepIdx >= 0 ? steps[stepIdx].disc : nodes.map(function() { return -1; });
                            var curFin = stepIdx >= 0 ? steps[stepIdx].fin : nodes.map(function() { return -1; });
                            var curColor = stepIdx >= 0 ? steps[stepIdx].color : nodes.map(function() { return WHITE; });
                            var curStack = stepIdx >= 0 ? steps[stepIdx].stack : [];
                            var curNode = stepIdx >= 0 ? steps[stepIdx].node : -1;

                            // Draw edges
                            edges.forEach(function(e) {
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(nodes[e[0]].x, nodes[e[0]].y);
                                ctx.lineTo(nodes[e[1]].x, nodes[e[1]].y);
                                ctx.stroke();
                            });

                            // Draw nodes
                            nodes.forEach(function(n, i) {
                                var r = 18;
                                var nc;
                                if (curColor[i] === BLACK) nc = viz.colors.green;
                                else if (curColor[i] === GRAY) nc = viz.colors.orange;
                                else nc = viz.colors.text;

                                if (i === curNode) {
                                    ctx.fillStyle = nc + '33';
                                    ctx.beginPath(); ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2); ctx.fill();
                                }
                                ctx.fillStyle = curColor[i] !== WHITE ? nc : '#1a1a40';
                                ctx.strokeStyle = nc; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();

                                ctx.fillStyle = curColor[i] !== WHITE ? '#0c0c20' : viz.colors.text;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);

                                // Timestamps
                                var ts = '';
                                if (curDisc[i] > 0) {
                                    ts = curDisc[i] + '/';
                                    ts += curFin[i] > 0 ? curFin[i] : '?';
                                }
                                if (ts) {
                                    ctx.fillStyle = nc;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillText(ts, n.x, n.y + r + 14);
                                }
                            });

                            // Stack display
                            var stackY = 310;
                            viz.screenText('Stack:', 40, stackY, viz.colors.text, 13, 'left');
                            if (curStack.length === 0) {
                                viz.screenText(stepIdx >= steps.length - 1 ? '(empty, DFS complete)' : '(empty)', 100, stackY, viz.colors.text, 12, 'left');
                            } else {
                                curStack.forEach(function(id, idx) {
                                    var sx = 100 + idx * 40;
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.fillRect(sx - 14, stackY - 12, 28, 24);
                                    ctx.fillStyle = '#0c0c20';
                                    ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(nodes[id].label, sx, stackY);
                                });
                            }

                            // Legend
                            var legY = 355;
                            ctx.fillStyle = viz.colors.text; ctx.fillRect(60, legY - 6, 12, 12);
                            viz.screenText('Undiscovered', 76, legY, viz.colors.text, 11, 'left');
                            ctx.fillStyle = viz.colors.orange; ctx.fillRect(200, legY - 6, 12, 12);
                            viz.screenText('Discovered (gray)', 216, legY, viz.colors.orange, 11, 'left');
                            ctx.fillStyle = viz.colors.green; ctx.fillRect(370, legY - 6, 12, 12);
                            viz.screenText('Finished (black)', 386, legY, viz.colors.green, 11, 'left');

                            // Step info
                            if (stepIdx >= 0 && stepIdx < steps.length) {
                                var s = steps[stepIdx];
                                var msg = s.type === 'discover'
                                    ? 'Discovered ' + nodes[s.node].label + ' (time ' + s.disc[s.node] + ')'
                                    : 'Finished ' + nodes[s.node].label + ' (time ' + s.fin[s.node] + ')';
                                viz.screenText(msg, viz.width / 2, 390, viz.colors.white, 12);
                            }
                            viz.screenText('Timestamps: discovery/finish', viz.width / 2, 410, viz.colors.text, 10);
                        }

                        VizEngine.createButton(controls, 'Step', advance);
                        VizEngine.createButton(controls, 'Play/Pause', togglePlay);
                        VizEngine.createButton(controls, 'Reset', function() {
                            if (playing) togglePlay();
                            reset();
                        });
                        reset();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Run DFS on the directed graph with vertices \\(\\{1,2,3,4,5,6\\}\\) and edges \\(1 \\to 2, 1 \\to 4, 2 \\to 5, 3 \\to 5, 3 \\to 6, 4 \\to 2, 5 \\to 4, 6 \\to 6\\)\\). List discovery and finish times. Classify each edge.',
                    hint: 'Start DFS-Visit from vertex 1 (since it is undiscovered). Process neighbors in numerical order. After finishing the component of 1, start DFS-Visit from the next undiscovered vertex.',
                    solution: 'Starting from 1: \\(d(1)=1\\), visit 2: \\(d(2)=2\\), visit 5: \\(d(5)=3\\), visit 4: \\(d(4)=4\\). From 4, neighbor 2 is gray (back edge \\(4 \\to 2\\)). \\(f(4)=5, f(5)=6, f(2)=7\\). From 1, neighbor 4 is black (forward edge). \\(f(1)=8\\). DFS-Visit(3): \\(d(3)=9\\), neighbor 5 is black (cross edge). Visit 6: \\(d(6)=10\\), edge \\(6 \\to 6\\) is back edge. \\(f(6)=11, f(3)=12\\). Edge classification: tree: \\(1 \\to 2, 2 \\to 5, 5 \\to 4, 3 \\to 6\\); back: \\(4 \\to 2, 6 \\to 6\\); forward: \\(1 \\to 4\\); cross: \\(3 \\to 5\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Dijkstra's Algorithm
        // ================================================================
        {
            id: 'sec-dijkstra',
            title: "Dijkstra's Algorithm",
            content: `
<h2>Dijkstra's Algorithm</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Intuition</div>
    <div class="env-body">
        <p>BFS finds shortest paths when all edges have weight 1. But what if edges have different costs? Dijkstra's algorithm generalizes BFS by always processing the <em>closest unvisited vertex</em> next, using a priority queue instead of a plain queue. It is a greedy algorithm: the vertex with the smallest tentative distance is guaranteed to have its final shortest-path distance.</p>
    </div>
</div>

<h3>The Algorithm</h3>

<div class="env-block definition">
    <div class="env-title">Algorithm 12.3 (Dijkstra's Algorithm)</div>
    <div class="env-body">
        <p><strong>Input:</strong> Weighted graph \\(G = (V, E, w)\\) with non-negative weights \\(w(e) \\geq 0\\), source vertex \\(s\\).</p>
        <p><strong>Output:</strong> Shortest-path distances \\(d(v)\\) from \\(s\\) to all vertices.</p>
        <ol>
            <li>Set \\(d(s) = 0\\), \\(d(v) = \\infty\\) for all \\(v \\neq s\\). Initialize priority queue \\(Q\\) with all vertices.</li>
            <li>While \\(Q\\) is not empty:
                <ol style="list-style-type: lower-alpha;">
                    <li>Extract vertex \\(u\\) with minimum \\(d(u)\\) from \\(Q\\).</li>
                    <li>For each neighbor \\(v\\) of \\(u\\) with edge weight \\(w(u,v)\\):
                        <ul>
                            <li>If \\(d(u) + w(u,v) < d(v)\\): set \\(d(v) = d(u) + w(u,v)\\) and \\(\\pi(v) = u\\). (Relax the edge.)</li>
                        </ul>
                    </li>
                </ol>
            </li>
        </ol>
    </div>
</div>

<h3>Why Non-Negative Weights?</h3>

<p>Dijkstra's algorithm is <strong>greedy</strong>: once a vertex is extracted from the priority queue, its distance is final. This works because all edges have non-negative weight, so no future path through an unvisited vertex could be shorter. With negative edges, this invariant breaks, and you need the Bellman-Ford algorithm instead.</p>

<h3>Correctness and Complexity</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.4 (Dijkstra Correctness)</div>
    <div class="env-body">
        <p>For a graph with non-negative edge weights, Dijkstra's algorithm correctly computes the shortest-path distance from \\(s\\) to every vertex \\(v\\).</p>
    </div>
</div>

<p><strong>Proof sketch.</strong> Induction on the order in which vertices are extracted. When \\(u\\) is extracted with \\(d(u)\\), suppose for contradiction that \\(d(u) > \\delta(s, u)\\). Then the true shortest path to \\(u\\) passes through some vertex \\(y\\) still in \\(Q\\). But then \\(d(y) \\leq \\delta(s,y) \\leq \\delta(s,u) < d(u)\\), contradicting \\(u\\) being the minimum.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.5 (Dijkstra Complexity)</div>
    <div class="env-body">
        <p>With a binary min-heap, Dijkstra runs in \\(O((n + m) \\log n)\\). With a Fibonacci heap, \\(O(m + n \\log n)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Consider a graph with vertices \\(A, B, C, D\\) and weighted edges \\(AB(1), AC(4), BC(2), BD(5), CD(1)\\). Starting from \\(A\\):</p>
        <ul>
            <li>Extract \\(A\\) (d=0). Relax: \\(d(B) = 1, d(C) = 4\\).</li>
            <li>Extract \\(B\\) (d=1). Relax: \\(d(C) = \\min(4, 1+2) = 3, d(D) = 6\\).</li>
            <li>Extract \\(C\\) (d=3). Relax: \\(d(D) = \\min(6, 3+1) = 4\\).</li>
            <li>Extract \\(D\\) (d=4). Done.</li>
        </ul>
        <p>Shortest path \\(A \\to D\\): \\(A \\to B \\to C \\to D\\) with cost 4.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-dijkstra"></div>
`,
            visualizations: [
                {
                    id: 'viz-dijkstra',
                    title: "Dijkstra's Algorithm: Shortest Paths in Weighted Graphs",
                    description: 'Watch Dijkstra greedily extract the closest unfinished vertex and relax its edges. Distance labels update in real time. The priority queue is shown below.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nodes = [
                            {id: 0, label: 'A', x: 80,  y: 100},
                            {id: 1, label: 'B', x: 200, y: 50},
                            {id: 2, label: 'C', x: 200, y: 180},
                            {id: 3, label: 'D', x: 360, y: 50},
                            {id: 4, label: 'E', x: 360, y: 180},
                            {id: 5, label: 'F', x: 500, y: 100}
                        ];
                        var wedges = [
                            [0,1,2],[0,2,5],[1,2,1],[1,3,4],[2,4,3],[3,4,1],[3,5,6],[4,5,2]
                        ];
                        var adj = nodes.map(function() { return []; });
                        wedges.forEach(function(e) {
                            adj[e[0]].push({to: e[1], w: e[2]});
                            adj[e[1]].push({to: e[0], w: e[2]});
                        });

                        var dist, finalized, prev, pq, extractOrder, stepLog;
                        var playing = false, playTimer = null;

                        function reset() {
                            dist = nodes.map(function() { return Infinity; });
                            finalized = nodes.map(function() { return false; });
                            prev = nodes.map(function() { return -1; });
                            dist[0] = 0;
                            pq = nodes.map(function(_, i) { return i; });
                            extractOrder = [];
                            stepLog = 'Start: d(A)=0, all others infinity';
                            draw();
                        }

                        function step() {
                            if (pq.length === 0) return;
                            // Find min in pq
                            var minIdx = 0;
                            for (var i = 1; i < pq.length; i++) {
                                if (dist[pq[i]] < dist[pq[minIdx]]) minIdx = i;
                            }
                            var u = pq[minIdx];
                            pq.splice(minIdx, 1);
                            finalized[u] = true;
                            extractOrder.push(u);

                            var relaxed = [];
                            adj[u].forEach(function(edge) {
                                var v = edge.to, w = edge.w;
                                if (!finalized[v] && dist[u] + w < dist[v]) {
                                    dist[v] = dist[u] + w;
                                    prev[v] = u;
                                    relaxed.push(nodes[v].label + '=' + dist[v]);
                                }
                            });

                            stepLog = 'Extract ' + nodes[u].label + ' (d=' + dist[u] + ')';
                            if (relaxed.length > 0) stepLog += '. Relax: ' + relaxed.join(', ');
                            draw();
                        }

                        function togglePlay() {
                            if (playing) {
                                playing = false;
                                if (playTimer) clearInterval(playTimer);
                            } else {
                                playing = true;
                                playTimer = setInterval(function() {
                                    if (pq.length === 0) { playing = false; clearInterval(playTimer); return; }
                                    step();
                                }, 900);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText("Dijkstra's Algorithm", viz.width / 2, 18, viz.colors.white, 16);

                            // Draw edges with weights
                            wedges.forEach(function(e) {
                                var n1 = nodes[e[0]], n2 = nodes[e[1]];
                                var isTreeEdge = (prev[e[1]] === e[0] && finalized[e[1]]) || (prev[e[0]] === e[1] && finalized[e[0]]);
                                ctx.strokeStyle = isTreeEdge ? viz.colors.green : viz.colors.grid;
                                ctx.lineWidth = isTreeEdge ? 3 : 2;
                                ctx.beginPath(); ctx.moveTo(n1.x, n1.y); ctx.lineTo(n2.x, n2.y); ctx.stroke();
                                // Weight label
                                var mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
                                var dx = n2.x - n1.x, dy = n2.y - n1.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var offx = -dy / len * 12, offy = dx / len * 12;
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(e[2], mx + offx, my + offy);
                            });

                            // Draw nodes
                            nodes.forEach(function(n, i) {
                                var r = 20;
                                var nc = finalized[i] ? viz.colors.green : (dist[i] < Infinity ? viz.colors.blue : viz.colors.text);
                                ctx.fillStyle = finalized[i] ? nc : '#1a1a40';
                                ctx.strokeStyle = nc; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();

                                ctx.fillStyle = finalized[i] ? '#0c0c20' : (dist[i] < Infinity ? viz.colors.blue : viz.colors.text);
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);

                                // Distance label
                                var dLabel = dist[i] === Infinity ? '\u221E' : dist[i].toString();
                                ctx.fillStyle = nc;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('d=' + dLabel, n.x, n.y + r + 14);
                            });

                            // Priority queue
                            var pqY = 280;
                            viz.screenText('Priority Queue:', 40, pqY, viz.colors.text, 13, 'left');
                            var sorted = pq.slice().sort(function(a, b) { return dist[a] - dist[b]; });
                            sorted.forEach(function(id, idx) {
                                var px = 170 + idx * 60;
                                var dVal = dist[id] === Infinity ? '\u221E' : dist[id];
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillRect(px - 22, pqY - 12, 44, 24);
                                ctx.fillStyle = '#0c0c20';
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(nodes[id].label + ':' + dVal, px, pqY);
                            });

                            // Extraction order
                            var eoY = 320;
                            viz.screenText('Finalized:', 40, eoY, viz.colors.text, 13, 'left');
                            extractOrder.forEach(function(id, idx) {
                                var ex = 140 + idx * 50;
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(nodes[id].label + '(' + dist[id] + ')', ex, eoY);
                            });

                            // Step log
                            if (stepLog) {
                                viz.screenText(stepLog, viz.width / 2, 370, viz.colors.white, 12);
                            }

                            // Shortest path tree note
                            if (pq.length === 0) {
                                viz.screenText('All shortest paths found. Green edges form the shortest-path tree.', viz.width / 2, 400, viz.colors.green, 11);
                            }
                        }

                        VizEngine.createButton(controls, 'Step', step);
                        VizEngine.createButton(controls, 'Play/Pause', togglePlay);
                        VizEngine.createButton(controls, 'Reset', function() {
                            if (playing) togglePlay();
                            reset();
                        });
                        reset();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Run Dijkstra's algorithm from vertex \\(s\\) on the graph with vertices \\(\\{s, a, b, c, t\\}\\) and weighted edges \\(sa(10), sb(5), ab(3), ba(2), at(1), bc(2), bt(9), ca(1), ct(4)\\). List the extraction order and final distances.",
                    hint: 'At each step, extract the vertex with the smallest tentative distance from the priority queue. After extracting, relax all outgoing edges.',
                    solution: 'Extract \\(s\\) (d=0): relax \\(a=10, b=5\\). Extract \\(b\\) (d=5): relax \\(a=\\min(10, 5+3)=8, c=7, t=14\\). Extract \\(c\\) (d=7): relax \\(a=\\min(8, 7+1)=8, t=\\min(14, 7+4)=11\\). Extract \\(a\\) (d=8): relax \\(t=\\min(11, 8+1)=9\\). Extract \\(t\\) (d=9). Final distances: \\(d(s)=0, d(b)=5, d(c)=7, d(a)=8, d(t)=9\\). Path to \\(t\\): \\(s \\to b \\to a \\to t\\) (cost 9), not the seemingly direct \\(s \\to a \\to t\\) (cost 11).'
                },
                {
                    question: "Give an example showing that Dijkstra's algorithm fails with negative edge weights.",
                    hint: 'Construct a small graph (3 vertices suffice) where a negative edge lets a detour beat the greedy choice.',
                    solution: 'Consider \\(V = \\{s, a, b\\}\\) with edges \\(sa(1), sb(3), ab(-4)\\). Dijkstra extracts \\(s\\) (d=0), sets \\(d(a)=1, d(b)=3\\). Then extracts \\(a\\) (d=1) and relaxes \\(b\\): \\(d(b)=\\min(3, 1-4)=-3\\). But \\(a\\) is already finalized! The issue: after extracting \\(b\\) (d=-3), we cannot go back and update paths through \\(b\\). True shortest: \\(s \\to a \\to b\\) with cost \\(-3\\), which Dijkstra happens to find here. But with one more vertex \\(c\\) and edge \\(bc(1)\\), if \\(c\\) was finalized through \\(s \\to b \\to c\\) (cost 4) before the update, it would miss \\(s \\to a \\to b \\to c\\) (cost \\(-2\\)).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Matchings
        // ================================================================
        {
            id: 'sec-matching',
            title: 'Matchings',
            content: `
<h2>Matchings in Bipartite Graphs</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Intuition</div>
    <div class="env-body">
        <p>A company has \\(n\\) jobs and \\(m\\) applicants. Each applicant is qualified for some subset of jobs. How many jobs can be filled simultaneously, with each job assigned to at most one applicant and each applicant assigned to at most one job? This is the maximum bipartite matching problem.</p>
    </div>
</div>

<h3>Definitions</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Matching)</div>
    <div class="env-body">
        <p>A <strong>matching</strong> \\(M\\) in a graph \\(G\\) is a set of edges with no shared endpoints. A vertex is <strong>matched</strong> if it is an endpoint of some edge in \\(M\\), and <strong>unmatched</strong> (or <strong>free</strong>) otherwise.</p>
        <p>A matching is <strong>maximum</strong> if no matching in \\(G\\) has more edges. A <strong>perfect matching</strong> matches every vertex.</p>
    </div>
</div>

<h3>Augmenting Paths</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Augmenting Path)</div>
    <div class="env-body">
        <p>Given a matching \\(M\\), an <strong>augmenting path</strong> is a path that alternates between edges not in \\(M\\) and edges in \\(M\\), and whose first and last vertices are both unmatched.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.6 (Berge's Theorem, 1957)</div>
    <div class="env-body">
        <p>A matching \\(M\\) is maximum if and only if there is no augmenting path with respect to \\(M\\).</p>
    </div>
</div>

<p>This theorem gives an algorithmic strategy: keep finding augmenting paths and "flipping" them (swapping matched and unmatched edges along the path) until none exist. Each flip increases \\(|M|\\) by exactly 1.</p>

<h3>Hall's Marriage Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.7 (Hall's Theorem, 1935)</div>
    <div class="env-body">
        <p>A bipartite graph \\(G = (X \\cup Y, E)\\) has a matching that saturates every vertex in \\(X\\) if and only if for every subset \\(S \\subseteq X\\):</p>
        \\[|N(S)| \\geq |S|\\]
        <p>where \\(N(S)\\) is the set of vertices in \\(Y\\) adjacent to at least one vertex in \\(S\\).</p>
    </div>
</div>

<p>In words: the "marriage condition" says that every group of applicants (however chosen) is collectively qualified for at least as many jobs as there are applicants in the group.</p>

<h3>Konig's Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.8 (Konig's Theorem, 1931)</div>
    <div class="env-body">
        <p>In any bipartite graph, the size of a maximum matching equals the size of a minimum vertex cover.</p>
    </div>
</div>

<p>Recall that a <strong>vertex cover</strong> is a set of vertices \\(C\\) such that every edge has at least one endpoint in \\(C\\). Konig's theorem is a deep min-max duality result; it does not hold for general (non-bipartite) graphs.</p>

<div class="viz-placeholder" data-viz="viz-bipartite-matching"></div>
`,
            visualizations: [
                {
                    id: 'viz-bipartite-matching',
                    title: 'Bipartite Matching: Finding Augmenting Paths',
                    description: 'Find a maximum matching in a bipartite graph by repeatedly finding and flipping augmenting paths. Matched edges are highlighted. Click "Find Augmenting Path" to see the next one.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Bipartite graph: left = jobs (0-4), right = applicants (5-9)
                        var left = [
                            {id: 0, label: 'J1', x: 120, y: 60},
                            {id: 1, label: 'J2', x: 120, y: 130},
                            {id: 2, label: 'J3', x: 120, y: 200},
                            {id: 3, label: 'J4', x: 120, y: 270}
                        ];
                        var right = [
                            {id: 4, label: 'A1', x: 440, y: 60},
                            {id: 5, label: 'A2', x: 440, y: 130},
                            {id: 6, label: 'A3', x: 440, y: 200},
                            {id: 7, label: 'A4', x: 440, y: 270}
                        ];
                        var allNodes = left.concat(right);
                        var biEdges = [
                            [0,4],[0,5],[1,5],[1,6],[2,4],[2,6],[2,7],[3,6],[3,7]
                        ];

                        var matching = {}; // edge index -> true
                        var matchOf = {}; // node id -> matched partner
                        var augPath = null;
                        var augPathEdges = null;
                        var statusMsg = 'Click "Find Augmenting Path" to start.';

                        function isMatched(u, v) {
                            for (var i = 0; i < biEdges.length; i++) {
                                if (matching[i] && ((biEdges[i][0] === u && biEdges[i][1] === v) || (biEdges[i][0] === v && biEdges[i][1] === u))) return true;
                            }
                            return false;
                        }

                        function findAugPath() {
                            // BFS from free left nodes
                            var freeLeft = [];
                            left.forEach(function(n) { if (!matchOf[n.id] && matchOf[n.id] !== 0) freeLeft.push(n.id); });
                            if (freeLeft.length === 0) return null;

                            var parent = {};
                            var visited = {};
                            var queue = [];
                            freeLeft.forEach(function(u) { queue.push(u); visited[u] = true; parent[u] = -1; });

                            while (queue.length > 0) {
                                var u = queue.shift();
                                // u is on left side, look at unmatched edges to right
                                var isLeft = u < 4;
                                if (isLeft) {
                                    biEdges.forEach(function(e, idx) {
                                        var v = -1;
                                        if (e[0] === u) v = e[1];
                                        else if (e[1] === u) v = e[0];
                                        if (v >= 0 && !visited[v] && !matching[idx]) {
                                            visited[v] = true;
                                            parent[v] = u;
                                            // If v is free on right side, found augmenting path
                                            if (!matchOf[v] && matchOf[v] !== 0) {
                                                // Reconstruct path
                                                var path = [];
                                                var cur = v;
                                                while (cur !== -1) {
                                                    path.unshift(cur);
                                                    cur = parent[cur];
                                                }
                                                return path;
                                            }
                                            queue.push(v);
                                        }
                                    });
                                } else {
                                    // u is on right side, follow matched edge back to left
                                    biEdges.forEach(function(e, idx) {
                                        var v = -1;
                                        if (e[0] === u) v = e[1];
                                        else if (e[1] === u) v = e[0];
                                        if (v >= 0 && !visited[v] && matching[idx]) {
                                            visited[v] = true;
                                            parent[v] = u;
                                            queue.push(v);
                                        }
                                    });
                                }
                            }
                            return null;
                        }

                        function doFindAug() {
                            augPath = findAugPath();
                            if (!augPath) {
                                var mSize = Object.keys(matching).filter(function(k) { return matching[k]; }).length;
                                statusMsg = 'No augmenting path found. Maximum matching has ' + mSize + ' edges.';
                                augPathEdges = null;
                            } else {
                                statusMsg = 'Augmenting path: ' + augPath.map(function(id) { return allNodes[id].label; }).join(' \u2192 ');
                                // Find edge indices along path
                                augPathEdges = [];
                                for (var i = 0; i < augPath.length - 1; i++) {
                                    var u = augPath[i], v = augPath[i + 1];
                                    for (var j = 0; j < biEdges.length; j++) {
                                        if ((biEdges[j][0] === u && biEdges[j][1] === v) || (biEdges[j][0] === v && biEdges[j][1] === u)) {
                                            augPathEdges.push(j);
                                            break;
                                        }
                                    }
                                }
                            }
                            draw();
                        }

                        function doFlip() {
                            if (!augPathEdges) return;
                            // Flip matched/unmatched along augmenting path
                            augPathEdges.forEach(function(idx) {
                                matching[idx] = !matching[idx];
                            });
                            // Rebuild matchOf
                            matchOf = {};
                            for (var i = 0; i < biEdges.length; i++) {
                                if (matching[i]) {
                                    matchOf[biEdges[i][0]] = biEdges[i][1];
                                    matchOf[biEdges[i][1]] = biEdges[i][0];
                                }
                            }
                            var mSize = Object.keys(matching).filter(function(k) { return matching[k]; }).length;
                            statusMsg = 'Flipped augmenting path. Matching size: ' + mSize;
                            augPath = null;
                            augPathEdges = null;
                            draw();
                        }

                        function doReset() {
                            matching = {};
                            matchOf = {};
                            augPath = null;
                            augPathEdges = null;
                            statusMsg = 'Click "Find Augmenting Path" to start.';
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Bipartite Matching', viz.width / 2, 18, viz.colors.white, 16);

                            // Labels
                            viz.screenText('Jobs', 120, 35, viz.colors.blue, 13);
                            viz.screenText('Applicants', 440, 35, viz.colors.teal, 13);

                            // Draw edges
                            biEdges.forEach(function(e, idx) {
                                var n1 = allNodes[e[0]], n2 = allNodes[e[1]];
                                var isAugEdge = augPathEdges && augPathEdges.indexOf(idx) >= 0;
                                if (matching[idx]) {
                                    ctx.strokeStyle = isAugEdge ? viz.colors.red : viz.colors.green;
                                    ctx.lineWidth = isAugEdge ? 4 : 3;
                                } else {
                                    ctx.strokeStyle = isAugEdge ? viz.colors.yellow : viz.colors.grid;
                                    ctx.lineWidth = isAugEdge ? 3 : 1.5;
                                }
                                ctx.beginPath(); ctx.moveTo(n1.x, n1.y); ctx.lineTo(n2.x, n2.y); ctx.stroke();
                            });

                            // Draw nodes
                            allNodes.forEach(function(n) {
                                var r = 18;
                                var isLeft = n.id < 4;
                                var isMat = matchOf[n.id] !== undefined;
                                var isOnAug = augPath && augPath.indexOf(n.id) >= 0;
                                var nc = isLeft ? viz.colors.blue : viz.colors.teal;
                                if (isOnAug) nc = viz.colors.yellow;

                                ctx.fillStyle = isMat ? nc : '#1a1a40';
                                ctx.strokeStyle = nc; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();

                                ctx.fillStyle = isMat ? '#0c0c20' : nc;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);
                            });

                            // Status
                            var mSize = Object.keys(matching).filter(function(k) { return matching[k]; }).length;
                            viz.screenText('Matching size: ' + mSize, viz.width / 2, 320, viz.colors.white, 14);
                            viz.screenText(statusMsg, viz.width / 2, 350, viz.colors.text, 12);

                            // Legend
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 3;
                            ctx.beginPath(); ctx.moveTo(100, 380); ctx.lineTo(130, 380); ctx.stroke();
                            viz.screenText('Matched', 140, 380, viz.colors.green, 11, 'left');

                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 3;
                            ctx.beginPath(); ctx.moveTo(240, 380); ctx.lineTo(270, 380); ctx.stroke();
                            viz.screenText('Augmenting (unmatched)', 280, 380, viz.colors.yellow, 11, 'left');
                        }

                        VizEngine.createButton(controls, 'Find Augmenting Path', doFindAug);
                        VizEngine.createButton(controls, 'Flip Path', doFlip);
                        VizEngine.createButton(controls, 'Reset', doReset);
                        doReset();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Consider a bipartite graph with \\(X = \\{x_1, x_2, x_3\\}\\), \\(Y = \\{y_1, y_2, y_3\\}\\), and edges \\(x_1 y_1, x_1 y_2, x_2 y_1, x_3 y_3\\). Find a maximum matching. Does a perfect matching exist? Verify Hall's condition.",
                    hint: "Try matching greedily: \\(x_1 y_1\\). Then \\(x_2\\) can only go to \\(y_1\\) (conflict) or nothing. Check \\(S = \\{x_1, x_2\\}\\): does \\(|N(S)| \\geq |S|\\)?",
                    solution: "Maximum matching: \\(\\{x_1 y_2, x_2 y_1, x_3 y_3\\}\\), size 3. This is a perfect matching. Verify Hall's: for \\(S = \\{x_1\\}\\), \\(N(S) = \\{y_1, y_2\\}\\), \\(2 \\geq 1\\). For \\(S = \\{x_2\\}\\), \\(N(S) = \\{y_1\\}\\), \\(1 \\geq 1\\). For \\(S = \\{x_1, x_2\\}\\), \\(N(S) = \\{y_1, y_2\\}\\), \\(2 \\geq 2\\). All subsets satisfy Hall's condition, confirming a perfect matching exists."
                },
                {
                    question: "Prove that if a bipartite graph \\(G = (X \\cup Y, E)\\) is \\(k\\)-regular (every vertex has degree exactly \\(k \\geq 1\\)), then \\(G\\) has a perfect matching.",
                    hint: "Use Hall's theorem. For any \\(S \\subseteq X\\), count the edges from \\(S\\) to \\(N(S)\\) and use the degree constraint.",
                    solution: "For any \\(S \\subseteq X\\), the number of edges from \\(S\\) is \\(k|S|\\) (each vertex has degree \\(k\\)). All these edges go to \\(N(S)\\). Each vertex in \\(N(S)\\) has degree \\(k\\), so the edges into \\(N(S)\\) total at most \\(k|N(S)|\\). Thus \\(k|S| \\leq k|N(S)|\\), giving \\(|N(S)| \\geq |S|\\). By Hall's theorem, \\(G\\) has a matching saturating \\(X\\). By symmetry (or noting \\(k|X| = |E| = k|Y|\\) so \\(|X| = |Y|\\)), this is a perfect matching."
                }
            ]
        },

        // ================================================================
        // SECTION 6: Network Flow
        // ================================================================
        {
            id: 'sec-network',
            title: 'Network Flow',
            content: `
<h2>Network Flow</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Intuition</div>
    <div class="env-body">
        <p>Imagine a network of pipes carrying water from a source \\(s\\) to a sink \\(t\\). Each pipe has a capacity (maximum flow rate). How much water can you push through the network? The max-flow min-cut theorem says: the maximum flow equals the capacity of the smallest "bottleneck" (minimum cut) separating \\(s\\) from \\(t\\).</p>
    </div>
</div>

<h3>Definitions</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Network Flow)</div>
    <div class="env-body">
        <p>A <strong>flow network</strong> is a directed graph \\(G = (V, E)\\) with:</p>
        <ul>
            <li>A <strong>capacity</strong> function \\(c: E \\to \\mathbb{R}_{\\geq 0}\\).</li>
            <li>A distinguished <strong>source</strong> \\(s\\) and <strong>sink</strong> \\(t\\).</li>
        </ul>
        <p>A <strong>flow</strong> is a function \\(f: E \\to \\mathbb{R}_{\\geq 0}\\) satisfying:</p>
        <ol>
            <li><strong>Capacity constraint:</strong> \\(0 \\leq f(e) \\leq c(e)\\) for every edge \\(e\\).</li>
            <li><strong>Conservation:</strong> For every vertex \\(v \\neq s, t\\): \\(\\sum_{(u,v) \\in E} f(u,v) = \\sum_{(v,w) \\in E} f(v,w)\\).</li>
        </ol>
        <p>The <strong>value</strong> of a flow is the net flow out of \\(s\\): \\(|f| = \\sum_{(s,v) \\in E} f(s,v)\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Cut)</div>
    <div class="env-body">
        <p>An \\((s,t)\\)-<strong>cut</strong> is a partition \\((S, T)\\) of \\(V\\) with \\(s \\in S, t \\in T\\). Its <strong>capacity</strong> is \\(c(S,T) = \\sum_{u \\in S, v \\in T} c(u,v)\\).</p>
    </div>
</div>

<h3>Max-Flow Min-Cut Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.9 (Ford-Fulkerson, 1956)</div>
    <div class="env-body">
        <p>In any flow network, the maximum value of a flow equals the minimum capacity of an \\((s,t)\\)-cut:</p>
        \\[\\max_f |f| = \\min_{(S,T)} c(S,T).\\]
    </div>
</div>

<h3>The Ford-Fulkerson Method</h3>

<p>The Ford-Fulkerson method repeatedly finds <strong>augmenting paths</strong> in the <strong>residual graph</strong>:</p>

<div class="env-block definition">
    <div class="env-title">Definition (Residual Graph)</div>
    <div class="env-body">
        <p>Given a flow \\(f\\) in network \\(G\\), the <strong>residual graph</strong> \\(G_f\\) has:</p>
        <ul>
            <li>For each edge \\((u,v)\\) with \\(f(u,v) < c(u,v)\\): a <strong>forward edge</strong> \\((u,v)\\) with residual capacity \\(c(u,v) - f(u,v)\\).</li>
            <li>For each edge \\((u,v)\\) with \\(f(u,v) > 0\\): a <strong>backward edge</strong> \\((v,u)\\) with residual capacity \\(f(u,v)\\).</li>
        </ul>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Algorithm 12.4 (Ford-Fulkerson)</div>
    <div class="env-body">
        <ol>
            <li>Start with \\(f(e) = 0\\) for all edges.</li>
            <li>While there exists an \\(s\\)-\\(t\\) path \\(P\\) in the residual graph \\(G_f\\):
                <ol style="list-style-type: lower-alpha;">
                    <li>Let \\(\\Delta = \\min_{e \\in P} \\text{residual capacity of } e\\).</li>
                    <li>Augment: increase flow by \\(\\Delta\\) along \\(P\\).</li>
                </ol>
            </li>
        </ol>
    </div>
</div>

<p>When augmenting paths are found by BFS (shortest path in residual graph), we get the <strong>Edmonds-Karp algorithm</strong>, which runs in \\(O(nm^2)\\) time, or equivalently \\(O(VE^2)\\).</p>

<div class="env-block remark">
    <div class="env-title">Flow and Matching</div>
    <div class="env-body">
        <p>Maximum bipartite matching reduces to max-flow: add a super-source connected to all left vertices and a super-sink connected to all right vertices, with all capacities 1. A maximum integer flow corresponds to a maximum matching. This connects Sections 5 and 6.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-max-flow"></div>
`,
            visualizations: [
                {
                    id: 'viz-max-flow',
                    title: 'Network Flow: Ford-Fulkerson in Action',
                    description: 'Watch the Ford-Fulkerson method find augmenting paths in the residual graph and increase flow. Edge labels show flow/capacity.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Flow network: directed edges with capacities
                        var nodes = [
                            {id: 0, label: 's', x: 60,  y: 180},
                            {id: 1, label: 'a', x: 200, y: 80},
                            {id: 2, label: 'b', x: 200, y: 280},
                            {id: 3, label: 'c', x: 380, y: 80},
                            {id: 4, label: 'd', x: 380, y: 280},
                            {id: 5, label: 't', x: 510, y: 180}
                        ];
                        // [from, to, capacity]
                        var netEdges = [
                            [0,1,10],[0,2,8],[1,2,5],[1,3,7],[2,4,10],[3,4,3],[3,5,10],[4,5,12]
                        ];

                        var flow;
                        var augPath = null;
                        var totalFlow = 0;
                        var statusMsg = '';
                        var augHistory = [];

                        function reset() {
                            flow = netEdges.map(function() { return 0; });
                            augPath = null;
                            totalFlow = 0;
                            statusMsg = 'Click "Find Augmenting Path" to begin.';
                            augHistory = [];
                            draw();
                        }

                        // Build residual graph and find s-t path via BFS (Edmonds-Karp)
                        function findAugPathBFS() {
                            var n = nodes.length;
                            var parent = new Array(n).fill(-1);
                            var parentEdge = new Array(n).fill(-1);
                            var parentDir = new Array(n).fill(0); // 1=forward, -1=backward
                            var visited = new Array(n).fill(false);
                            var queue = [0];
                            visited[0] = true;

                            while (queue.length > 0) {
                                var u = queue.shift();
                                for (var i = 0; i < netEdges.length; i++) {
                                    var e = netEdges[i];
                                    // Forward edge
                                    if (e[0] === u && !visited[e[1]] && flow[i] < e[2]) {
                                        visited[e[1]] = true;
                                        parent[e[1]] = u;
                                        parentEdge[e[1]] = i;
                                        parentDir[e[1]] = 1;
                                        if (e[1] === 5) break;
                                        queue.push(e[1]);
                                    }
                                    // Backward edge
                                    if (e[1] === u && !visited[e[0]] && flow[i] > 0) {
                                        visited[e[0]] = true;
                                        parent[e[0]] = u;
                                        parentEdge[e[0]] = i;
                                        parentDir[e[0]] = -1;
                                        if (e[0] === 5) break;
                                        queue.push(e[0]);
                                    }
                                }
                                if (visited[5]) break;
                            }

                            if (!visited[5]) return null;
                            // Trace path
                            var path = [];
                            var pathEdges = [];
                            var pathDirs = [];
                            var v = 5;
                            while (v !== 0) {
                                path.unshift(v);
                                pathEdges.unshift(parentEdge[v]);
                                pathDirs.unshift(parentDir[v]);
                                v = parent[v];
                            }
                            path.unshift(0);
                            // Find bottleneck
                            var bottleneck = Infinity;
                            for (var j = 0; j < pathEdges.length; j++) {
                                var ei = pathEdges[j];
                                var residual = pathDirs[j] === 1 ? (netEdges[ei][2] - flow[ei]) : flow[ei];
                                bottleneck = Math.min(bottleneck, residual);
                            }
                            return {path: path, edges: pathEdges, dirs: pathDirs, bottleneck: bottleneck};
                        }

                        function doFindAug() {
                            var result = findAugPathBFS();
                            if (!result) {
                                augPath = null;
                                statusMsg = 'No augmenting path. Max flow = ' + totalFlow;
                            } else {
                                augPath = result;
                                statusMsg = 'Path: ' + result.path.map(function(id) { return nodes[id].label; }).join('\u2192') + ', bottleneck = ' + result.bottleneck;
                            }
                            draw();
                        }

                        function doAugment() {
                            if (!augPath) return;
                            var bn = augPath.bottleneck;
                            for (var i = 0; i < augPath.edges.length; i++) {
                                var ei = augPath.edges[i];
                                if (augPath.dirs[i] === 1) {
                                    flow[ei] += bn;
                                } else {
                                    flow[ei] -= bn;
                                }
                            }
                            totalFlow += bn;
                            augHistory.push(augPath.path.map(function(id) { return nodes[id].label; }).join('\u2192') + ' (+' + bn + ')');
                            statusMsg = 'Augmented by ' + bn + '. Total flow = ' + totalFlow;
                            augPath = null;
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Network Flow (Ford-Fulkerson)', viz.width / 2, 18, viz.colors.white, 16);

                            var augEdgeSet = {};
                            if (augPath) {
                                augPath.edges.forEach(function(ei) { augEdgeSet[ei] = true; });
                            }

                            // Draw edges with flow/capacity
                            netEdges.forEach(function(e, idx) {
                                var n1 = nodes[e[0]], n2 = nodes[e[1]];
                                var isAug = augEdgeSet[idx];
                                var isFull = flow[idx] >= e[2];
                                ctx.strokeStyle = isAug ? viz.colors.yellow : (flow[idx] > 0 ? viz.colors.blue : viz.colors.grid);
                                ctx.lineWidth = isAug ? 3 : 2;
                                // Draw arrow
                                var dx = n2.x - n1.x, dy = n2.y - n1.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var ux = dx / len, uy = dy / len;
                                var sx = n1.x + ux * 22, sy = n1.y + uy * 22;
                                var ex = n2.x - ux * 22, ey = n2.y - uy * 22;
                                ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
                                // Arrowhead
                                var angle = Math.atan2(ey - sy, ex - sx);
                                ctx.fillStyle = ctx.strokeStyle;
                                ctx.beginPath();
                                ctx.moveTo(ex, ey);
                                ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
                                ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
                                ctx.closePath(); ctx.fill();
                                // Label: flow/capacity
                                var mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
                                var offx = -uy * 14, offy = ux * 14;
                                ctx.fillStyle = isFull ? viz.colors.red : (flow[idx] > 0 ? viz.colors.blue : viz.colors.text);
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(flow[idx] + '/' + e[2], mx + offx, my + offy);
                            });

                            // Draw nodes
                            nodes.forEach(function(n, i) {
                                var r = 20;
                                var nc = (i === 0) ? viz.colors.green : (i === 5) ? viz.colors.red : viz.colors.blue;
                                var isOnAug = augPath && augPath.path.indexOf(i) >= 0;
                                if (isOnAug) nc = viz.colors.yellow;
                                ctx.fillStyle = nc;
                                ctx.strokeStyle = nc; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();
                                ctx.fillStyle = '#0c0c20';
                                ctx.font = 'bold 15px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);
                            });

                            // Status
                            viz.screenText('Total flow: ' + totalFlow, viz.width / 2, 350, viz.colors.white, 14);
                            viz.screenText(statusMsg, viz.width / 2, 375, viz.colors.text, 12);

                            // History
                            if (augHistory.length > 0) {
                                var hy = 400;
                                viz.screenText('Augmentations: ' + augHistory.join('  |  '), viz.width / 2, hy, viz.colors.text, 10);
                            }
                        }

                        VizEngine.createButton(controls, 'Find Augmenting Path', doFindAug);
                        VizEngine.createButton(controls, 'Augment', doAugment);
                        VizEngine.createButton(controls, 'Reset', function() { reset(); });
                        reset();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a flow network with source \\(s\\), sink \\(t\\), and edges \\(s \\to a\\) (cap 10), \\(s \\to b\\) (cap 5), \\(a \\to b\\) (cap 4), \\(a \\to t\\) (cap 8), \\(b \\to t\\) (cap 7), find the maximum flow and a minimum cut.',
                    hint: 'Run Ford-Fulkerson. Look for augmenting paths \\(s \\to a \\to t\\) and \\(s \\to b \\to t\\). Then check if more flow can be pushed via \\(s \\to a \\to b \\to t\\).',
                    solution: 'Path \\(s \\to a \\to t\\): bottleneck 8, flow = 8. Path \\(s \\to b \\to t\\): bottleneck 5, flow = 13. Path \\(s \\to a \\to b \\to t\\): bottleneck \\(\\min(10-8, 4, 7-5) = 2\\), flow = 15. No more augmenting paths. Max flow = 15. Min cut: \\(S = \\{s\\}\\), \\(T = \\{a, b, t\\}\\), capacity \\(10 + 5 = 15\\). Verified: max flow = min cut = 15.'
                },
                {
                    question: 'Explain how maximum bipartite matching can be reduced to a max-flow problem. What are the capacities?',
                    hint: 'Add a super-source and super-sink. All capacities are 1.',
                    solution: 'Given bipartite graph \\(G = (X \\cup Y, E)\\): create source \\(s\\) with directed edges \\(s \\to x\\) (capacity 1) for each \\(x \\in X\\). Direct all edges from \\(X\\) to \\(Y\\) with capacity 1. Create sink \\(t\\) with directed edges \\(y \\to t\\) (capacity 1) for each \\(y \\in Y\\). Any integer max-flow has \\(f(e) \\in \\{0,1\\}\\) (since all capacities are 1). The edges from \\(X\\) to \\(Y\\) carrying flow 1 form a matching (conservation at each vertex ensures at most one such edge per vertex). The flow value equals the matching size. By integrality of max-flow in integer-capacity networks, the max-flow equals the maximum matching.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge Section (Connections, Comparisons, Applications)
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Connections & Applications',
            content: `
<h2>Connections and Applications</h2>

<h3>BFS vs. Dijkstra</h3>

<p>BFS and Dijkstra's algorithm are closely related. In fact, BFS is Dijkstra on an unweighted graph: when all edge weights are 1, the priority queue degenerates to a plain FIFO queue, and Dijkstra reduces to BFS.</p>

<p>The key difference is the data structure:</p>
<ul>
    <li><strong>BFS:</strong> Queue (FIFO). Vertices are processed in order of discovery. \\(O(n + m)\\).</li>
    <li><strong>Dijkstra:</strong> Priority queue (min-heap). Vertices are processed in order of distance. \\(O((n + m) \\log n)\\).</li>
</ul>

<div class="viz-placeholder" data-viz="viz-shortest-path-comparison"></div>

<h3>Topological Sorting via DFS</h3>

<p>A <strong>topological sort</strong> of a DAG is a linear ordering of vertices such that for every directed edge \\((u, v)\\), vertex \\(u\\) appears before \\(v\\). Topological sorts are fundamental for scheduling: if tasks have prerequisite dependencies, a topological sort gives a valid execution order.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.10 (Topological Sort via DFS)</div>
    <div class="env-body">
        <p>For a DAG \\(G\\), ordering the vertices by <strong>decreasing finish time</strong> in a DFS produces a valid topological sort. This runs in \\(O(n + m)\\).</p>
    </div>
</div>

<p><strong>Proof.</strong> For any edge \\((u, v)\\) in a DAG, when DFS explores \\((u, v)\\), vertex \\(v\\) is either undiscovered (so \\(v\\) will be discovered and finished before \\(u\\) finishes, giving \\(f(u) > f(v)\\)) or already finished (giving \\(f(u) > f(v)\\) since \\(u\\) is still active). In both cases \\(f(u) > f(v)\\), so \\(u\\) precedes \\(v\\) in the decreasing finish-time ordering. \\(\\square\\)</p>

<div class="viz-placeholder" data-viz="viz-topological-sort"></div>

<h3>Applications Overview</h3>

<table>
    <thead>
        <tr>
            <th>Algorithm</th>
            <th>Problem</th>
            <th>Complexity</th>
            <th>Applications</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>BFS</td>
            <td>Shortest path (unweighted)</td>
            <td>\\(O(n+m)\\)</td>
            <td>Social network distance, web crawling, puzzle solving</td>
        </tr>
        <tr>
            <td>DFS</td>
            <td>Traversal, cycle detection</td>
            <td>\\(O(n+m)\\)</td>
            <td>Topological sort, SCC, bridges, articulation points</td>
        </tr>
        <tr>
            <td>Dijkstra</td>
            <td>Shortest path (weighted)</td>
            <td>\\(O((n+m)\\log n)\\)</td>
            <td>GPS routing, network routing, game AI</td>
        </tr>
        <tr>
            <td>Bipartite matching</td>
            <td>Maximum matching</td>
            <td>\\(O(n \\cdot m)\\) (Hopcroft-Karp: \\(O(m\\sqrt{n})\\))</td>
            <td>Job assignment, resource allocation, scheduling</td>
        </tr>
        <tr>
            <td>Ford-Fulkerson</td>
            <td>Maximum flow</td>
            <td>\\(O(nm^2)\\) (Edmonds-Karp)</td>
            <td>Network capacity, transportation, image segmentation</td>
        </tr>
    </tbody>
</table>

<h3>The Algorithmic Mindset</h3>

<p>The algorithms in this chapter share a common pattern: they maintain a <strong>frontier</strong> of vertices to explore and a <strong>strategy</strong> for choosing which vertex to process next. The choice of strategy, namely the data structure managing the frontier, determines the algorithm and its properties:</p>
<ul>
    <li><strong>Queue</strong> (FIFO) gives BFS: level-by-level, shortest paths in unweighted graphs.</li>
    <li><strong>Stack</strong> (LIFO) gives DFS: deep exploration, structural decomposition.</li>
    <li><strong>Priority queue</strong> (min-heap) gives Dijkstra: greedy shortest paths in weighted graphs.</li>
</ul>

<p>This is a powerful design principle: by changing only the frontier data structure, you get fundamentally different algorithms with different guarantees.</p>

<div class="env-block remark">
    <div class="env-title">Beyond This Chapter</div>
    <div class="env-body">
        <p>We have covered the foundational graph algorithms. Many important algorithms build on these ideas: Bellman-Ford (negative weights), Floyd-Warshall (all-pairs shortest paths), Prim and Kruskal (minimum spanning trees), Tarjan's SCC algorithm, Hopcroft-Karp matching, and the push-relabel method for max-flow. Each extends the core techniques introduced here.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-shortest-path-comparison',
                    title: 'BFS vs. Dijkstra: Side by Side',
                    description: 'Compare BFS and Dijkstra on the same weighted graph. BFS counts hops (ignoring weights); Dijkstra finds true shortest weighted paths. Step through both simultaneously.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Same graph, two algorithms side by side
                        var graphNodes = [
                            {label: 'S', bx: 40, by: 110, dx: 320, dy: 110},
                            {label: 'A', bx: 120, by: 50, dx: 400, dy: 50},
                            {label: 'B', bx: 120, by: 170, dx: 400, dy: 170},
                            {label: 'C', bx: 220, by: 50, dx: 500, dy: 50},
                            {label: 'D', bx: 220, by: 170, dx: 500, dy: 170}
                        ];
                        var gEdges = [
                            [0,1,1],[0,2,4],[1,2,2],[1,3,6],[2,3,1],[2,4,3],[3,4,1]
                        ];
                        var adj = graphNodes.map(function() { return []; });
                        gEdges.forEach(function(e) {
                            adj[e[0]].push({to: e[1], w: e[2]});
                            adj[e[1]].push({to: e[0], w: e[2]});
                        });

                        // BFS state
                        var bfsDist, bfsVisited, bfsQueue, bfsDone;
                        // Dijkstra state
                        var dijDist, dijVisited, dijPQ, dijDone;

                        function reset() {
                            bfsDist = graphNodes.map(function() { return -1; });
                            bfsDist[0] = 0;
                            bfsVisited = graphNodes.map(function() { return false; });
                            bfsVisited[0] = true;
                            bfsQueue = [0];
                            bfsDone = false;

                            dijDist = graphNodes.map(function() { return Infinity; });
                            dijDist[0] = 0;
                            dijVisited = graphNodes.map(function() { return false; });
                            dijPQ = [0, 1, 2, 3, 4];
                            dijDone = false;
                            draw();
                        }

                        function stepBoth() {
                            // BFS step
                            if (!bfsDone && bfsQueue.length > 0) {
                                var u = bfsQueue.shift();
                                adj[u].forEach(function(e) {
                                    if (!bfsVisited[e.to]) {
                                        bfsVisited[e.to] = true;
                                        bfsDist[e.to] = bfsDist[u] + 1;
                                        bfsQueue.push(e.to);
                                    }
                                });
                                if (bfsQueue.length === 0) bfsDone = true;
                            }
                            // Dijkstra step
                            if (!dijDone && dijPQ.length > 0) {
                                var minIdx = 0;
                                for (var i = 1; i < dijPQ.length; i++) {
                                    if (dijDist[dijPQ[i]] < dijDist[dijPQ[minIdx]]) minIdx = i;
                                }
                                var du = dijPQ[minIdx];
                                dijPQ.splice(minIdx, 1);
                                dijVisited[du] = true;
                                adj[du].forEach(function(e) {
                                    if (!dijVisited[e.to] && dijDist[du] + e.w < dijDist[e.to]) {
                                        dijDist[e.to] = dijDist[du] + e.w;
                                    }
                                });
                                if (dijPQ.length === 0) dijDone = true;
                            }
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Divider
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(280, 0); ctx.lineTo(280, 250); ctx.stroke();

                            viz.screenText('BFS (hop count)', 140, 18, viz.colors.blue, 14);
                            viz.screenText('Dijkstra (weighted)', 420, 18, viz.colors.teal, 14);

                            function drawSide(xKey, yKey, distArr, visitArr, color) {
                                // Edges
                                gEdges.forEach(function(e) {
                                    var n1 = graphNodes[e[0]], n2 = graphNodes[e[1]];
                                    ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1.5;
                                    ctx.beginPath(); ctx.moveTo(n1[xKey], n1[yKey]); ctx.lineTo(n2[xKey], n2[yKey]); ctx.stroke();
                                    var mx = (n1[xKey] + n2[xKey]) / 2;
                                    var my = (n1[yKey] + n2[yKey]) / 2;
                                    var ddx = n2[xKey] - n1[xKey], ddy = n2[yKey] - n1[yKey];
                                    var ll = Math.sqrt(ddx * ddx + ddy * ddy);
                                    ctx.fillStyle = viz.colors.yellow;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(e[2], mx + (-ddy / ll) * 10, my + (ddx / ll) * 10);
                                });
                                // Nodes
                                graphNodes.forEach(function(n, i) {
                                    var nx = n[xKey], ny = n[yKey];
                                    var r = 16;
                                    var vis = visitArr[i] || distArr[i] >= 0;
                                    ctx.fillStyle = vis ? color : '#1a1a40';
                                    ctx.strokeStyle = vis ? color : viz.colors.text;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI * 2);
                                    ctx.fill(); ctx.stroke();
                                    ctx.fillStyle = vis ? '#0c0c20' : viz.colors.text;
                                    ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(n.label, nx, ny);
                                    // Distance
                                    var dVal = distArr[i];
                                    var dStr;
                                    if (dVal === -1 || dVal === Infinity) dStr = '\u221E';
                                    else dStr = '' + dVal;
                                    ctx.fillStyle = color;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillText('d=' + dStr, nx, ny + r + 10);
                                });
                            }

                            drawSide('bx', 'by', bfsDist, bfsVisited, viz.colors.blue);
                            drawSide('dx', 'dy', dijDist, dijVisited, viz.colors.teal);

                            // Comparison table
                            var tY = 260;
                            viz.screenText('Vertex', 50, tY, viz.colors.white, 12);
                            viz.screenText('BFS dist', 150, tY, viz.colors.blue, 12);
                            viz.screenText('Dijkstra dist', 280, tY, viz.colors.teal, 12);
                            viz.screenText('Same?', 420, tY, viz.colors.text, 12);
                            graphNodes.forEach(function(n, i) {
                                var ry = tY + 22 + i * 20;
                                viz.screenText(n.label, 50, ry, viz.colors.white, 11);
                                var bStr = bfsDist[i] >= 0 ? '' + bfsDist[i] : '\u221E';
                                var dStr = dijDist[i] < Infinity ? '' + dijDist[i] : '\u221E';
                                viz.screenText(bStr, 150, ry, viz.colors.blue, 11);
                                viz.screenText(dStr, 280, ry, viz.colors.teal, 11);
                                var same = (bfsDist[i] >= 0 && dijDist[i] < Infinity) ? (bfsDist[i] === dijDist[i] ? 'Yes' : 'No') : '-';
                                var sameColor = same === 'Yes' ? viz.colors.green : (same === 'No' ? viz.colors.red : viz.colors.text);
                                viz.screenText(same, 420, ry, sameColor, 11);
                            });

                            viz.screenText('BFS counts hops, Dijkstra counts total weight', viz.width / 2, 410, viz.colors.text, 11);
                        }

                        VizEngine.createButton(controls, 'Step Both', stepBoth);
                        VizEngine.createButton(controls, 'Reset', reset);
                        reset();
                        return viz;
                    }
                },
                {
                    id: 'viz-topological-sort',
                    title: 'Topological Sort via DFS',
                    description: 'Watch DFS on a DAG. Vertices are placed in topological order (decreasing finish time) as they complete. The result is a valid ordering where all edges point left to right.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        // DAG: course prerequisites
                        var dagNodes = [
                            {id: 0, label: 'CS101', x: 80, y: 60},
                            {id: 1, label: 'CS201', x: 200, y: 40},
                            {id: 2, label: 'MATH', x: 200, y: 130},
                            {id: 3, label: 'CS301', x: 340, y: 60},
                            {id: 4, label: 'CS302', x: 340, y: 150},
                            {id: 5, label: 'CS401', x: 480, y: 100}
                        ];
                        // Directed edges (prerequisites)
                        var dagEdges = [
                            [0,1],[0,2],[1,3],[2,3],[2,4],[3,5],[4,5]
                        ];
                        var dagAdj = dagNodes.map(function() { return []; });
                        dagEdges.forEach(function(e) { dagAdj[e[0]].push(e[1]); });

                        var WHITE = 0, GRAY = 1, BLACK = 2;
                        var nodeColor, disc, fin, time, steps, stepIdx;
                        var topoOrder = [];
                        var playing = false, playTimer = null;

                        function buildSteps() {
                            nodeColor = dagNodes.map(function() { return WHITE; });
                            disc = dagNodes.map(function() { return -1; });
                            fin = dagNodes.map(function() { return -1; });
                            time = 0;
                            steps = [];
                            topoOrder = [];

                            function dfsVisit(u) {
                                time++;
                                disc[u] = time;
                                nodeColor[u] = GRAY;
                                steps.push({type: 'discover', node: u, color: nodeColor.slice(), disc: disc.slice(), fin: fin.slice(), topo: topoOrder.slice()});
                                var neighbors = dagAdj[u].slice().sort(function(a, b) { return a - b; });
                                for (var i = 0; i < neighbors.length; i++) {
                                    if (nodeColor[neighbors[i]] === WHITE) dfsVisit(neighbors[i]);
                                }
                                time++;
                                fin[u] = time;
                                nodeColor[u] = BLACK;
                                topoOrder.unshift(u);
                                steps.push({type: 'finish', node: u, color: nodeColor.slice(), disc: disc.slice(), fin: fin.slice(), topo: topoOrder.slice()});
                            }
                            for (var i = 0; i < dagNodes.length; i++) {
                                if (nodeColor[i] === WHITE) dfsVisit(i);
                            }
                        }

                        function reset() {
                            buildSteps();
                            stepIdx = -1;
                            draw();
                        }

                        function advance() {
                            if (stepIdx >= steps.length - 1) return;
                            stepIdx++;
                            draw();
                        }

                        function togglePlay() {
                            if (playing) {
                                playing = false; if (playTimer) clearInterval(playTimer);
                            } else {
                                playing = true;
                                playTimer = setInterval(function() {
                                    if (stepIdx >= steps.length - 1) { playing = false; clearInterval(playTimer); return; }
                                    advance();
                                }, 600);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Topological Sort via DFS', viz.width / 2, 18, viz.colors.white, 16);

                            var curColor = stepIdx >= 0 ? steps[stepIdx].color : dagNodes.map(function() { return WHITE; });
                            var curDisc = stepIdx >= 0 ? steps[stepIdx].disc : dagNodes.map(function() { return -1; });
                            var curFin = stepIdx >= 0 ? steps[stepIdx].fin : dagNodes.map(function() { return -1; });
                            var curTopo = stepIdx >= 0 ? steps[stepIdx].topo : [];
                            var curNode = stepIdx >= 0 ? steps[stepIdx].node : -1;

                            // Draw edges (directed)
                            dagEdges.forEach(function(e) {
                                var n1 = dagNodes[e[0]], n2 = dagNodes[e[1]];
                                var dx = n2.x - n1.x, dy = n2.y - n1.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var ux = dx / len, uy = dy / len;
                                var sx = n1.x + ux * 28, sy = n1.y + uy * 16;
                                var ex = n2.x - ux * 28, ey = n2.y - uy * 16;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
                                var angle = Math.atan2(ey - sy, ex - sx);
                                ctx.fillStyle = viz.colors.grid;
                                ctx.beginPath();
                                ctx.moveTo(ex, ey);
                                ctx.lineTo(ex - 8 * Math.cos(angle - 0.4), ey - 8 * Math.sin(angle - 0.4));
                                ctx.lineTo(ex - 8 * Math.cos(angle + 0.4), ey - 8 * Math.sin(angle + 0.4));
                                ctx.closePath(); ctx.fill();
                            });

                            // Draw nodes
                            dagNodes.forEach(function(n, i) {
                                var r = 26;
                                var nc;
                                if (curColor[i] === BLACK) nc = viz.colors.green;
                                else if (curColor[i] === GRAY) nc = viz.colors.orange;
                                else nc = viz.colors.text;

                                if (i === curNode) {
                                    ctx.fillStyle = nc + '33';
                                    ctx.beginPath(); ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2); ctx.fill();
                                }
                                ctx.fillStyle = curColor[i] !== WHITE ? nc : '#1a1a40';
                                ctx.strokeStyle = nc; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();

                                ctx.fillStyle = curColor[i] !== WHITE ? '#0c0c20' : viz.colors.text;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);

                                // Timestamps
                                var ts = '';
                                if (curDisc[i] > 0) {
                                    ts = curDisc[i] + '/';
                                    ts += curFin[i] > 0 ? curFin[i] : '?';
                                }
                                if (ts) {
                                    ctx.fillStyle = nc;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.fillText(ts, n.x, n.y + r + 10);
                                }
                            });

                            // Topological order display
                            var topoY = 230;
                            viz.screenText('Topological Order (decreasing finish time):', viz.width / 2, topoY, viz.colors.white, 13);
                            if (curTopo.length > 0) {
                                var topoStr = curTopo.map(function(id) { return dagNodes[id].label; }).join('  \u2192  ');
                                viz.screenText(topoStr, viz.width / 2, topoY + 25, viz.colors.teal, 14);
                            } else {
                                viz.screenText('(building...)', viz.width / 2, topoY + 25, viz.colors.text, 12);
                            }

                            // Draw linearized graph
                            if (curTopo.length > 1) {
                                var linY = 320;
                                viz.screenText('Linearized (all edges point right):', viz.width / 2, linY - 20, viz.colors.text, 11);
                                var topoPos = {};
                                curTopo.forEach(function(id, idx) {
                                    topoPos[id] = idx;
                                    var lx = 60 + idx * 90;
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.beginPath(); ctx.arc(lx, linY, 16, 0, Math.PI * 2); ctx.fill();
                                    ctx.fillStyle = '#0c0c20';
                                    ctx.font = 'bold 10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(dagNodes[id].label, lx, linY);
                                });
                                // Draw directed edges in linear order
                                dagEdges.forEach(function(e) {
                                    if (topoPos[e[0]] !== undefined && topoPos[e[1]] !== undefined) {
                                        var x1 = 60 + topoPos[e[0]] * 90 + 16;
                                        var x2 = 60 + topoPos[e[1]] * 90 - 16;
                                        var yOff = (Math.abs(topoPos[e[1]] - topoPos[e[0]]) > 1) ? -20 : 0;
                                        ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1.5;
                                        ctx.beginPath();
                                        ctx.moveTo(x1, linY + yOff);
                                        ctx.quadraticCurveTo((x1 + x2) / 2, linY + yOff - 15, x2, linY + yOff);
                                        ctx.stroke();
                                        // Arrowhead
                                        ctx.fillStyle = viz.colors.grid;
                                        ctx.beginPath();
                                        ctx.moveTo(x2, linY + yOff);
                                        ctx.lineTo(x2 - 6, linY + yOff - 4);
                                        ctx.lineTo(x2 - 6, linY + yOff + 4);
                                        ctx.closePath(); ctx.fill();
                                    }
                                });
                            }

                            // Step info
                            if (stepIdx >= 0 && stepIdx < steps.length) {
                                var s = steps[stepIdx];
                                var msg = s.type === 'discover'
                                    ? 'Discovered ' + dagNodes[s.node].label
                                    : 'Finished ' + dagNodes[s.node].label + ' (prepend to order)';
                                viz.screenText(msg, viz.width / 2, 400, viz.colors.white, 12);
                            }
                        }

                        VizEngine.createButton(controls, 'Step', advance);
                        VizEngine.createButton(controls, 'Play/Pause', togglePlay);
                        VizEngine.createButton(controls, 'Reset', function() { if (playing) togglePlay(); reset(); });
                        reset();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Give a topological sort of the DAG with vertices \\(\\{1,2,3,4,5,6\\}\\) and edges \\(1 \\to 2, 1 \\to 3, 2 \\to 4, 3 \\to 4, 3 \\to 5, 4 \\to 6, 5 \\to 6\\). Is the topological sort unique?',
                    hint: 'Run DFS and order by decreasing finish time. Alternatively, repeatedly remove a vertex with no incoming edges.',
                    solution: 'One valid topological sort: \\(1, 3, 5, 2, 4, 6\\). Another: \\(1, 2, 3, 4, 5, 6\\). The sort is not unique because at several points there are multiple vertices with no unresolved predecessors (e.g., after removing 1, both 2 and 3 have in-degree 0).'
                },
                {
                    question: 'Prove that a directed graph \\(G\\) has a topological sort if and only if \\(G\\) is a DAG.',
                    hint: 'One direction: if \\(G\\) has a cycle, no topological sort is possible (why?). Other direction: use the DFS finish-time ordering.',
                    solution: 'If \\(G\\) has a cycle \\(v_1 \\to v_2 \\to \\cdots \\to v_k \\to v_1\\), then any linear ordering must place \\(v_1\\) before \\(v_2\\) before \\(\\cdots\\) before \\(v_k\\) before \\(v_1\\), a contradiction. Conversely, if \\(G\\) is a DAG, run DFS. By Theorem 12.3, there are no back edges. For any edge \\((u,v)\\), we have \\(f(u) > f(v)\\) (as shown in the proof of Theorem 12.10). So ordering by decreasing \\(f\\) gives a valid topological sort.'
                },
                {
                    question: 'A graph \\(G\\) has \\(n\\) vertices and \\(m\\) edges, stored as an adjacency list. Explain why BFS and DFS both run in \\(O(n + m)\\) time, not \\(O(nm)\\).',
                    hint: 'Each vertex is processed once. Each edge is examined how many times?',
                    solution: 'Each vertex enters the queue/stack at most once, contributing \\(O(n)\\) total for vertex processing. When a vertex \\(u\\) is processed, we scan its adjacency list, which has \\(\\deg(u)\\) entries. The total work scanning adjacency lists is \\(\\sum_u \\deg(u) = 2m\\) (for undirected) or \\(m\\) (for directed). So total work is \\(O(n + m)\\), not \\(O(nm)\\). The \\(O(nm)\\) bound would apply if we used an adjacency matrix (\\(O(n)\\) per vertex to scan neighbors, times \\(n\\) vertices).'
                },
                {
                    question: 'Consider the flow network from the visualization (\\(s,a,b,c,d,t\\) with capacities \\(s \\to a: 10, s \\to b: 8, a \\to b: 5, a \\to c: 7, b \\to d: 10, c \\to d: 3, c \\to t: 10, d \\to t: 12\\)). Find the max flow and verify it equals the min cut.',
                    hint: 'Use Edmonds-Karp (BFS for augmenting paths). After finding the max flow, identify the min cut by finding vertices reachable from \\(s\\) in the residual graph.',
                    solution: 'Augmenting paths: (1) \\(s \\to a \\to c \\to t\\), bottleneck 7, flow = 7. (2) \\(s \\to b \\to d \\to t\\), bottleneck 8, flow = 15. (3) \\(s \\to a \\to b \\to d \\to t\\), bottleneck \\(\\min(3, 5, 2, 4) = 2\\), flow = 17. (4) \\(s \\to a \\to c \\to d \\to t\\), this path has bottleneck \\(\\min(1, 0, 3, 2) = 0\\) since \\(c\\) capacity to \\(t\\) is used. Check remaining residual: no more augmenting paths. Max flow = 17. Min cut: \\(S = \\{s\\}\\), \\(T = \\{a,b,c,d,t\\}\\), capacity \\(10 + 8 = 18\\). Better: \\(S = \\{s,a,b\\}\\), \\(T = \\{c,d,t\\}\\), capacity \\(7 + 10 = 17\\). Confirmed: max flow = min cut = 17.'
                },
                {
                    question: "State and prove Konig's theorem: in a bipartite graph, the size of a maximum matching equals the size of a minimum vertex cover.",
                    hint: "Use the max-flow min-cut theorem on the flow network constructed from the bipartite graph (with super-source and super-sink).",
                    solution: "Construct the flow network: source \\(s\\) connected to all left vertices, all right vertices connected to sink \\(t\\), all capacities 1. By max-flow min-cut, max matching = max flow = min cut. A min cut in this network corresponds to choosing, for each edge that crosses the cut, either the left or right endpoint. This is exactly a vertex cover. The capacity of the min cut (which counts the number of chosen vertices) equals the size of the minimum vertex cover. Therefore max matching = min vertex cover."
                }
            ]
        }
    ]
});
