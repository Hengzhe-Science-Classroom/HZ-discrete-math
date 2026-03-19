window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch11',
    number: 11,
    title: 'Trees',
    subtitle: 'Connected graphs without cycles',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Trees?',
            content: `
<h2>Why Trees?</h2>

<div class="env-block intuition">
    <div class="env-title">Trees Are Everywhere</div>
    <div class="env-body">
        <p>Open a file browser on your computer: folders contain subfolders, which contain files. That hierarchy is a tree. Parse a mathematical expression like \\((2 + 3) \\times 4\\): the compiler builds a tree. Find the cheapest way to connect cities with fiber optic cable: the answer is a tree. Trace your ancestry: a tree again.</p>
        <p>Trees are the simplest connected structures. They use the absolute minimum number of edges to hold a graph together, and removing any single edge disconnects the graph. This minimality makes them both theoretically elegant and practically indispensable.</p>
    </div>
</div>

<p>In the previous chapter we studied graphs in full generality: vertices, edges, paths, cycles, connectivity. Now we restrict attention to a special class of graphs that arises constantly in applications and theory alike. A <strong>tree</strong> is a connected graph with no cycles. This simple definition has surprisingly deep consequences.</p>

<h3>Where Trees Appear</h3>

<ul>
    <li><strong>Network design.</strong> Spanning trees give the cheapest way to connect all nodes. Kruskal's and Prim's algorithms find minimum spanning trees efficiently.</li>
    <li><strong>Data structures.</strong> Binary search trees, heaps, B-trees, and tries are fundamental to computer science.</li>
    <li><strong>Parsing and compilation.</strong> Expression trees represent arithmetic and logical formulas; abstract syntax trees represent program structure.</li>
    <li><strong>Decision processes.</strong> Game trees, decision trees, and probability trees model sequential choices.</li>
    <li><strong>Taxonomy and phylogenetics.</strong> Classification hierarchies in biology are trees.</li>
</ul>

<p>This chapter develops the theory of trees from the ground up: definitions, characterizations, rooted trees, spanning trees and their algorithms, binary tree traversals, and Cayley's beautiful formula for counting labeled trees.</p>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Trees — Definitions and Characterizations
        // ================================================================
        {
            id: 'sec-definition',
            title: 'Trees',
            content: `
<h2>Trees</h2>

<div class="env-block definition">
    <div class="env-title">Definition 11.1 (Tree)</div>
    <div class="env-body">
        <p>A <strong>tree</strong> is a connected, acyclic graph. A <strong>forest</strong> is an acyclic graph (not necessarily connected); each connected component of a forest is a tree.</p>
    </div>
</div>

<p>The definition is minimalist, but it packs a punch. The following theorem shows that many different conditions are equivalent to being a tree.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.1 (Characterizations of Trees)</div>
    <div class="env-body">
        <p>Let \\(G\\) be a graph on \\(n\\) vertices. The following are equivalent:</p>
        <ol>
            <li>\\(G\\) is connected and acyclic (i.e., \\(G\\) is a tree).</li>
            <li>\\(G\\) is connected and has exactly \\(n - 1\\) edges.</li>
            <li>\\(G\\) is acyclic and has exactly \\(n - 1\\) edges.</li>
            <li>There is a unique path between every pair of vertices in \\(G\\).</li>
            <li>\\(G\\) is connected, but removing any edge disconnects it (every edge is a <em>bridge</em>).</li>
            <li>\\(G\\) is acyclic, but adding any edge creates exactly one cycle.</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof sketch</div>
    <div class="env-body">
        <p><strong>(1) \\(\\Rightarrow\\) (4):</strong> If two distinct paths existed between vertices \\(u\\) and \\(v\\), their union would contain a cycle, contradicting acyclicity.</p>
        <p><strong>(4) \\(\\Rightarrow\\) (5):</strong> Unique paths imply connectivity. If edge \\(\\{u,v\\}\\) is removed, the unique \\(u\\)-\\(v\\) path is destroyed, so \\(u\\) and \\(v\\) are disconnected.</p>
        <p><strong>(1) \\(\\Rightarrow\\) (2):</strong> By induction on \\(n\\). A tree on 1 vertex has 0 edges. For \\(n \\geq 2\\), a tree must have a leaf (a vertex of degree 1; this follows because a connected acyclic graph cannot have all vertices of degree \\(\\geq 2\\)). Removing a leaf and its edge gives a tree on \\(n - 1\\) vertices with \\(n - 2\\) edges, so the original tree has \\(n - 1\\) edges.</p>
        <p>The remaining implications follow by similar reasoning. \\(\\square\\)</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Recognizing Trees</div>
    <div class="env-body">
        <p>Consider a graph on 6 vertices with 5 edges. Is it a tree? It has the right edge count, but that alone is not sufficient; we also need connectivity (or acyclicity). A graph on 6 vertices with 5 edges could be a tree, or it could be a forest of two components (say a triangle plus an isolated edge and vertex), or other non-tree configurations.</p>
        <p>The characterization theorem tells us: check <em>any two</em> of {connected, acyclic, \\(n - 1\\) edges}. Any two imply the third.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 11.2 (Leaf)</div>
    <div class="env-body">
        <p>A <strong>leaf</strong> (or pendant vertex) of a tree is a vertex of degree 1. Every tree with \\(n \\geq 2\\) has at least two leaves.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why at Least Two Leaves?</div>
    <div class="env-body">
        <p>The sum of degrees in any graph equals \\(2|E|\\). In a tree, \\(|E| = n - 1\\), so the degree sum is \\(2(n-1)\\). If at most one vertex had degree 1 and all others had degree \\(\\geq 2\\), the degree sum would be at least \\(1 + 2(n-1) = 2n - 1 > 2(n-1)\\), a contradiction.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-tree-gallery"></div>
`,
            visualizations: [
                {
                    id: 'viz-tree-gallery',
                    title: 'Gallery of Trees',
                    description: 'Five classic families of trees: path, star, binary, complete, and caterpillar. Click a type to see it drawn with its properties highlighted.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var treeType = 'binary';
                        var nParam = 7;

                        var types = ['path', 'star', 'binary', 'complete', 'caterpillar'];
                        var typeLabels = ['Path', 'Star', 'Binary', 'Complete (K_{1,n})', 'Caterpillar'];

                        var btnGroup = document.createElement('div');
                        btnGroup.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin-bottom:4px;';
                        types.forEach(function(t, idx) {
                            var b = VizEngine.createButton(btnGroup, typeLabels[idx], function() {
                                treeType = t;
                                draw();
                            });
                            if (t === treeType) b.style.borderColor = '#58a6ff';
                        });
                        controls.appendChild(btnGroup);

                        VizEngine.createSlider(controls, 'Vertices', 4, 15, nParam, 1, function(v) {
                            nParam = Math.round(v);
                            draw();
                        });

                        function buildTree(type, n) {
                            var nodes = [];
                            var edges = [];
                            for (var i = 0; i < n; i++) nodes.push(i);

                            if (type === 'path') {
                                for (var i = 0; i < n - 1; i++) edges.push([i, i + 1]);
                            } else if (type === 'star') {
                                for (var i = 1; i < n; i++) edges.push([0, i]);
                            } else if (type === 'binary') {
                                for (var i = 0; i < n; i++) {
                                    var left = 2 * i + 1, right = 2 * i + 2;
                                    if (left < n) edges.push([i, left]);
                                    if (right < n) edges.push([i, right]);
                                }
                            } else if (type === 'complete') {
                                // Complete ternary for variety
                                for (var i = 0; i < n; i++) {
                                    for (var c = 1; c <= 3; c++) {
                                        var child = 3 * i + c;
                                        if (child < n) edges.push([i, child]);
                                    }
                                }
                            } else if (type === 'caterpillar') {
                                var spine = Math.max(2, Math.ceil(n / 2));
                                for (var i = 0; i < spine - 1; i++) edges.push([i, i + 1]);
                                var next = spine;
                                for (var i = 1; i < spine - 1 && next < n; i++) {
                                    edges.push([i, next]);
                                    next++;
                                }
                                while (next < n) {
                                    edges.push([Math.floor(Math.random() * spine), next]);
                                    next++;
                                }
                            }
                            return { nodes: nodes, edges: edges };
                        }

                        function layoutTree(tree, type, n) {
                            var pos = [];
                            var W = viz.width - 80, H = viz.height - 100;
                            var cx = viz.width / 2, cy = viz.height / 2;

                            if (type === 'path') {
                                for (var i = 0; i < n; i++) {
                                    pos.push([40 + (W * i) / Math.max(n - 1, 1), cy]);
                                }
                            } else if (type === 'star') {
                                pos.push([cx, cy]);
                                for (var i = 1; i < n; i++) {
                                    var angle = (2 * Math.PI * (i - 1)) / (n - 1);
                                    pos.push([cx + Math.cos(angle) * Math.min(W, H) * 0.4, cy + Math.sin(angle) * Math.min(W, H) * 0.4]);
                                }
                            } else if (type === 'binary' || type === 'complete') {
                                var branching = type === 'binary' ? 2 : 3;
                                var depth = Math.floor(Math.log(n) / Math.log(branching)) + 1;
                                var levelY = function(d) { return 60 + (H * d) / Math.max(depth, 1); };
                                var placed = 0;
                                var levels = [];
                                for (var d = 0; d <= depth; d++) {
                                    var start = placed;
                                    var count = Math.min(Math.pow(branching, d), n - placed);
                                    levels.push({ start: start, count: count });
                                    placed += count;
                                    if (placed >= n) break;
                                }
                                for (var d = 0; d < levels.length; d++) {
                                    var lv = levels[d];
                                    for (var j = 0; j < lv.count; j++) {
                                        var xFrac = (j + 0.5) / lv.count;
                                        pos[lv.start + j] = [40 + W * xFrac, levelY(d)];
                                    }
                                }
                            } else if (type === 'caterpillar') {
                                var spine = Math.max(2, Math.ceil(n / 2));
                                for (var i = 0; i < spine; i++) {
                                    pos.push([40 + (W * i) / Math.max(spine - 1, 1), cy]);
                                }
                                for (var i = spine; i < n; i++) {
                                    var parent = -1;
                                    for (var e = 0; e < tree.edges.length; e++) {
                                        if (tree.edges[e][1] === i) { parent = tree.edges[e][0]; break; }
                                        if (tree.edges[e][0] === i) { parent = tree.edges[e][1]; break; }
                                    }
                                    if (parent >= 0 && pos[parent]) {
                                        pos.push([pos[parent][0], pos[parent][1] + 50 + (i % 2) * 30]);
                                    } else {
                                        pos.push([cx, cy + 60]);
                                    }
                                }
                            }
                            return pos;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var tree = buildTree(treeType, nParam);
                            var pos = layoutTree(tree, treeType, nParam);

                            // Title
                            var titleMap = { path: 'Path Graph P_' + nParam, star: 'Star Graph S_' + nParam, binary: 'Binary Tree (' + nParam + ' nodes)', complete: 'Ternary Tree (' + nParam + ' nodes)', caterpillar: 'Caterpillar (' + nParam + ' nodes)' };
                            viz.screenText(titleMap[treeType] || 'Tree', viz.width / 2, 20, viz.colors.white, 15);

                            // Edges
                            ctx.lineWidth = 2;
                            tree.edges.forEach(function(e) {
                                var p1 = pos[e[0]], p2 = pos[e[1]];
                                if (!p1 || !p2) return;
                                ctx.strokeStyle = viz.colors.blue + 'aa';
                                ctx.beginPath();
                                ctx.moveTo(p1[0], p1[1]);
                                ctx.lineTo(p2[0], p2[1]);
                                ctx.stroke();
                            });

                            // Nodes
                            tree.nodes.forEach(function(nd, i) {
                                if (!pos[i]) return;
                                var deg = 0;
                                tree.edges.forEach(function(e) { if (e[0] === i || e[1] === i) deg++; });
                                var isLeaf = deg <= 1 && nParam > 1;
                                var col = isLeaf ? viz.colors.green : viz.colors.blue;
                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.arc(pos[i][0], pos[i][1], 8, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), pos[i][0], pos[i][1]);
                            });

                            // Stats
                            var leaves = 0;
                            tree.nodes.forEach(function(nd, i) {
                                var deg = 0;
                                tree.edges.forEach(function(e) { if (e[0] === i || e[1] === i) deg++; });
                                if (deg <= 1 && nParam > 1) leaves++;
                            });
                            viz.screenText('Vertices: ' + nParam + '   Edges: ' + tree.edges.length + '   Leaves: ' + leaves, viz.width / 2, viz.height - 18, viz.colors.text, 12);
                            viz.screenText('Leaves shown in green', viz.width / 2, viz.height - 4, viz.colors.green, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that every tree with \\(n \\geq 2\\) vertices has at least two leaves.',
                    hint: 'Use the handshaking lemma: the sum of degrees equals \\(2(n-1)\\). Assume at most one vertex has degree 1.',
                    solution: 'The degree sum is \\(2(n-1) = 2n - 2\\). If at most one vertex has degree 1 and all others have degree \\(\\geq 2\\), the sum is at least \\(1 + 2(n-1) = 2n - 1 > 2n - 2\\), a contradiction. So at least two vertices must have degree 1.'
                },
                {
                    question: 'A tree has 10 vertices. How many edges does it have?',
                    hint: 'Recall the fundamental edge-count property of trees.',
                    solution: '\\(n - 1 = 9\\) edges. This holds for every tree on \\(n\\) vertices.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Rooted Trees
        // ================================================================
        {
            id: 'sec-rooted',
            title: 'Rooted Trees',
            content: `
<h2>Rooted Trees</h2>

<div class="env-block definition">
    <div class="env-title">Definition 11.3 (Rooted Tree)</div>
    <div class="env-body">
        <p>A <strong>rooted tree</strong> is a tree in which one vertex has been designated as the <strong>root</strong>. This induces a natural hierarchy: every other vertex has a unique <strong>parent</strong> (the next vertex on the path toward the root), and zero or more <strong>children</strong> (adjacent vertices farther from the root).</p>
    </div>
</div>

<p>Rooting a tree transforms an unordered, symmetric structure into a hierarchical one. The choice of root determines parent-child relationships, depth, and height.</p>

<div class="env-block definition">
    <div class="env-title">Definition 11.4 (Terminology)</div>
    <div class="env-body">
        <ul>
            <li>The <strong>depth</strong> of a vertex \\(v\\) is the length of the path from the root to \\(v\\).</li>
            <li>The <strong>height</strong> of the tree is the maximum depth of any vertex.</li>
            <li>An <strong>internal vertex</strong> is a vertex that is not a leaf (it has at least one child).</li>
            <li>A <strong>subtree rooted at \\(v\\)</strong> consists of \\(v\\) and all its descendants.</li>
            <li>The <strong>level</strong> \\(k\\) of a rooted tree is the set of all vertices at depth \\(k\\).</li>
        </ul>
    </div>
</div>

<h3>\\(m\\)-ary and Binary Trees</h3>

<div class="env-block definition">
    <div class="env-title">Definition 11.5 (\\(m\\)-ary Tree)</div>
    <div class="env-body">
        <p>A rooted tree is <strong>\\(m\\)-ary</strong> if every internal vertex has at most \\(m\\) children. It is <strong>full \\(m\\)-ary</strong> if every internal vertex has exactly \\(m\\) children. The most common case is \\(m = 2\\): a <strong>binary tree</strong>.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.2 (Full \\(m\\)-ary Tree)</div>
    <div class="env-body">
        <p>A full \\(m\\)-ary tree with \\(i\\) internal vertices has:</p>
        <ul>
            <li>\\(n = mi + 1\\) total vertices,</li>
            <li>\\(\\ell = (m-1)i + 1\\) leaves,</li>
            <li>\\(mi\\) edges.</li>
        </ul>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Every vertex except the root is the child of exactly one internal vertex. Each internal vertex contributes \\(m\\) children, so the number of non-root vertices is \\(mi\\). Adding the root gives \\(n = mi + 1\\). The leaves are the non-internal vertices: \\(\\ell = n - i = mi + 1 - i = (m-1)i + 1\\). Edges equal \\(n - 1 = mi\\). \\(\\square\\)</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Full Binary Tree</div>
    <div class="env-body">
        <p>A full binary tree (\\(m = 2\\)) with 7 internal vertices has \\(2 \\times 7 + 1 = 15\\) vertices and \\(7 + 1 = 8\\) leaves. A tournament bracket for 8 players needs exactly 7 matches (internal vertices), consistent with the formula.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.3 (Height Bound)</div>
    <div class="env-body">
        <p>A binary tree of height \\(h\\) has at most \\(2^{h+1} - 1\\) vertices and at most \\(2^h\\) leaves. Equivalently, a binary tree with \\(\\ell\\) leaves has height \\(h \\geq \\lceil \\log_2 \\ell \\rceil\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Practical Significance</div>
    <div class="env-body">
        <p>The height bound explains why balanced binary search trees guarantee \\(O(\\log n)\\) search time: a balanced tree on \\(n\\) nodes has height \\(\\Theta(\\log n)\\), and each comparison moves down one level.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'A full ternary tree (\\(m = 3\\)) has 40 leaves. How many internal vertices does it have?',
                    hint: 'Use the formula \\(\\ell = (m-1)i + 1\\) and solve for \\(i\\).',
                    solution: 'From \\(\\ell = 2i + 1\\), we get \\(40 = 2i + 1\\), so \\(i = 19.5\\). Since \\(i\\) must be an integer, 40 leaves is impossible for a full ternary tree. With 40 leaves: \\(i = (\\ell - 1)/(m - 1) = 39/2 = 19.5\\). This means no full ternary tree has exactly 40 leaves. Valid leaf counts are \\(1, 3, 5, 7, \\ldots\\) (odd only for \\(m=3\\), since \\(\\ell = 2i + 1\\)).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Spanning Trees
        // ================================================================
        {
            id: 'sec-spanning',
            title: 'Spanning Trees',
            content: `
<h2>Spanning Trees</h2>

<div class="env-block definition">
    <div class="env-title">Definition 11.6 (Spanning Tree)</div>
    <div class="env-body">
        <p>A <strong>spanning tree</strong> of a connected graph \\(G\\) is a subgraph that is a tree and includes every vertex of \\(G\\). Equivalently, it is a maximal acyclic subgraph or a minimal connected spanning subgraph.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.4 (Existence)</div>
    <div class="env-body">
        <p>Every connected graph has a spanning tree.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>If \\(G\\) is already a tree, we are done. Otherwise \\(G\\) contains a cycle. Remove one edge from the cycle; the graph remains connected (both endpoints remain reachable via the rest of the cycle). Repeat until no cycles remain. The result is a connected, acyclic spanning subgraph, i.e., a spanning tree. \\(\\square\\)</p>
    </div>
</div>

<h3>Minimum Spanning Trees</h3>

<p>When edges have weights (costs, distances), we want a spanning tree of minimum total weight. This is the <strong>minimum spanning tree</strong> (MST) problem, fundamental in network design.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.5 (Cut Property)</div>
    <div class="env-body">
        <p>For any cut of a connected weighted graph (a partition of vertices into two nonempty sets), the minimum-weight edge crossing the cut belongs to some MST. If this minimum is unique, it belongs to every MST.</p>
    </div>
</div>

<h3>Kruskal's Algorithm</h3>

<div class="env-block definition">
    <div class="env-title">Algorithm: Kruskal (1956)</div>
    <div class="env-body">
        <ol>
            <li>Sort all edges by weight (ascending).</li>
            <li>Initialize the MST as an empty edge set.</li>
            <li>For each edge (in sorted order): if it connects two different components, add it to the MST.</li>
            <li>Stop when the MST has \\(n - 1\\) edges.</li>
        </ol>
        <p>Time complexity: \\(O(|E| \\log |E|)\\), dominated by sorting.</p>
    </div>
</div>

<h3>Prim's Algorithm</h3>

<div class="env-block definition">
    <div class="env-title">Algorithm: Prim (1957)</div>
    <div class="env-body">
        <ol>
            <li>Start from any vertex. Mark it as "in the tree."</li>
            <li>Repeat: among all edges with exactly one endpoint in the tree, pick the one of minimum weight. Add the other endpoint to the tree.</li>
            <li>Stop when all vertices are in the tree.</li>
        </ol>
        <p>Time complexity: \\(O(|E| \\log |V|)\\) with a binary heap; \\(O(|E| + |V| \\log |V|)\\) with a Fibonacci heap.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Kruskal vs. Prim</div>
    <div class="env-body">
        <p>Both are greedy and both produce an MST. Kruskal processes edges globally (sort, then scan); Prim grows a single tree outward. Kruskal is often preferred for sparse graphs; Prim (with a good heap) is better for dense graphs.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-kruskal"></div>
<div class="viz-placeholder" data-viz="viz-prim"></div>
<div class="viz-placeholder" data-viz="viz-spanning-tree-count"></div>
`,
            visualizations: [
                {
                    id: 'viz-kruskal',
                    title: "Kruskal's Algorithm",
                    description: "Watch Kruskal's algorithm build a minimum spanning tree step by step. Edges are sorted by weight and added if they don't create a cycle.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Fixed graph
                        var nodes = [
                            {x: 80, y: 80, label: 'A'},
                            {x: 280, y: 60, label: 'B'},
                            {x: 480, y: 80, label: 'C'},
                            {x: 480, y: 280, label: 'D'},
                            {x: 280, y: 320, label: 'E'},
                            {x: 80, y: 280, label: 'F'},
                            {x: 280, y: 180, label: 'G'}
                        ];
                        var edges = [
                            {u:0, v:1, w:7}, {u:0, v:5, w:5}, {u:1, v:2, w:8},
                            {u:1, v:6, w:9}, {u:2, v:3, w:5}, {u:3, v:4, w:6},
                            {u:3, v:6, w:11}, {u:4, v:5, w:8}, {u:4, v:6, w:7},
                            {u:0, v:6, w:15}, {u:5, v:6, w:6}, {u:1, v:5, w:12}
                        ];

                        var sorted = edges.slice().sort(function(a, b) { return a.w - b.w; });
                        var step = 0;
                        var mstEdges = [];
                        var parent = [];
                        var maxStep = sorted.length;

                        function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
                        function union(a, b) { parent[find(a)] = find(b); }

                        function computeKruskal(upTo) {
                            mstEdges = [];
                            parent = [];
                            for (var i = 0; i < nodes.length; i++) parent.push(i);
                            for (var i = 0; i < upTo && i < sorted.length; i++) {
                                var e = sorted[i];
                                if (find(e.u) !== find(e.v)) {
                                    union(e.u, e.v);
                                    mstEdges.push(e);
                                }
                            }
                        }

                        var stepBtn = VizEngine.createButton(controls, 'Step', function() {
                            if (step < maxStep) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });
                        VizEngine.createButton(controls, 'Run All', function() { step = maxStep; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            computeKruskal(step);

                            viz.screenText("Kruskal's Algorithm", viz.width / 2, 20, viz.colors.white, 15);

                            // Draw all edges (grey)
                            edges.forEach(function(e) {
                                ctx.strokeStyle = '#333355';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(nodes[e.u].x, nodes[e.u].y);
                                ctx.lineTo(nodes[e.v].x, nodes[e.v].y);
                                ctx.stroke();
                                var mx = (nodes[e.u].x + nodes[e.v].x) / 2;
                                var my = (nodes[e.u].y + nodes[e.v].y) / 2;
                                ctx.fillStyle = '#555';
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(e.w.toString(), mx, my);
                            });

                            // Current edge being considered
                            if (step > 0 && step <= sorted.length) {
                                var ce = sorted[step - 1];
                                var inMST = mstEdges.indexOf(ce) >= 0;
                                ctx.strokeStyle = inMST ? viz.colors.green : viz.colors.red;
                                ctx.lineWidth = 3;
                                ctx.setLineDash(inMST ? [] : [6, 4]);
                                ctx.beginPath();
                                ctx.moveTo(nodes[ce.u].x, nodes[ce.u].y);
                                ctx.lineTo(nodes[ce.v].x, nodes[ce.v].y);
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // MST edges
                            mstEdges.forEach(function(e) {
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.moveTo(nodes[e.u].x, nodes[e.u].y);
                                ctx.lineTo(nodes[e.v].x, nodes[e.v].y);
                                ctx.stroke();
                                var mx = (nodes[e.u].x + nodes[e.v].x) / 2;
                                var my = (nodes[e.u].y + nodes[e.v].y) / 2;
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(e.w.toString(), mx, my - 10);
                            });

                            // Nodes
                            nodes.forEach(function(nd, i) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(nd.x, nd.y, 14, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(nd.label, nd.x, nd.y);
                            });

                            // Status
                            var totalW = 0;
                            mstEdges.forEach(function(e) { totalW += e.w; });
                            var statusText = 'Step ' + step + '/' + maxStep + '   MST edges: ' + mstEdges.length + '   Total weight: ' + totalW;
                            viz.screenText(statusText, viz.width / 2, viz.height - 16, viz.colors.text, 11);

                            // Sorted edge list
                            var listY = viz.height - 50;
                            viz.screenText('Sorted edges: ' + sorted.map(function(e) { return nodes[e.u].label + nodes[e.v].label + '(' + e.w + ')'; }).join(', '), viz.width / 2, listY, viz.colors.text, 9);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-prim',
                    title: "Prim's Algorithm",
                    description: "Watch Prim's algorithm grow an MST from a starting vertex. At each step, the cheapest edge leaving the current tree is selected.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nodes = [
                            {x: 80, y: 80, label: 'A'},
                            {x: 280, y: 60, label: 'B'},
                            {x: 480, y: 80, label: 'C'},
                            {x: 480, y: 280, label: 'D'},
                            {x: 280, y: 320, label: 'E'},
                            {x: 80, y: 280, label: 'F'},
                            {x: 280, y: 180, label: 'G'}
                        ];
                        var adjEdges = [
                            {u:0, v:1, w:7}, {u:0, v:5, w:5}, {u:1, v:2, w:8},
                            {u:1, v:6, w:9}, {u:2, v:3, w:5}, {u:3, v:4, w:6},
                            {u:3, v:6, w:11}, {u:4, v:5, w:8}, {u:4, v:6, w:7},
                            {u:0, v:6, w:15}, {u:5, v:6, w:6}, {u:1, v:5, w:12}
                        ];

                        var step = 0;
                        var maxSteps = nodes.length - 1;
                        var primOrder = [];

                        function computePrim() {
                            primOrder = [];
                            var inTree = [true, false, false, false, false, false, false];
                            for (var s = 0; s < maxSteps; s++) {
                                var bestEdge = null;
                                var bestW = Infinity;
                                adjEdges.forEach(function(e) {
                                    var uIn = inTree[e.u], vIn = inTree[e.v];
                                    if ((uIn && !vIn) || (!uIn && vIn)) {
                                        if (e.w < bestW) { bestW = e.w; bestEdge = e; }
                                    }
                                });
                                if (bestEdge) {
                                    primOrder.push(bestEdge);
                                    inTree[bestEdge.u] = true;
                                    inTree[bestEdge.v] = true;
                                }
                            }
                        }
                        computePrim();

                        VizEngine.createButton(controls, 'Step', function() {
                            if (step < maxSteps) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });
                        VizEngine.createButton(controls, 'Run All', function() { step = maxSteps; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText("Prim's Algorithm (start at A)", viz.width / 2, 20, viz.colors.white, 15);

                            // All edges (grey)
                            adjEdges.forEach(function(e) {
                                ctx.strokeStyle = '#333355';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(nodes[e.u].x, nodes[e.u].y);
                                ctx.lineTo(nodes[e.v].x, nodes[e.v].y);
                                ctx.stroke();
                                var mx = (nodes[e.u].x + nodes[e.v].x) / 2;
                                var my = (nodes[e.u].y + nodes[e.v].y) / 2;
                                ctx.fillStyle = '#555';
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(e.w.toString(), mx, my);
                            });

                            // MST edges so far
                            var inTree = [false, false, false, false, false, false, false];
                            inTree[0] = true;
                            var totalW = 0;
                            for (var i = 0; i < step && i < primOrder.length; i++) {
                                var e = primOrder[i];
                                inTree[e.u] = true;
                                inTree[e.v] = true;
                                totalW += e.w;
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.moveTo(nodes[e.u].x, nodes[e.u].y);
                                ctx.lineTo(nodes[e.v].x, nodes[e.v].y);
                                ctx.stroke();
                                var mx = (nodes[e.u].x + nodes[e.v].x) / 2;
                                var my = (nodes[e.u].y + nodes[e.v].y) / 2;
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(e.w.toString(), mx, my - 10);
                            }

                            // Highlight frontier edges
                            if (step < maxSteps) {
                                adjEdges.forEach(function(e) {
                                    var uIn = inTree[e.u], vIn = inTree[e.v];
                                    if ((uIn && !vIn) || (!uIn && vIn)) {
                                        ctx.strokeStyle = viz.colors.yellow + '66';
                                        ctx.lineWidth = 2;
                                        ctx.setLineDash([4, 4]);
                                        ctx.beginPath();
                                        ctx.moveTo(nodes[e.u].x, nodes[e.u].y);
                                        ctx.lineTo(nodes[e.v].x, nodes[e.v].y);
                                        ctx.stroke();
                                        ctx.setLineDash([]);
                                    }
                                });
                            }

                            // Nodes
                            nodes.forEach(function(nd, i) {
                                ctx.fillStyle = inTree[i] ? viz.colors.teal : viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(nd.x, nd.y, 14, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(nd.label, nd.x, nd.y);
                            });

                            var statusText = 'Step ' + step + '/' + maxSteps + '   Tree size: ' + (step + 1) + '   Total weight: ' + totalW;
                            viz.screenText(statusText, viz.width / 2, viz.height - 16, viz.colors.text, 11);
                            viz.screenText('Yellow dashed = frontier edges', viz.width / 2, viz.height - 36, viz.colors.yellow, 10);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-spanning-tree-count',
                    title: 'All Spanning Trees of a Small Graph',
                    description: 'Enumerate every spanning tree of a small graph. Click through to see each one highlighted.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        // K4 graph
                        var nodes = [
                            {x: 180, y: 80, label: '1'},
                            {x: 380, y: 80, label: '2'},
                            {x: 380, y: 260, label: '3'},
                            {x: 180, y: 260, label: '4'}
                        ];
                        var allEdges = [
                            [0,1], [0,2], [0,3], [1,2], [1,3], [2,3]
                        ];

                        // Enumerate all spanning trees of K4 (choose n-1=3 edges that form a tree)
                        var spanningTrees = [];
                        function isConnected(edgeSet) {
                            var adj = [[],[],[],[]];
                            edgeSet.forEach(function(ei) {
                                adj[allEdges[ei][0]].push(allEdges[ei][1]);
                                adj[allEdges[ei][1]].push(allEdges[ei][0]);
                            });
                            var visited = [false, false, false, false];
                            var queue = [0];
                            visited[0] = true;
                            var count = 1;
                            while (queue.length > 0) {
                                var u = queue.shift();
                                adj[u].forEach(function(v) {
                                    if (!visited[v]) { visited[v] = true; count++; queue.push(v); }
                                });
                            }
                            return count === 4;
                        }

                        // Choose 3 from 6 edges
                        for (var i = 0; i < allEdges.length; i++) {
                            for (var j = i + 1; j < allEdges.length; j++) {
                                for (var k = j + 1; k < allEdges.length; k++) {
                                    if (isConnected([i, j, k])) {
                                        spanningTrees.push([i, j, k]);
                                    }
                                }
                            }
                        }

                        var treeIdx = 0;

                        VizEngine.createButton(controls, 'Prev', function() {
                            treeIdx = (treeIdx - 1 + spanningTrees.length) % spanningTrees.length;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next', function() {
                            treeIdx = (treeIdx + 1) % spanningTrees.length;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Spanning Trees of K\u2084', viz.width / 2, 20, viz.colors.white, 15);
                            viz.screenText('Tree ' + (treeIdx + 1) + ' of ' + spanningTrees.length + '  (Cayley: 4^{4-2} = 16)', viz.width / 2, 42, viz.colors.text, 12);

                            // All edges (dim)
                            allEdges.forEach(function(e) {
                                ctx.strokeStyle = '#222244';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(nodes[e[0]].x, nodes[e[0]].y);
                                ctx.lineTo(nodes[e[1]].x, nodes[e[1]].y);
                                ctx.stroke();
                            });

                            // Highlighted spanning tree
                            var st = spanningTrees[treeIdx];
                            st.forEach(function(ei) {
                                var e = allEdges[ei];
                                ctx.strokeStyle = viz.colors.purple;
                                ctx.lineWidth = 4;
                                ctx.beginPath();
                                ctx.moveTo(nodes[e[0]].x, nodes[e[0]].y);
                                ctx.lineTo(nodes[e[1]].x, nodes[e[1]].y);
                                ctx.stroke();
                            });

                            // Nodes
                            nodes.forEach(function(nd) {
                                ctx.fillStyle = viz.colors.purple;
                                ctx.beginPath();
                                ctx.arc(nd.x, nd.y, 16, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(nd.label, nd.x, nd.y);
                            });

                            // Edge labels for current tree
                            var edgeStr = st.map(function(ei) {
                                return '{' + (allEdges[ei][0] + 1) + ',' + (allEdges[ei][1] + 1) + '}';
                            }).join(', ');
                            viz.screenText('Edges: ' + edgeStr, viz.width / 2, viz.height - 20, viz.colors.purple, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Apply Kruskal\'s algorithm to the graph with vertices \\(\\{A, B, C, D\\}\\) and edges \\(AB(3), AC(1), AD(4), BC(5), BD(2), CD(6)\\). List the MST edges in the order they are added.',
                    hint: 'Sort edges by weight: AC(1), BD(2), AB(3), AD(4), BC(5), CD(6). Add each if it does not create a cycle.',
                    solution: 'Sorted: AC(1), BD(2), AB(3), AD(4), BC(5), CD(6). Step 1: add AC (components: {A,C}, {B}, {D}). Step 2: add BD ({A,C}, {B,D}). Step 3: add AB ({A,B,C,D}). Now all vertices are connected with 3 edges. MST = {AC, BD, AB}, total weight = 1+2+3 = 6.'
                },
                {
                    question: 'How many spanning trees does the complete graph \\(K_5\\) have?',
                    hint: "Cayley's formula gives the answer directly.",
                    solution: "By Cayley's formula, \\(K_n\\) has \\(n^{n-2}\\) labeled spanning trees. For \\(K_5\\): \\(5^3 = 125\\)."
                }
            ]
        },

        // ================================================================
        // SECTION 5: Binary Tree Traversals
        // ================================================================
        {
            id: 'sec-binary',
            title: 'Binary Trees',
            content: `
<h2>Binary Tree Traversals</h2>

<p>A binary tree stores data at each vertex, and many algorithms need to visit every vertex in a systematic order. Three classical orderings, each defined recursively, produce different useful sequences.</p>

<div class="env-block definition">
    <div class="env-title">Definition 11.7 (Tree Traversals)</div>
    <div class="env-body">
        <p>Given a binary tree with root \\(r\\), left subtree \\(T_L\\), and right subtree \\(T_R\\):</p>
        <ul>
            <li><strong>Inorder:</strong> traverse \\(T_L\\), visit \\(r\\), traverse \\(T_R\\).</li>
            <li><strong>Preorder:</strong> visit \\(r\\), traverse \\(T_L\\), traverse \\(T_R\\).</li>
            <li><strong>Postorder:</strong> traverse \\(T_L\\), traverse \\(T_R\\), visit \\(r\\).</li>
        </ul>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Expression Tree</div>
    <div class="env-body">
        <p>The expression \\((3 + 4) \\times 2\\) is represented as a tree with \\(\\times\\) at the root, \\(+\\) as the left child, and \\(2\\) as the right child; \\(3\\) and \\(4\\) are children of \\(+\\).</p>
        <ul>
            <li><strong>Inorder:</strong> \\(3 + 4 \\times 2\\) (gives infix notation; needs parentheses for correct precedence)</li>
            <li><strong>Preorder:</strong> \\(\\times + 3 \\; 4 \\; 2\\) (Polish notation; no parentheses needed)</li>
            <li><strong>Postorder:</strong> \\(3 \\; 4 + 2 \\; \\times\\) (reverse Polish notation; used by calculators and stack machines)</li>
        </ul>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.6 (Reconstruction)</div>
    <div class="env-body">
        <p>A binary tree is uniquely determined by its inorder traversal together with either its preorder or postorder traversal. Neither preorder + postorder alone is sufficient in general.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof idea</div>
    <div class="env-body">
        <p>Preorder tells us the root (first element). The root's position in the inorder sequence splits it into left and right subtrees. Recurse on both halves. \\(\\square\\)</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-tree-traversal"></div>
<div class="viz-placeholder" data-viz="viz-expression-tree"></div>
`,
            visualizations: [
                {
                    id: 'viz-tree-traversal',
                    title: 'Binary Tree Traversal',
                    description: 'Watch inorder, preorder, and postorder traversals animate through a binary tree. The current node is highlighted and the traversal order is shown below.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Binary tree: nodes as array with left/right children
                        var treeNodes = [
                            {val: 'A', left: 1, right: 2},
                            {val: 'B', left: 3, right: 4},
                            {val: 'C', left: 5, right: 6},
                            {val: 'D', left: -1, right: -1},
                            {val: 'E', left: -1, right: -1},
                            {val: 'F', left: -1, right: -1},
                            {val: 'G', left: -1, right: -1}
                        ];

                        // Layout positions (x, y)
                        var positions = [
                            [280, 60],   // A (root)
                            [150, 150],  // B
                            [410, 150],  // C
                            [85, 240],   // D
                            [215, 240],  // E
                            [345, 240],  // F
                            [475, 240]   // G
                        ];

                        var traversalType = 'inorder';
                        var traversalOrder = [];
                        var step = 0;

                        function inorder(i, result) {
                            if (i < 0) return;
                            inorder(treeNodes[i].left, result);
                            result.push(i);
                            inorder(treeNodes[i].right, result);
                        }
                        function preorder(i, result) {
                            if (i < 0) return;
                            result.push(i);
                            preorder(treeNodes[i].left, result);
                            preorder(treeNodes[i].right, result);
                        }
                        function postorder(i, result) {
                            if (i < 0) return;
                            postorder(treeNodes[i].left, result);
                            postorder(treeNodes[i].right, result);
                            result.push(i);
                        }

                        function computeTraversal() {
                            traversalOrder = [];
                            if (traversalType === 'inorder') inorder(0, traversalOrder);
                            else if (traversalType === 'preorder') preorder(0, traversalOrder);
                            else postorder(0, traversalOrder);
                        }
                        computeTraversal();

                        var btnGroup = document.createElement('div');
                        btnGroup.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin-bottom:4px;';
                        ['inorder', 'preorder', 'postorder'].forEach(function(t) {
                            VizEngine.createButton(btnGroup, t.charAt(0).toUpperCase() + t.slice(1), function() {
                                traversalType = t;
                                step = 0;
                                computeTraversal();
                                draw();
                            });
                        });
                        controls.appendChild(btnGroup);

                        VizEngine.createButton(controls, 'Step', function() {
                            if (step < traversalOrder.length) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });
                        VizEngine.createButton(controls, 'Run All', function() { step = traversalOrder.length; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText(traversalType.charAt(0).toUpperCase() + traversalType.slice(1) + ' Traversal', viz.width / 2, 20, viz.colors.white, 15);

                            // Edges
                            treeNodes.forEach(function(nd, i) {
                                [nd.left, nd.right].forEach(function(child) {
                                    if (child >= 0) {
                                        ctx.strokeStyle = viz.colors.blue + '66';
                                        ctx.lineWidth = 2;
                                        ctx.beginPath();
                                        ctx.moveTo(positions[i][0], positions[i][1]);
                                        ctx.lineTo(positions[child][0], positions[child][1]);
                                        ctx.stroke();
                                    }
                                });
                            });

                            // Visited set
                            var visited = {};
                            for (var s = 0; s < step; s++) visited[traversalOrder[s]] = s + 1;
                            var current = step > 0 && step <= traversalOrder.length ? traversalOrder[step - 1] : -1;

                            // Nodes
                            treeNodes.forEach(function(nd, i) {
                                var px = positions[i][0], py = positions[i][1];
                                var isVisited = visited[i] !== undefined;
                                var isCurrent = i === current;

                                if (isCurrent) {
                                    ctx.fillStyle = viz.colors.orange + '44';
                                    ctx.beginPath();
                                    ctx.arc(px, py, 24, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                ctx.fillStyle = isVisited ? viz.colors.green : viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(px, py, 18, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(nd.val, px, py);

                                if (isVisited) {
                                    ctx.fillStyle = viz.colors.yellow;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillText(visited[i].toString(), px + 20, py - 14);
                                }
                            });

                            // Traversal sequence so far
                            var seq = '';
                            for (var s = 0; s < step && s < traversalOrder.length; s++) {
                                if (s > 0) seq += ', ';
                                seq += treeNodes[traversalOrder[s]].val;
                            }
                            viz.screenText('Order: ' + (seq || '(click Step)'), viz.width / 2, viz.height - 60, viz.colors.white, 13);

                            // Mnemonic
                            var mnemonics = {
                                inorder: 'Left, Root, Right',
                                preorder: 'Root, Left, Right',
                                postorder: 'Left, Right, Root'
                            };
                            viz.screenText('Rule: ' + mnemonics[traversalType], viz.width / 2, viz.height - 38, viz.colors.text, 11);
                            viz.screenText('Step ' + step + '/' + traversalOrder.length, viz.width / 2, viz.height - 18, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-expression-tree',
                    title: 'Expression Tree',
                    description: 'An arithmetic expression represented as a tree. Watch it evaluate bottom-up (postorder), with each subtree computing its value.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Expression: (3 + 4) * (8 - 2)
                        var exprNodes = [
                            {val: '*', left: 1, right: 2, computed: null},
                            {val: '+', left: 3, right: 4, computed: null},
                            {val: '-', left: 5, right: 6, computed: null},
                            {val: '3', left: -1, right: -1, computed: 3},
                            {val: '4', left: -1, right: -1, computed: 4},
                            {val: '8', left: -1, right: -1, computed: 8},
                            {val: '2', left: -1, right: -1, computed: 2}
                        ];

                        var positions = [
                            [280, 60],   // *
                            [150, 160],  // +
                            [410, 160],  // -
                            [85, 260],   // 3
                            [215, 260],  // 4
                            [345, 260],  // 8
                            [475, 260]   // 2
                        ];

                        // Postorder evaluation steps
                        var evalOrder = [3, 4, 1, 5, 6, 2, 0]; // postorder: 3,4,+,8,2,-,*
                        var step = 0;
                        var computedVals = {};

                        function applyOp(op, l, r) {
                            if (op === '+') return l + r;
                            if (op === '-') return l - r;
                            if (op === '*') return l * r;
                            if (op === '/') return r === 0 ? NaN : l / r;
                            return NaN;
                        }

                        function computeUpTo(s) {
                            computedVals = {};
                            // Leaves are always computed
                            for (var i = 0; i < exprNodes.length; i++) {
                                if (exprNodes[i].left === -1) computedVals[i] = exprNodes[i].computed;
                            }
                            for (var i = 0; i < s && i < evalOrder.length; i++) {
                                var idx = evalOrder[i];
                                var nd = exprNodes[idx];
                                if (nd.left >= 0 && computedVals[nd.left] !== undefined && computedVals[nd.right] !== undefined) {
                                    computedVals[idx] = applyOp(nd.val, computedVals[nd.left], computedVals[nd.right]);
                                }
                            }
                        }

                        VizEngine.createButton(controls, 'Step', function() {
                            if (step < evalOrder.length) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });
                        VizEngine.createButton(controls, 'Evaluate All', function() { step = evalOrder.length; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            computeUpTo(step);

                            viz.screenText('Expression: (3 + 4) \u00d7 (8 - 2)', viz.width / 2, 20, viz.colors.white, 15);

                            // Edges
                            exprNodes.forEach(function(nd, i) {
                                [nd.left, nd.right].forEach(function(child) {
                                    if (child >= 0) {
                                        ctx.strokeStyle = viz.colors.blue + '55';
                                        ctx.lineWidth = 2;
                                        ctx.beginPath();
                                        ctx.moveTo(positions[i][0], positions[i][1]);
                                        ctx.lineTo(positions[child][0], positions[child][1]);
                                        ctx.stroke();
                                    }
                                });
                            });

                            // Current node
                            var current = step > 0 && step <= evalOrder.length ? evalOrder[step - 1] : -1;

                            // Nodes
                            exprNodes.forEach(function(nd, i) {
                                var px = positions[i][0], py = positions[i][1];
                                var hasVal = computedVals[i] !== undefined;
                                var isCurrent = i === current;
                                var isOp = nd.left >= 0;

                                if (isCurrent) {
                                    ctx.fillStyle = viz.colors.orange + '44';
                                    ctx.beginPath();
                                    ctx.arc(px, py, 28, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                ctx.fillStyle = hasVal ? (isOp ? viz.colors.teal : viz.colors.green) : viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(px, py, 20, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(nd.val, px, py);

                                if (hasVal && isOp) {
                                    ctx.fillStyle = viz.colors.yellow;
                                    ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.fillText('= ' + computedVals[i], px, py + 30);
                                }
                            });

                            // Notations
                            viz.screenText('Postorder (RPN): 3  4  +  8  2  -  \u00d7', viz.width / 2, viz.height - 50, viz.colors.text, 11);
                            viz.screenText('Preorder (PN): \u00d7  +  3  4  -  8  2', viz.width / 2, viz.height - 34, viz.colors.text, 11);
                            var resultText = computedVals[0] !== undefined ? 'Result = ' + computedVals[0] : 'Step through to evaluate';
                            viz.screenText(resultText, viz.width / 2, viz.height - 14, computedVals[0] !== undefined ? viz.colors.green : viz.colors.text, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Given a binary tree with inorder traversal D B E A F C G and preorder traversal A B D E C F G, draw the tree.',
                    hint: 'Preorder tells you the root (A). Find A in the inorder sequence to split into left subtree {D,B,E} and right subtree {F,C,G}. Recurse.',
                    solution: 'Root = A. Left subtree has inorder D B E and preorder B D E, so B is root of left subtree with left child D and right child E. Right subtree has inorder F C G and preorder C F G, so C is root with left child F and right child G. The tree has A at root, B and C as children, D-E under B, F-G under C.'
                },
                {
                    question: 'Write the postorder traversal of the tree from the previous exercise.',
                    hint: 'Postorder visits left subtree, right subtree, then root.',
                    solution: 'Left subtree postorder: D E B. Right subtree postorder: F G C. Full postorder: D E B F G C A.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Cayley's Formula
        // ================================================================
        {
            id: 'sec-cayley',
            title: "Cayley's Formula",
            content: `
<h2>Cayley's Formula</h2>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.7 (Cayley's Formula, 1889)</div>
    <div class="env-body">
        <p>The number of labeled trees on \\(n\\) vertices is \\(n^{n-2}\\).</p>
    </div>
</div>

<p>This beautiful formula counts trees where each vertex has a distinct label (say \\(1, 2, \\ldots, n\\)). For small \\(n\\): \\(n = 1\\) gives \\(1^{-1} = 1\\) tree (trivial); \\(n = 2\\) gives \\(2^0 = 1\\); \\(n = 3\\) gives \\(3^1 = 3\\); \\(n = 4\\) gives \\(4^2 = 16\\).</p>

<p>There are many proofs. We present one via Prufer sequences, which also gives a constructive bijection.</p>

<h3>Prufer Sequences</h3>

<div class="env-block definition">
    <div class="env-title">Definition 11.8 (Prufer Sequence)</div>
    <div class="env-body">
        <p>The <strong>Prufer sequence</strong> of a labeled tree on \\(\\{1, 2, \\ldots, n\\}\\) is a sequence of length \\(n - 2\\) constructed as follows:</p>
        <ol>
            <li>Find the leaf with the smallest label.</li>
            <li>Record the label of its neighbor (the next entry in the sequence).</li>
            <li>Remove this leaf and its edge.</li>
            <li>Repeat until only 2 vertices remain.</li>
        </ol>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Consider the tree on \\(\\{1,2,3,4,5\\}\\) with edges \\(\\{1,3\\}, \\{2,3\\}, \\{3,4\\}, \\{4,5\\}\\).</p>
        <ul>
            <li>Smallest leaf: 1. Neighbor: 3. Sequence so far: (3). Remove vertex 1.</li>
            <li>Smallest leaf: 2. Neighbor: 3. Sequence: (3, 3). Remove vertex 2.</li>
            <li>Smallest leaf: 3. Neighbor: 4. Sequence: (3, 3, 4). Remove vertex 3.</li>
        </ul>
        <p>Two vertices remain (4, 5). Prufer sequence: \\((3, 3, 4)\\). Length = \\(5 - 2 = 3\\). \\(\\checkmark\\)</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.8 (Prufer Bijection)</div>
    <div class="env-body">
        <p>The Prufer encoding is a bijection between labeled trees on \\(\\{1, \\ldots, n\\}\\) and sequences in \\(\\{1, \\ldots, n\\}^{n-2}\\). Since there are \\(n^{n-2}\\) such sequences, there are \\(n^{n-2}\\) labeled trees.</p>
    </div>
</div>

<h3>Decoding a Prufer Sequence</h3>

<div class="env-block definition">
    <div class="env-title">Algorithm: Prufer Decode</div>
    <div class="env-body">
        <p>Given a Prufer sequence \\((a_1, a_2, \\ldots, a_{n-2})\\) over \\(\\{1, \\ldots, n\\}\\):</p>
        <ol>
            <li>Let \\(L = \\{1, 2, \\ldots, n\\}\\) be the set of available vertices.</li>
            <li>For \\(i = 1\\) to \\(n - 2\\): find the smallest element \\(v \\in L\\) not appearing in \\((a_i, a_{i+1}, \\ldots, a_{n-2})\\). Add edge \\(\\{v, a_i\\}\\). Remove \\(v\\) from \\(L\\).</li>
            <li>Add an edge between the two remaining elements of \\(L\\).</li>
        </ol>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Degree Information</div>
    <div class="env-body">
        <p>A useful corollary: vertex \\(k\\) appears in the Prufer sequence exactly \\(\\deg(k) - 1\\) times. In particular, leaves are exactly the vertices that do not appear in the sequence.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-prufer-sequence"></div>
`,
            visualizations: [
                {
                    id: 'viz-prufer-sequence',
                    title: 'Prufer Sequence Bijection',
                    description: 'Watch the encoding of a labeled tree into its Prufer sequence step by step, then decode it back. Edit the tree or sequence to explore the bijection.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 6;
                        // Tree on {1,...,6}: edges give Prufer sequence [4, 4, 4, 5]
                        var treeEdges = [[1,4],[2,4],[3,4],[4,5],[5,6]];
                        var pruferSeq = [];
                        var encodeStep = 0;
                        var maxEncodeSteps;

                        // Positions for nodes (circle layout)
                        function nodePos(i) {
                            var angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
                            var cx = 170, cy = 200, r = 100;
                            return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
                        }

                        function encode(edges, numV) {
                            var steps = [];
                            var adj = {};
                            for (var i = 1; i <= numV; i++) adj[i] = [];
                            edges.forEach(function(e) {
                                adj[e[0]].push(e[1]);
                                adj[e[1]].push(e[0]);
                            });
                            var removed = {};
                            var seq = [];
                            for (var s = 0; s < numV - 2; s++) {
                                // Find smallest leaf
                                var leaf = -1;
                                for (var v = 1; v <= numV; v++) {
                                    if (removed[v]) continue;
                                    var deg = 0;
                                    adj[v].forEach(function(u) { if (!removed[u]) deg++; });
                                    if (deg === 1) { leaf = v; break; }
                                }
                                // Find neighbor
                                var neighbor = -1;
                                adj[leaf].forEach(function(u) { if (!removed[u]) neighbor = u; });
                                seq.push(neighbor);
                                steps.push({leaf: leaf, neighbor: neighbor, seq: seq.slice()});
                                removed[leaf] = true;
                            }
                            return {seq: seq, steps: steps};
                        }

                        var result = encode(treeEdges, n);
                        pruferSeq = result.seq;
                        maxEncodeSteps = result.steps.length;

                        VizEngine.createButton(controls, 'Step Encode', function() {
                            if (encodeStep < maxEncodeSteps) { encodeStep++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() { encodeStep = 0; draw(); });
                        VizEngine.createButton(controls, 'Full Encode', function() { encodeStep = maxEncodeSteps; draw(); });

                        // Preset trees
                        var presets = [
                            {label: 'Star', edges: [[1,2],[1,3],[1,4],[1,5],[1,6]]},
                            {label: 'Path', edges: [[1,2],[2,3],[3,4],[4,5],[5,6]]},
                            {label: 'Y-shape', edges: [[1,4],[2,4],[3,4],[4,5],[5,6]]}
                        ];
                        var presetGroup = document.createElement('div');
                        presetGroup.style.cssText = 'display:flex;gap:4px;margin-top:4px;';
                        presets.forEach(function(p) {
                            VizEngine.createButton(presetGroup, p.label, function() {
                                treeEdges = p.edges;
                                result = encode(treeEdges, n);
                                pruferSeq = result.seq;
                                maxEncodeSteps = result.steps.length;
                                encodeStep = 0;
                                draw();
                            });
                        });
                        controls.appendChild(presetGroup);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Prufer Sequence Encoding', viz.width / 2, 20, viz.colors.white, 15);

                            // Removed nodes so far
                            var removed = {};
                            for (var s = 0; s < encodeStep && s < result.steps.length; s++) {
                                removed[result.steps[s].leaf] = true;
                            }

                            // Draw tree edges
                            treeEdges.forEach(function(e) {
                                var p1 = nodePos(e[0] - 1), p2 = nodePos(e[1] - 1);
                                var bothAlive = !removed[e[0]] && !removed[e[1]];
                                ctx.strokeStyle = bothAlive ? viz.colors.blue + 'aa' : '#333355';
                                ctx.lineWidth = bothAlive ? 2 : 1;
                                ctx.beginPath();
                                ctx.moveTo(p1[0], p1[1]);
                                ctx.lineTo(p2[0], p2[1]);
                                ctx.stroke();
                            });

                            // Draw nodes
                            for (var i = 1; i <= n; i++) {
                                var pos = nodePos(i - 1);
                                var isRemoved = removed[i];
                                var isCurrent = encodeStep > 0 && encodeStep <= result.steps.length && result.steps[encodeStep - 1].leaf === i;

                                if (isCurrent) {
                                    ctx.fillStyle = viz.colors.red + '44';
                                    ctx.beginPath();
                                    ctx.arc(pos[0], pos[1], 24, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                ctx.fillStyle = isRemoved ? '#444' : viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(pos[0], pos[1], 16, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.fillStyle = isRemoved ? '#666' : viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), pos[0], pos[1]);
                            }

                            // Prufer sequence display
                            var seqSoFar = encodeStep > 0 ? result.steps[Math.min(encodeStep, maxEncodeSteps) - 1].seq : [];
                            var seqStr = '(' + (seqSoFar.length > 0 ? seqSoFar.join(', ') : '') + ')';
                            if (encodeStep < maxEncodeSteps) {
                                for (var p = seqSoFar.length; p < n - 2; p++) seqStr = seqStr.slice(0, -1) + (seqSoFar.length > 0 || p > 0 ? ', _' : '_') + ')';
                            }

                            // Right panel
                            var rx = 360;
                            viz.screenText('Prufer Sequence:', rx, 70, viz.colors.text, 12);
                            viz.screenText(seqStr, rx, 95, viz.colors.yellow, 16);

                            viz.screenText('Step ' + encodeStep + '/' + maxEncodeSteps, rx, 130, viz.colors.text, 11);

                            if (encodeStep > 0 && encodeStep <= result.steps.length) {
                                var st = result.steps[encodeStep - 1];
                                viz.screenText('Remove leaf ' + st.leaf, rx, 160, viz.colors.red, 12);
                                viz.screenText('Record neighbor ' + st.neighbor, rx, 180, viz.colors.green, 12);
                            }

                            // Full sequence at bottom
                            viz.screenText('Full Prufer sequence: (' + pruferSeq.join(', ') + ')', viz.width / 2, viz.height - 50, viz.colors.purple, 12);
                            viz.screenText('n = ' + n + ', sequence length = ' + (n - 2) + ', total labeled trees = ' + n + '^' + (n - 2) + ' = ' + Math.pow(n, n - 2), viz.width / 2, viz.height - 28, viz.colors.text, 11);

                            // Degree info
                            var degInfo = '';
                            for (var v = 1; v <= n; v++) {
                                var cnt = 0;
                                pruferSeq.forEach(function(x) { if (x === v) cnt++; });
                                degInfo += v + ':' + (cnt + 1) + ' ';
                            }
                            viz.screenText('Degrees: ' + degInfo, viz.width / 2, viz.height - 8, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the Prufer sequence of the tree on \\(\\{1,2,3,4,5,6\\}\\) with edges \\(\\{1,2\\}, \\{2,3\\}, \\{3,4\\}, \\{4,5\\}, \\{5,6\\}\\) (a path).',
                    hint: 'Repeatedly remove the smallest leaf and record its neighbor.',
                    solution: 'Step 1: leaf 1, neighbor 2. Step 2: leaf 2, neighbor 3. Step 3: leaf 3, neighbor 4. Step 4: leaf 4, neighbor 5. Remaining: {5,6}. Prufer sequence: (2, 3, 4, 5).'
                },
                {
                    question: 'Decode the Prufer sequence \\((3, 3, 3)\\) on \\(\\{1,2,3,4,5\\}\\) into a tree.',
                    hint: 'At each step, find the smallest label not in the remaining sequence and not yet removed.',
                    solution: 'Available: {1,2,3,4,5}. Remaining seq: (3,3,3). Smallest not in {3,3,3}: 1. Edge {1,3}. Remove 1. Remaining seq: (3,3). Smallest from {2,3,4,5} not in {3,3}: 2. Edge {2,3}. Remove 2. Remaining seq: (3). Smallest from {3,4,5} not in {3}: 4. Edge {4,3}. Remove 4. Last two: {3,5}. Edge {3,5}. Tree edges: {1,3}, {2,3}, {4,3}, {3,5}. This is a star centered at 3 with an extra edge to 5.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to Graph Algorithms
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead</h2>

<p>Trees are the scaffolding on which much of graph theory and algorithm design rests. In this chapter we established:</p>

<ul>
    <li>The equivalence of multiple characterizations of trees (connected + acyclic, \\(n - 1\\) edges, unique paths, every edge a bridge).</li>
    <li>Rooted trees and the hierarchy they impose: parent-child relationships, depth, height, and the \\(m\\)-ary tree family.</li>
    <li>Spanning trees as minimal connected subgraphs, and efficient greedy algorithms (Kruskal, Prim) for finding minimum spanning trees.</li>
    <li>Traversal orders (inorder, preorder, postorder) and their applications to expression evaluation and tree reconstruction.</li>
    <li>Cayley's formula \\(n^{n-2}\\) for counting labeled trees, proved via the Prufer sequence bijection.</li>
</ul>

<h3>What Comes Next</h3>

<p>In the next chapter on <strong>Graph Algorithms</strong>, we will use trees as subroutines and organizing structures:</p>

<ul>
    <li><strong>BFS and DFS trees.</strong> Breadth-first and depth-first search each produce a spanning tree that reveals structural information about the graph (shortest paths, connected components, bipartiteness for BFS; back edges, articulation points, strongly connected components for DFS).</li>
    <li><strong>Shortest path trees.</strong> Dijkstra's algorithm maintains a tree of shortest paths from a source.</li>
    <li><strong>Network flow.</strong> Augmenting paths in flow networks can be found via tree-structured searches.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Recurring Theme</div>
    <div class="env-body">
        <p>Trees are the "just right" graphs: connected enough to reach everywhere, sparse enough to have no redundancy. Every algorithm that needs to explore or organize a graph eventually builds a tree. Understanding trees deeply is prerequisite to understanding algorithms.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Prove that a graph \\(G\\) is a forest if and only if every edge of \\(G\\) is a bridge.',
                    hint: 'A bridge is an edge whose removal increases the number of connected components. Relate this to the presence or absence of cycles.',
                    solution: '(\\(\\Rightarrow\\)) If \\(G\\) is a forest, each component is a tree. In a tree, every edge is a bridge (removing it disconnects the component). (\\(\\Leftarrow\\)) If every edge is a bridge, \\(G\\) has no cycles: if a cycle existed, any edge in the cycle would not be a bridge (the two endpoints remain connected via the rest of the cycle). So \\(G\\) is acyclic, i.e., a forest.'
                },
                {
                    question: 'A connected graph \\(G\\) has 10 vertices and 12 edges. How many edges must be removed to obtain a spanning tree? Can different choices of removed edges give different spanning trees?',
                    hint: 'A spanning tree has \\(n - 1\\) edges.',
                    solution: 'A spanning tree has \\(10 - 1 = 9\\) edges, so \\(12 - 9 = 3\\) edges must be removed. Different choices of which 3 edges to remove (as long as connectivity is maintained) generally yield different spanning trees. The number of distinct spanning trees can be computed via Kirchhoff\'s matrix tree theorem.'
                }
            ]
        }
    ]
});
