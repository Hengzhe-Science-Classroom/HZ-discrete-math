window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch04',
    number: 4,
    title: 'Relations',
    subtitle: 'Connections between elements',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Relations?',
            content: `
<h2>Why Relations?</h2>

<div class="env-block intuition">
    <div class="env-title">Connections Are Everywhere</div>
    <div class="env-body">
        <p>Mathematics is not only about objects, but about the <strong>connections</strong> between them. "3 divides 12." "Alice is older than Bob." "City A is connected to city B by a road." Each of these statements asserts a relationship between two things. A <em>relation</em> is the formal tool for capturing such connections.</p>
    </div>
</div>

<p>In Chapter 3, we studied sets as collections of objects. Now we ask: what structure can we impose on a set by specifying which pairs of elements are "related"? The answer, binary relations, is one of the most versatile concepts in mathematics. Relations unify a remarkable range of ideas:</p>

<ul>
    <li><strong>Equality</strong> on any set is a relation (and, as we will see, an equivalence relation).</li>
    <li><strong>Less-than-or-equal</strong> on the integers is a relation (and a partial order).</li>
    <li><strong>Divisibility</strong> on the positive integers is a relation (and also a partial order).</li>
    <li><strong>Congruence modulo \\(n\\)</strong> is a relation (and an equivalence relation that partitions \\(\\mathbb{Z}\\) into \\(n\\) classes).</li>
    <li><strong>Database tables</strong> are relations in the technical sense: a table with \\(k\\) columns is a subset of a \\(k\\)-fold Cartesian product.</li>
    <li><strong>Directed graphs</strong> are nothing but relations on a vertex set.</li>
</ul>

<p>This chapter builds the theory in layers. We start with the bare definition, then identify special properties (reflexive, symmetric, transitive, ...) that distinguish the two most important species: <em>equivalence relations</em> (which partition sets into classes) and <em>partial orders</em> (which arrange elements in a hierarchy). We close with closures and Warshall's algorithm for computing the transitive closure efficiently.</p>

<h3>A Guiding Example</h3>

<p>Consider the set \\(A = \\{1, 2, 3, 4, 6, 12\\}\\) with the "divides" relation: we say \\(a \\mid b\\) if \\(b/a\\) is an integer. This single relation encodes a rich structure: it is reflexive (every number divides itself), antisymmetric (if \\(a \\mid b\\) and \\(b \\mid a\\) for positive integers, then \\(a = b\\)), and transitive (if \\(a \\mid b\\) and \\(b \\mid c\\), then \\(a \\mid c\\)). These three properties make it a partial order. The Hasse diagram of this order reveals the factor lattice of 12, a structure we will visualize later in this chapter.</p>

<div class="env-block remark">
    <div class="env-title">Notation</div>
    <div class="env-body">
        <p>We write \\(a \\mathrel{R} b\\) or \\((a, b) \\in R\\) to mean "\\(a\\) is related to \\(b\\) under \\(R\\)." The two notations are interchangeable, but the first is more common in prose and the second when we think of \\(R\\) as a set of ordered pairs.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Binary Relations
        // ================================================================
        {
            id: 'sec-definition',
            title: 'Binary Relations',
            content: `
<h2>Binary Relations</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Binary Relation)</div>
    <div class="env-body">
        <p>Let \\(A\\) and \\(B\\) be sets. A <strong>binary relation</strong> from \\(A\\) to \\(B\\) is a subset \\(R \\subseteq A \\times B\\). If \\((a, b) \\in R\\), we write \\(a \\mathrel{R} b\\) and say "\\(a\\) is related to \\(b\\)."</p>
        <p>When \\(A = B\\), we call \\(R\\) a <strong>relation on</strong> \\(A\\).</p>
    </div>
</div>

<p>A relation from \\(A\\) to \\(B\\) is simply a set of ordered pairs, one element from \\(A\\) and one from \\(B\\). There is no requirement that every element of \\(A\\) or \\(B\\) appear; the relation can be empty (no pairs) or all of \\(A \\times B\\) (every pair).</p>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Let \\(A = \\{1, 2, 3\\}\\) and \\(B = \\{a, b\\}\\). Then \\(R = \\{(1, a), (2, b), (3, a)\\}\\) is a relation from \\(A\\) to \\(B\\). We have \\(1 \\mathrel{R} a\\) and \\(3 \\mathrel{R} a\\), but not \\(1 \\mathrel{R} b\\).</p>
    </div>
</div>

<h3>Representations</h3>

<p>For a relation \\(R\\) on a finite set \\(A = \\{a_1, a_2, \\ldots, a_n\\}\\), there are two standard representations beyond listing pairs:</p>

<h4>1. The Relation Matrix</h4>

<p>The <strong>relation matrix</strong> (or Boolean matrix) \\(M_R\\) is the \\(n \\times n\\) matrix where</p>
\\[
(M_R)_{ij} = \\begin{cases} 1 & \\text{if } a_i \\mathrel{R} a_j, \\\\ 0 & \\text{otherwise.} \\end{cases}
\\]

<div class="env-block example">
    <div class="env-title">Example: Matrix of "divides" on \\(\\{1, 2, 3, 4\\}\\)</div>
    <div class="env-body">
        <p>With the "divides" relation \\(a \\mid b\\):</p>
        \\[
        M_R = \\begin{pmatrix}
        1 & 1 & 1 & 1 \\\\
        0 & 1 & 0 & 1 \\\\
        0 & 0 & 1 & 0 \\\\
        0 & 0 & 0 & 1
        \\end{pmatrix}
        \\]
        <p>Row \\(i\\), column \\(j\\) is 1 if \\(i \\mid j\\). For instance, \\(M_{1,4} = 1\\) because \\(1 \\mid 4\\), and \\(M_{3,4} = 0\\) because \\(3 \\nmid 4\\).</p>
    </div>
</div>

<h4>2. The Directed Graph (Digraph)</h4>

<p>The <strong>digraph</strong> of \\(R\\) has the elements of \\(A\\) as vertices and a directed edge (arrow) from \\(a_i\\) to \\(a_j\\) whenever \\(a_i \\mathrel{R} a_j\\). If \\(a_i \\mathrel{R} a_i\\), the vertex has a <em>self-loop</em>.</p>

<div class="env-block remark">
    <div class="env-title">Matrix-Digraph Dictionary</div>
    <div class="env-body">
        <p>The matrix and digraph carry exactly the same information. A 1 in row \\(i\\), column \\(j\\) of the matrix corresponds to an arrow from vertex \\(i\\) to vertex \\(j\\) in the digraph. The matrix is better for computation; the digraph is better for visual intuition.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-relation-matrix"></div>
<div class="viz-placeholder" data-viz="viz-digraph"></div>

<h3>Operations on Relations</h3>

<p>Since relations are sets, we can take their union, intersection, and complement. Additionally:</p>

<div class="env-block definition">
    <div class="env-title">Definition (Inverse and Composition)</div>
    <div class="env-body">
        <p>Let \\(R\\) be a relation from \\(A\\) to \\(B\\) and \\(S\\) a relation from \\(B\\) to \\(C\\).</p>
        <ul>
            <li><strong>Inverse:</strong> \\(R^{-1} = \\{(b, a) \\mid (a, b) \\in R\\}\\).</li>
            <li><strong>Composition:</strong> \\(S \\circ R = \\{(a, c) \\mid \\exists b \\in B : (a, b) \\in R \\text{ and } (b, c) \\in S\\}\\).</li>
        </ul>
        <p>In terms of matrices, \\(M_{R^{-1}} = M_R^T\\) (transpose), and \\(M_{S \\circ R}\\) is the Boolean matrix product of \\(M_R\\) and \\(M_S\\).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-relation-matrix',
                    title: 'Relation Matrix Explorer',
                    description: 'Click cells to toggle the relation. The properties (reflexive, symmetric, antisymmetric, transitive) are checked automatically.',
                    setup: function(body, controls) {
                        var n = 4;
                        var labels = ['1', '2', '3', '4'];
                        // Initialize with divides relation
                        var matrix = [];
                        for (var i = 0; i < n; i++) {
                            matrix[i] = [];
                            for (var j = 0; j < n; j++) {
                                matrix[i][j] = ((j + 1) % (i + 1) === 0) ? 1 : 0;
                            }
                        }

                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        VizEngine.createButton(controls, 'Divides', function() {
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++)
                                    matrix[i][j] = ((j + 1) % (i + 1) === 0) ? 1 : 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Less-equal', function() {
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++)
                                    matrix[i][j] = (i <= j) ? 1 : 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Equality', function() {
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++)
                                    matrix[i][j] = (i === j) ? 1 : 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Clear', function() {
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++)
                                    matrix[i][j] = 0;
                            draw();
                        });

                        function checkProperties() {
                            var reflexive = true, symmetric = true, antisymmetric = true, transitive = true;
                            for (var i = 0; i < n; i++) {
                                if (!matrix[i][i]) reflexive = false;
                                for (var j = 0; j < n; j++) {
                                    if (matrix[i][j] && !matrix[j][i]) symmetric = false;
                                    if (i !== j && matrix[i][j] && matrix[j][i]) antisymmetric = false;
                                    if (matrix[i][j]) {
                                        for (var k = 0; k < n; k++) {
                                            if (matrix[j][k] && !matrix[i][k]) transitive = false;
                                        }
                                    }
                                }
                            }
                            return { reflexive: reflexive, symmetric: symmetric, antisymmetric: antisymmetric, transitive: transitive };
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var cellSize = 50;
                            var startX = 100;
                            var startY = 60;
                            var col = Math.floor((mx - startX) / cellSize);
                            var row = Math.floor((my - startY) / cellSize);
                            if (row >= 0 && row < n && col >= 0 && col < n) {
                                matrix[row][col] = 1 - matrix[row][col];
                                draw();
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cellSize = 50;
                            var startX = 100;
                            var startY = 60;

                            viz.screenText('Relation Matrix (click to toggle)', viz.width / 2, 20, viz.colors.white, 14);

                            // Column labels
                            for (var j = 0; j < n; j++) {
                                viz.screenText(labels[j], startX + j * cellSize + cellSize / 2, startY - 12, viz.colors.teal, 13);
                            }
                            // Row labels
                            for (var i = 0; i < n; i++) {
                                viz.screenText(labels[i], startX - 18, startY + i * cellSize + cellSize / 2, viz.colors.blue, 13);
                            }

                            // Grid cells
                            for (var i = 0; i < n; i++) {
                                for (var j = 0; j < n; j++) {
                                    var x = startX + j * cellSize;
                                    var y = startY + i * cellSize;
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(x, y, cellSize, cellSize);
                                    if (matrix[i][j]) {
                                        ctx.fillStyle = (i === j) ? viz.colors.teal + '44' : viz.colors.blue + '33';
                                        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.font = 'bold 16px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText('1', x + cellSize / 2, y + cellSize / 2);
                                    } else {
                                        ctx.fillStyle = viz.colors.text + '44';
                                        ctx.font = '14px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText('0', x + cellSize / 2, y + cellSize / 2);
                                    }
                                }
                            }

                            // Properties panel
                            var props = checkProperties();
                            var propY = startY + n * cellSize + 30;
                            var propNames = ['Reflexive', 'Symmetric', 'Antisymmetric', 'Transitive'];
                            var propVals = [props.reflexive, props.symmetric, props.antisymmetric, props.transitive];
                            var propColors = [viz.colors.teal, viz.colors.blue, viz.colors.orange, viz.colors.purple];
                            for (var p = 0; p < 4; p++) {
                                var px = 60 + p * 125;
                                ctx.fillStyle = propVals[p] ? propColors[p] : viz.colors.text + '55';
                                ctx.font = (propVals[p] ? 'bold ' : '') + '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText((propVals[p] ? '\u2713 ' : '\u2717 ') + propNames[p], px, propY);
                            }

                            // Summary
                            var isEq = props.reflexive && props.symmetric && props.transitive;
                            var isPO = props.reflexive && props.antisymmetric && props.transitive;
                            var summary = '';
                            if (isEq && isPO) summary = 'Equivalence Relation + Partial Order (must be equality)';
                            else if (isEq) summary = 'Equivalence Relation';
                            else if (isPO) summary = 'Partial Order';
                            if (summary) {
                                viz.screenText(summary, viz.width / 2, propY + 30, viz.colors.green, 13);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-digraph',
                    title: 'Relation as Directed Graph',
                    description: 'Drag the nodes to rearrange the digraph. Toggle edges by clicking the matrix on the left. Self-loops appear as small circles on vertices.',
                    setup: function(body, controls) {
                        var n = 4;
                        var labels = ['1', '2', '3', '4'];
                        var matrix = [];
                        for (var i = 0; i < n; i++) {
                            matrix[i] = [];
                            for (var j = 0; j < n; j++) {
                                matrix[i][j] = ((j + 1) % (i + 1) === 0) ? 1 : 0;
                            }
                        }

                        // Node positions in screen coords
                        var nodeRadius = 20;
                        var cx = 380, cy = 200;
                        var nodeR = 100;
                        var nodes = [];
                        for (var i = 0; i < n; i++) {
                            var angle = -Math.PI / 2 + i * 2 * Math.PI / n;
                            nodes.push({ x: cx + nodeR * Math.cos(angle), y: cy + nodeR * Math.sin(angle) });
                        }

                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var dragNode = -1;

                        viz.canvas.addEventListener('mousedown', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            // Check mini matrix click
                            var miniX = 20, miniY = 60, miniCell = 28;
                            var col = Math.floor((mx - miniX) / miniCell);
                            var row = Math.floor((my - miniY) / miniCell);
                            if (row >= 0 && row < n && col >= 0 && col < n) {
                                matrix[row][col] = 1 - matrix[row][col];
                                draw();
                                return;
                            }

                            // Check node drag
                            for (var i = 0; i < n; i++) {
                                var dx = mx - nodes[i].x, dy = my - nodes[i].y;
                                if (dx * dx + dy * dy < nodeRadius * nodeRadius * 2) {
                                    dragNode = i;
                                    e.preventDefault();
                                    return;
                                }
                            }
                        });

                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (dragNode < 0) return;
                            e.preventDefault();
                            var rect = viz.canvas.getBoundingClientRect();
                            nodes[dragNode].x = e.clientX - rect.left;
                            nodes[dragNode].y = e.clientY - rect.top;
                            draw();
                        });

                        viz.canvas.addEventListener('mouseup', function() { dragNode = -1; });
                        viz.canvas.addEventListener('mouseleave', function() { dragNode = -1; });

                        // Touch support
                        viz.canvas.addEventListener('touchstart', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.touches[0].clientX - rect.left;
                            var my = e.touches[0].clientY - rect.top;
                            for (var i = 0; i < n; i++) {
                                var dx = mx - nodes[i].x, dy = my - nodes[i].y;
                                if (dx * dx + dy * dy < nodeRadius * nodeRadius * 3) {
                                    dragNode = i;
                                    e.preventDefault();
                                    return;
                                }
                            }
                        }, { passive: false });
                        viz.canvas.addEventListener('touchmove', function(e) {
                            if (dragNode < 0) return;
                            e.preventDefault();
                            var rect = viz.canvas.getBoundingClientRect();
                            nodes[dragNode].x = e.touches[0].clientX - rect.left;
                            nodes[dragNode].y = e.touches[0].clientY - rect.top;
                            draw();
                        }, { passive: false });
                        viz.canvas.addEventListener('touchend', function() { dragNode = -1; });

                        VizEngine.createButton(controls, 'Divides', function() {
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++)
                                    matrix[i][j] = ((j + 1) % (i + 1) === 0) ? 1 : 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Cycle', function() {
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++)
                                    matrix[i][j] = (j === (i + 1) % n) ? 1 : 0;
                            draw();
                        });

                        function drawArrow(ctx, x1, y1, x2, y2, color) {
                            var dx = x2 - x1, dy = y2 - y1;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            if (len < 1) return;
                            var ux = dx / len, uy = dy / len;
                            var sx = x1 + ux * nodeRadius;
                            var sy = y1 + uy * nodeRadius;
                            var ex = x2 - ux * (nodeRadius + 6);
                            var ey = y2 - uy * (nodeRadius + 6);

                            ctx.strokeStyle = color;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(ex, ey);
                            ctx.stroke();

                            // Arrowhead
                            var angle = Math.atan2(ey - sy, ex - sx);
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.moveTo(ex + 6 * Math.cos(angle), ey + 6 * Math.sin(angle));
                            ctx.lineTo(ex - 10 * Math.cos(angle - Math.PI / 6), ey - 10 * Math.sin(angle - Math.PI / 6));
                            ctx.lineTo(ex - 10 * Math.cos(angle + Math.PI / 6), ey - 10 * Math.sin(angle + Math.PI / 6));
                            ctx.closePath();
                            ctx.fill();
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Directed Graph (drag nodes)', viz.width / 2, 16, viz.colors.white, 13);

                            // Draw mini matrix
                            var miniX = 20, miniY = 60, miniCell = 28;
                            for (var i = 0; i < n; i++) {
                                viz.screenText(labels[i], miniX - 10, miniY + i * miniCell + miniCell / 2, viz.colors.text, 10);
                                viz.screenText(labels[i], miniX + i * miniCell + miniCell / 2, miniY - 10, viz.colors.text, 10);
                                for (var j = 0; j < n; j++) {
                                    var x = miniX + j * miniCell;
                                    var y = miniY + i * miniCell;
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.strokeRect(x, y, miniCell, miniCell);
                                    if (matrix[i][j]) {
                                        ctx.fillStyle = viz.colors.blue + '44';
                                        ctx.fillRect(x + 1, y + 1, miniCell - 2, miniCell - 2);
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.font = '11px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText('1', x + miniCell / 2, y + miniCell / 2);
                                    }
                                }
                            }

                            // Draw edges
                            for (var i = 0; i < n; i++) {
                                for (var j = 0; j < n; j++) {
                                    if (!matrix[i][j]) continue;
                                    if (i === j) {
                                        // Self-loop
                                        ctx.strokeStyle = viz.colors.teal;
                                        ctx.lineWidth = 2;
                                        ctx.beginPath();
                                        ctx.arc(nodes[i].x, nodes[i].y - nodeRadius - 10, 12, 0, Math.PI * 2);
                                        ctx.stroke();
                                        // Small arrowhead at bottom of loop
                                        ctx.fillStyle = viz.colors.teal;
                                        ctx.beginPath();
                                        ctx.moveTo(nodes[i].x + 12, nodes[i].y - nodeRadius - 10);
                                        ctx.lineTo(nodes[i].x + 7, nodes[i].y - nodeRadius - 2);
                                        ctx.lineTo(nodes[i].x + 16, nodes[i].y - nodeRadius - 6);
                                        ctx.closePath();
                                        ctx.fill();
                                    } else {
                                        // Check if reverse edge exists for bidirectional styling
                                        var color = matrix[j][i] ? viz.colors.purple : viz.colors.blue;
                                        // Offset bidirectional edges slightly
                                        if (matrix[j][i] && i < j) {
                                            var dx = nodes[j].x - nodes[i].x;
                                            var dy = nodes[j].y - nodes[i].y;
                                            var len = Math.sqrt(dx * dx + dy * dy);
                                            var px = -dy / len * 8, py = dx / len * 8;
                                            drawArrow(ctx, nodes[i].x + px, nodes[i].y + py, nodes[j].x + px, nodes[j].y + py, color);
                                        } else if (matrix[j][i] && i > j) {
                                            var dx = nodes[j].x - nodes[i].x;
                                            var dy = nodes[j].y - nodes[i].y;
                                            var len = Math.sqrt(dx * dx + dy * dy);
                                            var px = -dy / len * 8, py = dx / len * 8;
                                            drawArrow(ctx, nodes[i].x + px, nodes[i].y + py, nodes[j].x + px, nodes[j].y + py, color);
                                        } else {
                                            drawArrow(ctx, nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, viz.colors.blue);
                                        }
                                    }
                                }
                            }

                            // Draw nodes
                            for (var i = 0; i < n; i++) {
                                ctx.fillStyle = viz.colors.bg;
                                ctx.beginPath();
                                ctx.arc(nodes[i].x, nodes[i].y, nodeRadius, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(nodes[i].x, nodes[i].y, nodeRadius, 0, Math.PI * 2);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(labels[i], nodes[i].x, nodes[i].y);
                            }

                            // Edge count
                            var edgeCount = 0;
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++)
                                    edgeCount += matrix[i][j];
                            viz.screenText('|R| = ' + edgeCount + ' pairs', viz.width / 2, viz.height - 16, viz.colors.text, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(A = \\{1, 2, 3, 4\\}\\) and \\(R = \\{(1,1), (1,2), (2,3), (3,4), (4,4)\\}\\). Write the relation matrix \\(M_R\\) and draw the digraph.',
                    hint: 'The matrix is 4 x 4. Put a 1 in row i, column j for each pair (i,j) in R.',
                    solution: '\\(M_R = \\begin{pmatrix} 1 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}\\). The digraph has arrows \\(1 \\to 1\\) (loop), \\(1 \\to 2\\), \\(2 \\to 3\\), \\(3 \\to 4\\), \\(4 \\to 4\\) (loop).'
                },
                {
                    question: 'How many distinct binary relations are there on a set with \\(n\\) elements?',
                    hint: 'A relation on \\(A\\) is a subset of \\(A \\times A\\). How many elements does \\(A \\times A\\) have?',
                    solution: '\\(A \\times A\\) has \\(n^2\\) elements. A relation is any subset, so there are \\(2^{n^2}\\) relations. For \\(n = 3\\), this is \\(2^9 = 512\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Properties
        // ================================================================
        {
            id: 'sec-properties',
            title: 'Properties',
            content: `
<h2>Properties of Relations</h2>

<p>Not all relations are created equal. The following four properties, individually simple, combine to define the two most important families of relations.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Reflexive, Symmetric, Antisymmetric, Transitive)</div>
    <div class="env-body">
        <p>Let \\(R\\) be a relation on a set \\(A\\).</p>
        <ul>
            <li><strong>Reflexive:</strong> \\(\\forall a \\in A,\\; a \\mathrel{R} a\\). (Every element is related to itself; the matrix has all 1s on the diagonal.)</li>
            <li><strong>Symmetric:</strong> \\(\\forall a, b \\in A,\\; a \\mathrel{R} b \\Rightarrow b \\mathrel{R} a\\). (If \\(a\\) is related to \\(b\\), then \\(b\\) is related to \\(a\\); the matrix is symmetric: \\(M = M^T\\).)</li>
            <li><strong>Antisymmetric:</strong> \\(\\forall a, b \\in A,\\; (a \\mathrel{R} b \\wedge b \\mathrel{R} a) \\Rightarrow a = b\\). (The only two-way relationships are self-relationships; if \\(i \\neq j\\), then \\(M_{ij}\\) and \\(M_{ji}\\) are not both 1.)</li>
            <li><strong>Transitive:</strong> \\(\\forall a, b, c \\in A,\\; (a \\mathrel{R} b \\wedge b \\mathrel{R} c) \\Rightarrow a \\mathrel{R} c\\). (Chains of two steps can be shortcut to one.)</li>
        </ul>
    </div>
</div>

<div class="env-block warning">
    <div class="env-title">Symmetric vs. Antisymmetric</div>
    <div class="env-body">
        <p>These are <strong>not</strong> negations of each other. A relation can be both (e.g., equality: it is symmetric and antisymmetric). A relation can be neither (e.g., \\(R = \\{(1,2), (2,1), (1,3)\\}\\) on \\(\\{1,2,3\\}\\): not symmetric because \\(1 \\mathrel{R} 3\\) but not \\(3 \\mathrel{R} 1\\); not antisymmetric because \\(1 \\mathrel{R} 2\\) and \\(2 \\mathrel{R} 1\\) but \\(1 \\neq 2\\)).</p>
    </div>
</div>

<h3>Reading Properties from the Matrix</h3>

<table style="width:100%; border-collapse:collapse; margin:12px 0; font-size:0.9em;">
    <tr style="border-bottom:2px solid var(--border-default);">
        <th style="padding:8px; text-align:left;">Property</th>
        <th style="padding:8px; text-align:left;">Matrix Condition</th>
        <th style="padding:8px; text-align:left;">Digraph Condition</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Reflexive</td>
        <td style="padding:8px;">All diagonal entries are 1</td>
        <td style="padding:8px;">Every vertex has a self-loop</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Symmetric</td>
        <td style="padding:8px;">\\(M = M^T\\)</td>
        <td style="padding:8px;">Every edge has a reverse edge</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Antisymmetric</td>
        <td style="padding:8px;">If \\(i \\neq j\\), at most one of \\(M_{ij}, M_{ji}\\) is 1</td>
        <td style="padding:8px;">No pair of distinct vertices has edges in both directions</td>
    </tr>
    <tr>
        <td style="padding:8px;">Transitive</td>
        <td style="padding:8px;">\\(M^2\\) (Boolean) has no 1 where \\(M\\) has 0</td>
        <td style="padding:8px;">If there's a path \\(a \\to b \\to c\\), then there's a direct edge \\(a \\to c\\)</td>
    </tr>
</table>

<div class="env-block example">
    <div class="env-title">Example: Properties of Common Relations</div>
    <div class="env-body">
        <table style="width:100%; border-collapse:collapse; font-size:0.9em;">
            <tr style="border-bottom:2px solid var(--border-default);">
                <th style="padding:6px; text-align:left;">Relation</th>
                <th style="padding:6px; text-align:center;">Refl</th>
                <th style="padding:6px; text-align:center;">Sym</th>
                <th style="padding:6px; text-align:center;">Antisym</th>
                <th style="padding:6px; text-align:center;">Trans</th>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px;">\\(=\\) on \\(\\mathbb{Z}\\)</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px;">\\(\\leq\\) on \\(\\mathbb{Z}\\)</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
                <td style="padding:6px; text-align:center;">\u2717</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px;">\\(<\\) on \\(\\mathbb{Z}\\)</td>
                <td style="padding:6px; text-align:center;">\u2717</td>
                <td style="padding:6px; text-align:center;">\u2717</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px;">\\(a \\mid b\\) on \\(\\mathbb{Z}^+\\)</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
                <td style="padding:6px; text-align:center;">\u2717</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
            </tr>
            <tr>
                <td style="padding:6px;">\\(a \\equiv b \\pmod{n}\\)</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
                <td style="padding:6px; text-align:center;">\u2717</td>
                <td style="padding:6px; text-align:center;">\u2713</td>
            </tr>
        </table>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Determine which properties (reflexive, symmetric, antisymmetric, transitive) hold for the relation \\(R\\) on \\(\\{1,2,3\\}\\) defined by \\(R = \\{(1,1),(1,2),(2,1),(2,2),(3,3)\\}\\).',
                    hint: 'Check each property against the definition. For transitivity, verify every chain \\(a \\mathrel{R} b\\) and \\(b \\mathrel{R} c\\) has \\(a \\mathrel{R} c\\).',
                    solution: 'Reflexive: \\((1,1), (2,2), (3,3) \\in R\\). \\(\\checkmark\\) Symmetric: \\((1,2) \\in R\\) and \\((2,1) \\in R\\); no other asymmetric pairs. \\(\\checkmark\\) Antisymmetric: \\((1,2)\\) and \\((2,1)\\) are both in \\(R\\) with \\(1 \\neq 2\\). \\(\\times\\) Transitive: \\(1 \\mathrel{R} 2\\) and \\(2 \\mathrel{R} 1\\), so need \\(1 \\mathrel{R} 1\\) \\(\\checkmark\\); all other chains close. \\(\\checkmark\\) This is an equivalence relation (partitions into \\(\\{1,2\\}\\) and \\(\\{3\\}\\)).'
                },
                {
                    question: 'Give an example of a relation on \\(\\{1, 2, 3\\}\\) that is transitive but neither reflexive nor symmetric.',
                    hint: 'A simple directed chain works. Make sure there is no "missing" transitivity closure.',
                    solution: '\\(R = \\{(1,2), (2,3), (1,3)\\}\\). Transitive: the chain \\(1 \\to 2 \\to 3\\) has the shortcut \\(1 \\to 3\\). Not reflexive: \\((1,1) \\notin R\\). Not symmetric: \\((1,2) \\in R\\) but \\((2,1) \\notin R\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Equivalence Relations
        // ================================================================
        {
            id: 'sec-equivalence',
            title: 'Equivalence Relations',
            content: `
<h2>Equivalence Relations</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Equivalence Relation)</div>
    <div class="env-body">
        <p>A relation \\(R\\) on a set \\(A\\) is an <strong>equivalence relation</strong> if it is reflexive, symmetric, and transitive.</p>
    </div>
</div>

<p>Equivalence relations formalize the idea of "sameness up to some criterion." Two objects are equivalent if they share some property we care about, ignoring differences we consider irrelevant.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Equivalence Class)</div>
    <div class="env-body">
        <p>If \\(\\sim\\) is an equivalence relation on \\(A\\) and \\(a \\in A\\), the <strong>equivalence class</strong> of \\(a\\) is</p>
        \\[[a] = \\{x \\in A \\mid x \\sim a\\}.\\]
        <p>The set of all equivalence classes is \\(A / {\\sim} = \\{[a] \\mid a \\in A\\}\\), called the <strong>quotient set</strong>.</p>
    </div>
</div>

<h3>The Fundamental Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.1 (Equivalence Relations and Partitions)</div>
    <div class="env-body">
        <p>Let \\(A\\) be a non-empty set.</p>
        <ol>
            <li>If \\(\\sim\\) is an equivalence relation on \\(A\\), then the equivalence classes \\(\\{[a] \\mid a \\in A\\}\\) form a <strong>partition</strong> of \\(A\\) (they are non-empty, pairwise disjoint, and their union is \\(A\\)).</li>
            <li>Conversely, if \\(\\{A_1, A_2, \\ldots\\}\\) is a partition of \\(A\\), then the relation "\\(a \\sim b\\) iff \\(a\\) and \\(b\\) belong to the same block \\(A_i\\)" is an equivalence relation.</li>
        </ol>
        <p>This establishes a bijection between equivalence relations on \\(A\\) and partitions of \\(A\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (sketch of part 1)</div>
    <div class="env-body">
        <p><strong>Non-empty:</strong> \\(a \\in [a]\\) by reflexivity.</p>
        <p><strong>Union is \\(A\\):</strong> Every \\(a \\in A\\) is in \\([a]\\).</p>
        <p><strong>Disjoint:</strong> Suppose \\([a] \\cap [b] \\neq \\emptyset\\), say \\(c \\in [a] \\cap [b]\\). Then \\(c \\sim a\\) and \\(c \\sim b\\). By symmetry, \\(a \\sim c\\), and by transitivity, \\(a \\sim b\\). For any \\(x \\in [a]\\), \\(x \\sim a \\sim b\\), so \\(x \\in [b]\\). Similarly \\([b] \\subseteq [a]\\), so \\([a] = [b]\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>The Paradigm: Congruence Modulo \\(n\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Congruence mod \\(n\\))</div>
    <div class="env-body">
        <p>For a positive integer \\(n\\), integers \\(a\\) and \\(b\\) are <strong>congruent modulo \\(n\\)</strong>, written \\(a \\equiv b \\pmod{n}\\), if \\(n \\mid (a - b)\\).</p>
    </div>
</div>

<p>This is an equivalence relation on \\(\\mathbb{Z}\\), and its equivalence classes are the <strong>residue classes</strong> \\([0], [1], \\ldots, [n-1]\\). Each class \\([r]\\) consists of all integers that leave remainder \\(r\\) when divided by \\(n\\):</p>
\\[
[r] = \\{\\ldots, r - 2n, r - n, r, r + n, r + 2n, \\ldots\\} = \\{r + kn \\mid k \\in \\mathbb{Z}\\}.
\\]

<div class="env-block example">
    <div class="env-title">Example: \\(\\mathbb{Z} / 3\\mathbb{Z}\\)</div>
    <div class="env-body">
        <p>Modulo 3, the integers split into three classes:</p>
        <ul>
            <li>\\([0] = \\{\\ldots, -6, -3, 0, 3, 6, 9, \\ldots\\}\\)</li>
            <li>\\([1] = \\{\\ldots, -5, -2, 1, 4, 7, 10, \\ldots\\}\\)</li>
            <li>\\([2] = \\{\\ldots, -4, -1, 2, 5, 8, 11, \\ldots\\}\\)</li>
        </ul>
        <p>Every integer belongs to exactly one class. Integers 7 and 13 are in the same class (\\([1]\\)) because \\(13 - 7 = 6\\) is divisible by 3.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-equivalence-classes"></div>
<div class="viz-placeholder" data-viz="viz-partition-equivalence"></div>
`,
            visualizations: [
                {
                    id: 'viz-equivalence-classes',
                    title: 'Equivalence Classes mod n',
                    description: 'Congruence modulo n partitions the integers into n colored groups. Adjust n to see how the partition changes. Integers in the same column share the same remainder.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nMod = 3;
                        VizEngine.createSlider(controls, 'n', 2, 8, nMod, 1, function(v) {
                            nMod = Math.round(v);
                            draw();
                        });

                        var classColors;
                        function getClassColors(n) {
                            var base = ['#58a6ff', '#3fb9a0', '#f0883e', '#bc8cff', '#3fb950', '#f85149', '#d29922', '#f778ba'];
                            return base.slice(0, n);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            classColors = getClassColors(nMod);

                            viz.screenText('Integers mod ' + nMod, viz.width / 2, 22, viz.colors.white, 15);

                            // Display integers from -nMod to 3*nMod in a grid, colored by class
                            var lo = -nMod;
                            var hi = 4 * nMod - 1;
                            var count = hi - lo + 1;
                            var cols = nMod;
                            var rows = Math.ceil(count / cols);
                            var cellW = Math.min(60, (viz.width - 80) / cols);
                            var cellH = Math.min(40, (viz.height - 120) / rows);
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 55;

                            // Column headers (residue class)
                            for (var c = 0; c < cols; c++) {
                                ctx.fillStyle = classColors[c];
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText('[' + c + ']', startX + c * cellW + cellW / 2, startY - 4);
                            }

                            // Fill grid
                            for (var r = 0; r < rows; r++) {
                                for (var c = 0; c < cols; c++) {
                                    var val = lo + r * cols + c;
                                    if (val > hi) break;
                                    var rem = ((val % nMod) + nMod) % nMod;
                                    var x = startX + rem * cellW;
                                    var y = startY + r * cellH;

                                    ctx.fillStyle = classColors[rem] + '22';
                                    ctx.fillRect(x, y, cellW - 2, cellH - 2);
                                    ctx.strokeStyle = classColors[rem] + '44';
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(x, y, cellW - 2, cellH - 2);

                                    ctx.fillStyle = classColors[rem];
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(val.toString(), x + cellW / 2 - 1, y + cellH / 2 - 1);
                                }
                            }

                            // Summary
                            var summaryY = startY + rows * cellH + 20;
                            viz.screenText(nMod + ' equivalence classes partition all integers', viz.width / 2, summaryY, viz.colors.text, 12);
                            viz.screenText('a \u2261 b (mod ' + nMod + ')  iff  ' + nMod + ' | (a - b)', viz.width / 2, summaryY + 20, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-partition-equivalence',
                    title: 'Partitions \u2194 Equivalence Relations',
                    description: 'Drag elements between groups to change the partition. The corresponding equivalence relation (set of pairs) updates automatically, showing the bijection between partitions and equivalence relations.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var elements = ['a', 'b', 'c', 'd', 'e'];
                        var n = elements.length;
                        // Partition: array of group indices for each element
                        var groups = [0, 0, 1, 1, 2];
                        var numGroups = 3;
                        var groupColors = ['#58a6ff', '#3fb9a0', '#f0883e', '#bc8cff', '#3fb950'];

                        VizEngine.createButton(controls, 'All Same', function() {
                            for (var i = 0; i < n; i++) groups[i] = 0;
                            numGroups = 1;
                            draw();
                        });
                        VizEngine.createButton(controls, 'All Different', function() {
                            for (var i = 0; i < n; i++) groups[i] = i;
                            numGroups = n;
                            draw();
                        });
                        VizEngine.createButton(controls, '{a,b},{c,d},{e}', function() {
                            groups = [0, 0, 1, 1, 2];
                            numGroups = 3;
                            draw();
                        });

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            // Check if an element was clicked, cycle its group
                            var partY = 60;
                            var elemR = 18;
                            var partW = viz.width - 40;
                            var groupW = partW / Math.max(numGroups, 1);
                            var startX = 20;

                            for (var g = 0; g < numGroups; g++) {
                                var membersInG = [];
                                for (var i = 0; i < n; i++) {
                                    if (groups[i] === g) membersInG.push(i);
                                }
                                for (var mi = 0; mi < membersInG.length; mi++) {
                                    var ex = startX + g * groupW + groupW / 2 + (mi - (membersInG.length - 1) / 2) * 42;
                                    var ey = partY + 50;
                                    if (Math.sqrt((mx - ex) * (mx - ex) + (my - ey) * (my - ey)) < elemR * 1.5) {
                                        // Cycle to next group, or create a new one
                                        var idx = membersInG[mi];
                                        groups[idx] = (groups[idx] + 1) % (numGroups + 1);
                                        // Recompute numGroups
                                        var used = new Set(groups);
                                        // Compact group numbers
                                        var mapping = {};
                                        var newIdx = 0;
                                        for (var u = 0; u <= n; u++) {
                                            if (used.has(u)) { mapping[u] = newIdx; newIdx++; }
                                        }
                                        for (var i = 0; i < n; i++) groups[i] = mapping[groups[i]];
                                        numGroups = newIdx;
                                        draw();
                                        return;
                                    }
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Click elements to cycle groups', viz.width / 2, 18, viz.colors.white, 13);

                            // Draw partition
                            var partY = 50;
                            var partW = viz.width - 80;
                            var groupW = partW / Math.max(numGroups, 1);
                            var startX = 40;
                            var elemR = 18;

                            viz.screenText('Partition:', startX - 20, partY + 10, viz.colors.text, 11, 'left');

                            for (var g = 0; g < numGroups; g++) {
                                var membersInG = [];
                                for (var i = 0; i < n; i++) {
                                    if (groups[i] === g) membersInG.push(i);
                                }
                                var gx = startX + g * groupW;
                                var gw = groupW - 8;

                                // Group box
                                ctx.strokeStyle = groupColors[g % groupColors.length] + '66';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.roundRect(gx, partY + 20, gw, 60, 10);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Elements
                                for (var mi = 0; mi < membersInG.length; mi++) {
                                    var ex = gx + gw / 2 + (mi - (membersInG.length - 1) / 2) * 38;
                                    var ey = partY + 50;
                                    ctx.fillStyle = groupColors[g % groupColors.length] + '33';
                                    ctx.beginPath();
                                    ctx.arc(ex, ey, elemR, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.strokeStyle = groupColors[g % groupColors.length];
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.arc(ex, ey, elemR, 0, Math.PI * 2);
                                    ctx.stroke();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(elements[membersInG[mi]], ex, ey);
                                }
                            }

                            // Compute equivalence relation pairs
                            var pairsY = partY + 110;
                            viz.screenText('Equivalence Relation R:', startX - 20, pairsY, viz.colors.text, 11, 'left');

                            var pairs = [];
                            for (var i = 0; i < n; i++) {
                                for (var j = 0; j < n; j++) {
                                    if (groups[i] === groups[j]) {
                                        pairs.push('(' + elements[i] + ',' + elements[j] + ')');
                                    }
                                }
                            }

                            // Display pairs, wrapping
                            var pairStr = '{' + pairs.join(', ') + '}';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';

                            // Word wrap
                            var maxW = viz.width - 60;
                            var words = pairStr;
                            var lines = [];
                            var currentLine = '';
                            for (var ci = 0; ci < words.length; ci++) {
                                currentLine += words[ci];
                                if (ctx.measureText(currentLine).width > maxW) {
                                    var lastComma = currentLine.lastIndexOf(',');
                                    if (lastComma > 0) {
                                        lines.push(currentLine.substring(0, lastComma + 1));
                                        currentLine = ' ' + currentLine.substring(lastComma + 1);
                                    }
                                }
                            }
                            if (currentLine) lines.push(currentLine);
                            for (var li = 0; li < lines.length; li++) {
                                ctx.fillText(lines[li], startX - 10, pairsY + 18 + li * 16);
                            }

                            // Display relation matrix
                            var matY = pairsY + 18 + lines.length * 16 + 20;
                            var matCellSize = 30;
                            var matStartX = (viz.width - n * matCellSize) / 2;

                            viz.screenText('Relation Matrix:', viz.width / 2, matY - 14, viz.colors.text, 11);

                            for (var i = 0; i < n; i++) {
                                viz.screenText(elements[i], matStartX - 14, matY + i * matCellSize + matCellSize / 2, viz.colors.text, 10);
                                viz.screenText(elements[i], matStartX + i * matCellSize + matCellSize / 2, matY - 4, viz.colors.text, 10);
                                for (var j = 0; j < n; j++) {
                                    var val = (groups[i] === groups[j]) ? 1 : 0;
                                    var cx = matStartX + j * matCellSize;
                                    var cy = matY + i * matCellSize;
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.strokeRect(cx, cy, matCellSize, matCellSize);
                                    if (val) {
                                        ctx.fillStyle = groupColors[groups[i] % groupColors.length] + '33';
                                        ctx.fillRect(cx + 1, cy + 1, matCellSize - 2, matCellSize - 2);
                                    }
                                    ctx.fillStyle = val ? viz.colors.white : viz.colors.text + '33';
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(val.toString(), cx + matCellSize / 2, cy + matCellSize / 2);
                                }
                            }

                            viz.screenText('|R| = ' + pairs.length + ' pairs,  ' + numGroups + ' classes', viz.width / 2, viz.height - 14, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that congruence modulo \\(n\\) is an equivalence relation.',
                    hint: 'Verify reflexive (\\(n \\mid 0\\)), symmetric (\\(n \\mid (a-b) \\Rightarrow n \\mid (b-a)\\)), and transitive (\\(n \\mid (a-b)\\) and \\(n \\mid (b-c)\\) implies \\(n \\mid (a-c)\\)).',
                    solution: 'Reflexive: \\(a - a = 0\\) and \\(n \\mid 0\\). Symmetric: if \\(n \\mid (a-b)\\), then \\(a - b = kn\\), so \\(b - a = -kn\\) and \\(n \\mid (b-a)\\). Transitive: if \\(a - b = k_1 n\\) and \\(b - c = k_2 n\\), then \\(a - c = (k_1 + k_2)n\\), so \\(n \\mid (a-c)\\).'
                },
                {
                    question: 'How many equivalence relations are there on the set \\(\\{1, 2, 3\\}\\)? List them all by giving the corresponding partitions.',
                    hint: 'Count the number of partitions of a 3-element set (this is the Bell number \\(B_3\\)).',
                    solution: 'There are \\(B_3 = 5\\) equivalence relations, corresponding to the 5 partitions: (1) \\(\\{\\{1,2,3\\}\\}\\), (2) \\(\\{\\{1,2\\},\\{3\\}\\}\\), (3) \\(\\{\\{1,3\\},\\{2\\}\\}\\), (4) \\(\\{\\{2,3\\},\\{1\\}\\}\\), (5) \\(\\{\\{1\\},\\{2\\},\\{3\\}\\}\\).'
                },
                {
                    question: 'Define a relation on \\(\\mathbb{Z} \\times \\mathbb{Z}\\) by \\((a,b) \\sim (c,d)\\) iff \\(a + d = b + c\\). Show this is an equivalence relation and describe the equivalence classes.',
                    hint: 'The condition \\(a + d = b + c\\) is the same as \\(a - b = c - d\\). Each class is determined by the "difference" \\(a - b\\).',
                    solution: 'Reflexive: \\(a + b = b + a\\). Symmetric: \\(a + d = b + c\\) iff \\(c + b = d + a\\). Transitive: \\(a + d = b + c\\) and \\(c + f = d + e\\) give \\(a + f = (b + c - d) + (d + e - c) + f - f\\) ... simplifying: \\(a - b = c - d\\) and \\(c - d = e - f\\) so \\(a - b = e - f\\), i.e., \\(a + f = b + e\\). The equivalence class of \\((a,b)\\) is \\(\\{(c,d) \\mid c - d = a - b\\}\\). This construction is how the integers \\(\\mathbb{Z}\\) are formally built from \\(\\mathbb{N}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Partial Orders
        // ================================================================
        {
            id: 'sec-partial-orders',
            title: 'Partial Orders',
            content: `
<h2>Partial Orders</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Partial Order)</div>
    <div class="env-body">
        <p>A relation \\(\\preceq\\) on a set \\(A\\) is a <strong>partial order</strong> if it is reflexive, antisymmetric, and transitive. The pair \\((A, \\preceq)\\) is called a <strong>partially ordered set</strong> (poset).</p>
    </div>
</div>

<p>In a partial order, not every pair of elements need be comparable. If \\(a \\preceq b\\) or \\(b \\preceq a\\), we say \\(a\\) and \\(b\\) are <strong>comparable</strong>; otherwise they are <strong>incomparable</strong>.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Total Order)</div>
    <div class="env-body">
        <p>A partial order is a <strong>total (linear) order</strong> if every two elements are comparable: \\(\\forall a, b \\in A,\\; a \\preceq b \\text{ or } b \\preceq a\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <ul>
            <li>\\((\\mathbb{Z}, \\leq)\\) is a total order.</li>
            <li>\\((\\mathbb{Z}^+, \\mid)\\), where \\(a \\mid b\\) means "\\(a\\) divides \\(b\\)," is a partial order but <em>not</em> total: 2 and 3 are incomparable.</li>
            <li>\\((\\mathcal{P}(S), \\subseteq)\\) for a set \\(S\\) is a partial order. If \\(|S| \\geq 2\\), it is not total.</li>
        </ul>
    </div>
</div>

<h3>Hasse Diagrams</h3>

<p>The digraph of a partial order is cluttered with self-loops and transitive edges that carry no new information. A <strong>Hasse diagram</strong> strips these away:</p>

<div class="env-block definition">
    <div class="env-title">Definition (Hasse Diagram)</div>
    <div class="env-body">
        <ol>
            <li>Remove all self-loops (reflexivity is implied).</li>
            <li>Remove all edges implied by transitivity: if \\(a \\preceq b\\) and \\(b \\preceq c\\), remove the edge \\(a \\preceq c\\) (it is already deducible).</li>
            <li>Orient the remaining edges upward (if \\(a \\preceq b\\), place \\(a\\) lower than \\(b\\)); drop arrowheads (the direction is "up").</li>
        </ol>
        <p>The resulting graph is called the <strong>Hasse diagram</strong> of the poset.</p>
    </div>
</div>

<h3>Special Elements</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Extremal Elements)</div>
    <div class="env-body">
        <p>In a poset \\((A, \\preceq)\\):</p>
        <ul>
            <li><strong>Minimum:</strong> \\(a\\) is a minimum if \\(a \\preceq x\\) for all \\(x \\in A\\).</li>
            <li><strong>Maximum:</strong> \\(a\\) is a maximum if \\(x \\preceq a\\) for all \\(x \\in A\\).</li>
            <li><strong>Minimal:</strong> \\(a\\) is minimal if there is no \\(x \\neq a\\) with \\(x \\preceq a\\).</li>
            <li><strong>Maximal:</strong> \\(a\\) is maximal if there is no \\(x \\neq a\\) with \\(a \\preceq x\\).</li>
        </ul>
        <p>A minimum is unique (if it exists) and is the only minimal element. The analogous statement holds for maximum.</p>
    </div>
</div>

<h3>Lattices</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Lattice)</div>
    <div class="env-body">
        <p>A poset \\((A, \\preceq)\\) is a <strong>lattice</strong> if every pair of elements \\(a, b \\in A\\) has a <strong>least upper bound</strong> (join, \\(a \\vee b\\)) and a <strong>greatest lower bound</strong> (meet, \\(a \\wedge b\\)).</p>
        <ul>
            <li>\\(a \\vee b = \\text{lub}(a,b)\\): the smallest element \\(c\\) with \\(a \\preceq c\\) and \\(b \\preceq c\\).</li>
            <li>\\(a \\wedge b = \\text{glb}(a,b)\\): the largest element \\(c\\) with \\(c \\preceq a\\) and \\(c \\preceq b\\).</li>
        </ul>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Divisors of 12</div>
    <div class="env-body">
        <p>The divisors of 12 are \\(\\{1, 2, 3, 4, 6, 12\\}\\) ordered by divisibility. This is a lattice: the meet is \\(\\gcd\\) and the join is \\(\\text{lcm}\\). For example, \\(4 \\wedge 6 = \\gcd(4,6) = 2\\) and \\(4 \\vee 6 = \\text{lcm}(4,6) = 12\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-hasse-diagram"></div>
<div class="viz-placeholder" data-viz="viz-lattice"></div>
`,
            visualizations: [
                {
                    id: 'viz-hasse-diagram',
                    title: 'Hasse Diagram: Divisors of n',
                    description: 'The Hasse diagram for the divisibility partial order on divisors of n. Drag nodes to rearrange. Only covering relations (direct divisibility with no intermediate divisor) are shown.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var targetN = 12;

                        VizEngine.createSlider(controls, 'n', 2, 30, targetN, 1, function(v) {
                            targetN = Math.round(v);
                            computeLayout();
                            draw();
                        });

                        var divs = [];
                        var covers = [];
                        var nodePos = {};
                        var nodeRadius = 16;
                        var dragNode = -1;

                        function getDivisors(n) {
                            var d = [];
                            for (var i = 1; i <= n; i++) {
                                if (n % i === 0) d.push(i);
                            }
                            return d;
                        }

                        function computeCovers(divList) {
                            var covs = [];
                            for (var i = 0; i < divList.length; i++) {
                                for (var j = 0; j < divList.length; j++) {
                                    if (divList[j] > divList[i] && divList[j] % divList[i] === 0) {
                                        // Check no intermediate
                                        var intermediate = false;
                                        for (var k = 0; k < divList.length; k++) {
                                            if (divList[k] > divList[i] && divList[k] < divList[j] &&
                                                divList[k] % divList[i] === 0 && divList[j] % divList[k] === 0) {
                                                intermediate = true;
                                                break;
                                            }
                                        }
                                        if (!intermediate) covs.push([i, j]);
                                    }
                                }
                            }
                            return covs;
                        }

                        function computeLayout() {
                            divs = getDivisors(targetN);
                            covers = computeCovers(divs);
                            nodePos = {};

                            // Assign levels by number of prime factors (with multiplicity)
                            var levels = {};
                            for (var i = 0; i < divs.length; i++) {
                                var d = divs[i];
                                var count = 0;
                                var tmp = d;
                                for (var p = 2; p * p <= tmp; p++) {
                                    while (tmp % p === 0) { count++; tmp /= p; }
                                }
                                if (tmp > 1) count++;
                                if (!levels[count]) levels[count] = [];
                                levels[count].push(i);
                            }

                            var maxLevel = Math.max.apply(null, Object.keys(levels).map(Number));
                            var paddingTop = 50;
                            var paddingBot = 30;
                            var usableH = viz.height - paddingTop - paddingBot;
                            var levelH = maxLevel > 0 ? usableH / maxLevel : usableH;

                            for (var lev in levels) {
                                var nodesAtLevel = levels[lev];
                                var numAtLevel = nodesAtLevel.length;
                                var levelY = viz.height - paddingBot - parseInt(lev) * levelH;
                                for (var ni = 0; ni < numAtLevel; ni++) {
                                    var x = viz.width / 2 + (ni - (numAtLevel - 1) / 2) * 60;
                                    nodePos[nodesAtLevel[ni]] = { x: x, y: levelY };
                                }
                            }
                        }

                        viz.canvas.addEventListener('mousedown', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            for (var i = 0; i < divs.length; i++) {
                                var dx = mx - nodePos[i].x, dy = my - nodePos[i].y;
                                if (dx * dx + dy * dy < nodeRadius * nodeRadius * 2.5) {
                                    dragNode = i;
                                    e.preventDefault();
                                    return;
                                }
                            }
                        });
                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (dragNode < 0) return;
                            e.preventDefault();
                            var rect = viz.canvas.getBoundingClientRect();
                            nodePos[dragNode].x = e.clientX - rect.left;
                            nodePos[dragNode].y = e.clientY - rect.top;
                            draw();
                        });
                        viz.canvas.addEventListener('mouseup', function() { dragNode = -1; });
                        viz.canvas.addEventListener('mouseleave', function() { dragNode = -1; });

                        viz.canvas.addEventListener('touchstart', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.touches[0].clientX - rect.left;
                            var my = e.touches[0].clientY - rect.top;
                            for (var i = 0; i < divs.length; i++) {
                                var dx = mx - nodePos[i].x, dy = my - nodePos[i].y;
                                if (dx * dx + dy * dy < nodeRadius * nodeRadius * 3) {
                                    dragNode = i;
                                    e.preventDefault();
                                    return;
                                }
                            }
                        }, { passive: false });
                        viz.canvas.addEventListener('touchmove', function(e) {
                            if (dragNode < 0) return;
                            e.preventDefault();
                            var rect = viz.canvas.getBoundingClientRect();
                            nodePos[dragNode].x = e.touches[0].clientX - rect.left;
                            nodePos[dragNode].y = e.touches[0].clientY - rect.top;
                            draw();
                        }, { passive: false });
                        viz.canvas.addEventListener('touchend', function() { dragNode = -1; });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Hasse Diagram: divisors of ' + targetN, viz.width / 2, 18, viz.colors.white, 14);

                            // Draw cover edges
                            for (var ci = 0; ci < covers.length; ci++) {
                                var a = covers[ci][0], b = covers[ci][1];
                                ctx.strokeStyle = viz.colors.blue + '88';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(nodePos[a].x, nodePos[a].y);
                                ctx.lineTo(nodePos[b].x, nodePos[b].y);
                                ctx.stroke();
                            }

                            // Draw nodes
                            for (var i = 0; i < divs.length; i++) {
                                var p = nodePos[i];
                                ctx.fillStyle = viz.colors.bg;
                                ctx.beginPath();
                                ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = (divs[i] > 99 ? '10' : '13') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(divs[i].toString(), p.x, p.y);
                            }

                            viz.screenText(divs.length + ' divisors, ' + covers.length + ' covering relations', viz.width / 2, viz.height - 10, viz.colors.text, 11);
                        }
                        computeLayout();
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-lattice',
                    title: 'Lattice of Divisors of 30',
                    description: 'The divisors of 30 form a lattice under divisibility. Click two nodes to compute their meet (gcd) and join (lcm).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var divs30 = [1, 2, 3, 5, 6, 10, 15, 30];
                        var n = divs30.length;
                        var selected = [-1, -1];
                        var nodeRadius = 18;

                        // Layout: levels by Omega(d) = number of prime factors with multiplicity
                        // 1: level 0; 2,3,5: level 1; 6,10,15: level 2; 30: level 3
                        var levelAssign = [0, 1, 1, 1, 2, 2, 2, 3];
                        var levelCounts = [1, 3, 3, 1];
                        var nodePos = [];
                        var paddingTop = 50, paddingBot = 40;
                        var usableH = viz.height - paddingTop - paddingBot;
                        var levelH = usableH / 3;

                        var levelIdx = [0, 0, 0, 0];
                        for (var i = 0; i < n; i++) {
                            var lev = levelAssign[i];
                            var numAtLevel = levelCounts[lev];
                            var li = levelIdx[lev];
                            levelIdx[lev]++;
                            var x = viz.width / 2 + (li - (numAtLevel - 1) / 2) * 80;
                            var y = viz.height - paddingBot - lev * levelH;
                            nodePos.push({ x: x, y: y });
                        }

                        // Compute covers
                        var covers = [];
                        for (var i = 0; i < n; i++) {
                            for (var j = 0; j < n; j++) {
                                if (divs30[j] > divs30[i] && divs30[j] % divs30[i] === 0) {
                                    var intermediate = false;
                                    for (var k = 0; k < n; k++) {
                                        if (divs30[k] > divs30[i] && divs30[k] < divs30[j] &&
                                            divs30[k] % divs30[i] === 0 && divs30[j] % divs30[k] === 0) {
                                            intermediate = true;
                                            break;
                                        }
                                    }
                                    if (!intermediate) covers.push([i, j]);
                                }
                            }
                        }

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function lcm(a, b) { return a / gcd(a, b) * b; }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            for (var i = 0; i < n; i++) {
                                var dx = mx - nodePos[i].x, dy = my - nodePos[i].y;
                                if (dx * dx + dy * dy < nodeRadius * nodeRadius * 2.5) {
                                    if (selected[0] < 0) { selected[0] = i; }
                                    else if (selected[1] < 0 && i !== selected[0]) { selected[1] = i; }
                                    else { selected = [i, -1]; }
                                    draw();
                                    return;
                                }
                            }
                        });

                        VizEngine.createButton(controls, 'Clear Selection', function() {
                            selected = [-1, -1];
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Divisor Lattice of 30  (click two nodes)', viz.width / 2, 18, viz.colors.white, 14);

                            // Highlight meet/join if two selected
                            var meetIdx = -1, joinIdx = -1;
                            if (selected[0] >= 0 && selected[1] >= 0) {
                                var a = divs30[selected[0]], b = divs30[selected[1]];
                                var meetVal = gcd(a, b);
                                var joinVal = lcm(a, b);
                                meetIdx = divs30.indexOf(meetVal);
                                joinIdx = divs30.indexOf(joinVal);
                            }

                            // Draw cover edges
                            for (var ci = 0; ci < covers.length; ci++) {
                                var a = covers[ci][0], b = covers[ci][1];
                                ctx.strokeStyle = viz.colors.blue + '66';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(nodePos[a].x, nodePos[a].y);
                                ctx.lineTo(nodePos[b].x, nodePos[b].y);
                                ctx.stroke();
                            }

                            // Draw nodes
                            for (var i = 0; i < n; i++) {
                                var p = nodePos[i];
                                var isSelected = (i === selected[0] || i === selected[1]);
                                var isMeet = (i === meetIdx);
                                var isJoin = (i === joinIdx);

                                ctx.fillStyle = viz.colors.bg;
                                ctx.beginPath();
                                ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
                                ctx.fill();

                                if (isMeet) {
                                    ctx.fillStyle = viz.colors.orange + '44';
                                    ctx.beginPath();
                                    ctx.arc(p.x, p.y, nodeRadius + 4, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                                if (isJoin) {
                                    ctx.fillStyle = viz.colors.purple + '44';
                                    ctx.beginPath();
                                    ctx.arc(p.x, p.y, nodeRadius + 4, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                ctx.strokeStyle = isSelected ? viz.colors.green : viz.colors.teal;
                                ctx.lineWidth = isSelected ? 3 : 2;
                                ctx.beginPath();
                                ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
                                ctx.stroke();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(divs30[i].toString(), p.x, p.y);
                            }

                            // Show meet/join info
                            if (selected[0] >= 0 && selected[1] >= 0) {
                                var a = divs30[selected[0]], b = divs30[selected[1]];
                                var infoY = viz.height - 16;
                                viz.screenText(
                                    a + ' \u2227 ' + b + ' = gcd = ' + gcd(a, b) + '    ' +
                                    a + ' \u2228 ' + b + ' = lcm = ' + lcm(a, b),
                                    viz.width / 2, infoY, viz.colors.white, 13
                                );
                            } else if (selected[0] >= 0) {
                                viz.screenText('Select a second node', viz.width / 2, viz.height - 16, viz.colors.text, 11);
                            } else {
                                viz.screenText('meet (\u2227) = gcd,   join (\u2228) = lcm', viz.width / 2, viz.height - 16, viz.colors.text, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Draw the Hasse diagram for \\((\\{1, 2, 3, 4, 5, 6\\}, \\mid)\\). Which elements are maximal? Is there a maximum?',
                    hint: 'Find divisibility pairs, then remove transitively implied ones. Maximal elements have no element above them.',
                    solution: 'Covering relations: \\(1 \\to 2, 1 \\to 3, 1 \\to 5, 2 \\to 4, 2 \\to 6, 3 \\to 6\\). Maximal elements: 4, 5, 6 (nothing in the set that they divide). There is no maximum because 4, 5, 6 are pairwise incomparable.'
                },
                {
                    question: 'Is \\((\\{1, 2, 3, 5, 6, 10, 15, 30\\}, \\mid)\\) a lattice? What are \\(6 \\wedge 10\\) and \\(6 \\vee 15\\)?',
                    hint: 'For divisibility, meet = gcd and join = lcm. Check that gcd and lcm of any pair stay within the set.',
                    solution: 'Yes, it is a lattice (divisors of 30 under divisibility always form a lattice). \\(6 \\wedge 10 = \\gcd(6, 10) = 2\\). \\(6 \\vee 15 = \\text{lcm}(6, 15) = 30\\). Both 2 and 30 are divisors of 30, so they are in the set.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Closures
        // ================================================================
        {
            id: 'sec-closures',
            title: 'Closures',
            content: `
<h2>Closures of Relations</h2>

<p>Given a relation \\(R\\) that lacks a desired property, what is the smallest relation containing \\(R\\) that has the property? This is the <strong>closure</strong> of \\(R\\) with respect to that property.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Closure)</div>
    <div class="env-body">
        <p>The <strong>closure</strong> of a relation \\(R\\) on \\(A\\) with respect to a property \\(P\\) is the smallest relation \\(R'\\) on \\(A\\) such that:</p>
        <ol>
            <li>\\(R \\subseteq R'\\), and</li>
            <li>\\(R'\\) has property \\(P\\).</li>
        </ol>
    </div>
</div>

<h3>Reflexive Closure</h3>

<p>The reflexive closure of \\(R\\) is \\(R \\cup \\Delta\\), where \\(\\Delta = \\{(a, a) \\mid a \\in A\\}\\) is the diagonal (identity) relation. In the matrix, set all diagonal entries to 1.</p>

<h3>Symmetric Closure</h3>

<p>The symmetric closure of \\(R\\) is \\(R \\cup R^{-1}\\). In the matrix, \\(M' = M \\lor M^T\\) (Boolean OR with transpose).</p>

<h3>Transitive Closure</h3>

<p>The transitive closure is more interesting and harder to compute. It must add an edge \\((a, c)\\) whenever there exists a path from \\(a\\) to \\(c\\) in the digraph of \\(R\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Transitive Closure)</div>
    <div class="env-body">
        <p>The <strong>transitive closure</strong> of \\(R\\) on a finite set \\(A\\) with \\(|A| = n\\) is</p>
        \\[R^+ = R \\cup R^2 \\cup R^3 \\cup \\cdots \\cup R^n\\]
        <p>where \\(R^k\\) denotes the \\(k\\)-fold composition of \\(R\\) with itself. In the Boolean matrix, \\(M_{R^+} = M \\lor M^{(2)} \\lor \\cdots \\lor M^{(n)}\\), where \\(M^{(k)}\\) is the \\(k\\)-th Boolean power.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.2 (Characterization)</div>
    <div class="env-body">
        <p>\\((a, b) \\in R^+\\) if and only if there exists a path of length \\(\\geq 1\\) from \\(a\\) to \\(b\\) in the digraph of \\(R\\).</p>
    </div>
</div>

<h3>Warshall's Algorithm</h3>

<p>Computing \\(R^+\\) by matrix powers is \\(O(n^4)\\). <strong>Warshall's algorithm</strong> (1962) computes the transitive closure in \\(O(n^3)\\) using a dynamic programming approach.</p>

<div class="env-block definition">
    <div class="env-title">Warshall's Algorithm</div>
    <div class="env-body">
        <p>Input: Boolean matrix \\(W = M_R\\).</p>
        <p>For \\(k = 1\\) to \\(n\\):</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;For \\(i = 1\\) to \\(n\\):</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For \\(j = 1\\) to \\(n\\):</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\(W_{ij} \\leftarrow W_{ij} \\lor (W_{ik} \\land W_{kj})\\)</p>
        <p>Output: \\(W = M_{R^+}\\).</p>
        <p>The idea: at iteration \\(k\\), \\(W_{ij} = 1\\) iff there is a path from \\(i\\) to \\(j\\) using only intermediate vertices from \\(\\{1, \\ldots, k\\}\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Let \\(R = \\{(1,2), (2,3), (3,1)\\}\\) on \\(\\{1,2,3\\}\\). After Warshall's algorithm, the transitive closure is \\(R^+ = \\{(1,1), (1,2), (1,3), (2,1), (2,2), (2,3), (3,1), (3,2), (3,3)\\} = A \\times A\\). This makes sense: the digraph is a 3-cycle, so every vertex can reach every other vertex.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-transitive-closure"></div>
`,
            visualizations: [
                {
                    id: 'viz-transitive-closure',
                    title: "Warshall's Algorithm Step by Step",
                    description: "Watch Warshall's algorithm compute the transitive closure. Each step considers a new intermediate vertex k. Newly added 1s are highlighted in orange.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 4;
                        var labels = ['1', '2', '3', '4'];
                        // Initial relation: a cycle plus one edge
                        var origMatrix = [
                            [0, 1, 0, 0],
                            [0, 0, 1, 0],
                            [0, 0, 0, 1],
                            [1, 0, 0, 0]
                        ];
                        var matrix = [];
                        var added = [];
                        var stepK = 0;

                        function resetMatrix() {
                            matrix = [];
                            added = [];
                            for (var i = 0; i < n; i++) {
                                matrix[i] = origMatrix[i].slice();
                                added[i] = [];
                                for (var j = 0; j < n; j++) added[i][j] = 0;
                            }
                            stepK = 0;
                        }
                        resetMatrix();

                        VizEngine.createButton(controls, 'Step', function() {
                            if (stepK >= n) return;
                            // Clear previous step's "added" markers
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++)
                                    added[i][j] = 0;
                            // Warshall step k
                            var k = stepK;
                            for (var i = 0; i < n; i++) {
                                for (var j = 0; j < n; j++) {
                                    if (!matrix[i][j] && matrix[i][k] && matrix[k][j]) {
                                        matrix[i][j] = 1;
                                        added[i][j] = 1;
                                    }
                                }
                            }
                            stepK++;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Run All', function() {
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++)
                                    added[i][j] = 0;
                            while (stepK < n) {
                                var k = stepK;
                                for (var i = 0; i < n; i++) {
                                    for (var j = 0; j < n; j++) {
                                        if (!matrix[i][j] && matrix[i][k] && matrix[k][j]) {
                                            matrix[i][j] = 1;
                                            added[i][j] = 1;
                                        }
                                    }
                                }
                                stepK++;
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            resetMatrix();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Chain 1\u21922\u21923\u21924', function() {
                            origMatrix = [[0,1,0,0],[0,0,1,0],[0,0,0,1],[0,0,0,0]];
                            resetMatrix();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Cycle', function() {
                            origMatrix = [[0,1,0,0],[0,0,1,0],[0,0,0,1],[1,0,0,0]];
                            resetMatrix();
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cellSize = 50;

                            // Original matrix
                            var origStartX = 30;
                            var origStartY = 60;
                            viz.screenText('Original R', origStartX + n * cellSize / 2, 20, viz.colors.text, 12);
                            viz.screenText('W (step k=' + stepK + '/' + n + ')', 310 + n * cellSize / 2, 20, viz.colors.white, 12);

                            // Draw original (small)
                            var sCell = 30;
                            for (var i = 0; i < n; i++) {
                                viz.screenText(labels[i], origStartX - 12, origStartY + i * sCell + sCell / 2, viz.colors.text, 10);
                                for (var j = 0; j < n; j++) {
                                    var x = origStartX + j * sCell;
                                    var y = origStartY + i * sCell;
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.strokeRect(x, y, sCell, sCell);
                                    ctx.fillStyle = origMatrix[i][j] ? viz.colors.blue + '44' : 'transparent';
                                    if (origMatrix[i][j]) ctx.fillRect(x + 1, y + 1, sCell - 2, sCell - 2);
                                    ctx.fillStyle = origMatrix[i][j] ? viz.colors.white : viz.colors.text + '44';
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(origMatrix[i][j].toString(), x + sCell / 2, y + sCell / 2);
                                }
                            }

                            // Draw current W matrix (larger)
                            var wStartX = 310;
                            var wStartY = 45;
                            for (var i = 0; i < n; i++) {
                                viz.screenText(labels[i], wStartX - 16, wStartY + i * cellSize + cellSize / 2, viz.colors.teal, 12);
                                viz.screenText(labels[i], wStartX + i * cellSize + cellSize / 2, wStartY - 10, viz.colors.teal, 12);
                                for (var j = 0; j < n; j++) {
                                    var x = wStartX + j * cellSize;
                                    var y = wStartY + i * cellSize;
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(x, y, cellSize, cellSize);

                                    // Highlight row/col of current k
                                    if (stepK > 0 && stepK <= n) {
                                        var pk = stepK - 1;
                                        if (i === pk || j === pk) {
                                            ctx.fillStyle = viz.colors.purple + '11';
                                            ctx.fillRect(x, y, cellSize, cellSize);
                                        }
                                    }

                                    if (matrix[i][j]) {
                                        if (added[i][j]) {
                                            ctx.fillStyle = viz.colors.orange + '55';
                                            ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                        } else {
                                            ctx.fillStyle = viz.colors.blue + '33';
                                            ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                        }
                                    }

                                    ctx.fillStyle = added[i][j] ? viz.colors.orange :
                                                    (matrix[i][j] ? viz.colors.white : viz.colors.text + '44');
                                    ctx.font = (added[i][j] ? 'bold ' : '') + '15px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(matrix[i][j].toString(), x + cellSize / 2, y + cellSize / 2);
                                }
                            }

                            // Count edges
                            var origEdges = 0, curEdges = 0;
                            for (var i = 0; i < n; i++)
                                for (var j = 0; j < n; j++) {
                                    origEdges += origMatrix[i][j];
                                    curEdges += matrix[i][j];
                                }

                            var infoY = wStartY + n * cellSize + 25;
                            viz.screenText('Original: ' + origEdges + ' edges', viz.width / 4, infoY, viz.colors.text, 11);
                            viz.screenText('Closure: ' + curEdges + ' edges', 3 * viz.width / 4, infoY, viz.colors.teal, 11);

                            if (stepK >= n) {
                                viz.screenText('Transitive closure complete!', viz.width / 2, infoY + 25, viz.colors.green, 13);
                            } else {
                                viz.screenText('W[i][j] = W[i][j] OR (W[i][' + (stepK + 1) + '] AND W[' + (stepK + 1) + '][j])', viz.width / 2, infoY + 25, viz.colors.purple, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the reflexive, symmetric, and transitive closures of \\(R = \\{(1,2), (2,3)\\}\\) on \\(\\{1,2,3\\}\\).',
                    hint: 'Reflexive closure: add diagonal. Symmetric closure: add reverse edges. Transitive closure: add all paths.',
                    solution: 'Reflexive closure: \\(R \\cup \\{(1,1),(2,2),(3,3)\\} = \\{(1,1),(1,2),(2,2),(2,3),(3,3)\\}\\). Symmetric closure: \\(R \\cup R^{-1} = \\{(1,2),(2,1),(2,3),(3,2)\\}\\). Transitive closure: \\(R^+ = \\{(1,2),(1,3),(2,3)\\}\\) (added \\((1,3)\\) since \\(1 \\to 2 \\to 3\\)).'
                },
                {
                    question: "Trace Warshall's algorithm on the matrix \\(M = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 1 & 0 & 0 \\end{pmatrix}\\). What is the result?",
                    hint: 'The digraph is a 3-cycle: 1 \\(\\to\\) 2 \\(\\to\\) 3 \\(\\to\\) 1. Every vertex can reach every other vertex.',
                    solution: 'After k=1: W[3][2] becomes 1 (via 3\\(\\to\\)1\\(\\to\\)2). After k=2: W[1][3] becomes 1 (1\\(\\to\\)2\\(\\to\\)3), W[3][3] becomes 1 (3\\(\\to\\)2\\(\\to\\)3). After k=3: all remaining entries become 1 (everything goes through vertex 3). Result: all-ones matrix. \\(R^+ = A \\times A\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead: From Relations to Functions and Beyond</h2>

<div class="env-block intuition">
    <div class="env-title">The Big Picture</div>
    <div class="env-body">
        <p>Relations are the foundational language for most of the structures we encounter in discrete mathematics. This chapter established the two central species:</p>
        <ul>
            <li><strong>Equivalence relations</strong> partition a set into classes of "equivalent" elements. They are the key to modular arithmetic (Chapter 15), quotient structures, and abstract algebra.</li>
            <li><strong>Partial orders</strong> arrange elements in a hierarchy. They underlie sorting, lattice theory, and the analysis of algorithms.</li>
        </ul>
    </div>
</div>

<h3>Functions as Special Relations</h3>

<p>In Chapter 5, we study <strong>functions</strong>, which are relations with an extra constraint: every element of the domain is related to exactly one element of the codomain. Functions are the most structured kind of relation, and virtually all of mathematics is built on them.</p>

<div class="env-block definition">
    <div class="env-title">Preview: Function</div>
    <div class="env-body">
        <p>A function \\(f: A \\to B\\) is a relation \\(f \\subseteq A \\times B\\) such that for every \\(a \\in A\\), there is <em>exactly one</em> \\(b \\in B\\) with \\((a, b) \\in f\\).</p>
    </div>
</div>

<h3>Relations in Graph Theory</h3>

<p>In Part D (Chapters 10-13), we study graphs extensively. An undirected graph is just a symmetric, irreflexive relation. A directed graph (digraph) is an arbitrary relation. The properties we studied here (reflexivity, transitivity) reappear as graph properties (self-loops, reachability), and Warshall's algorithm is a special case of the Floyd-Warshall shortest path algorithm.</p>

<h3>Relations in Number Theory</h3>

<p>The divisibility relation and congruence modulo \\(n\\) are central to number theory (Part E). The Chinese Remainder Theorem, Euler's theorem, and RSA encryption all build on the equivalence classes of \\(\\mathbb{Z}/n\\mathbb{Z}\\).</p>

<h3>Summary of Key Results</h3>

<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:0.92em;">
    <tr style="border-bottom:2px solid var(--border-default);">
        <th style="padding:8px; text-align:left;">Concept</th>
        <th style="padding:8px; text-align:left;">Key Properties</th>
        <th style="padding:8px; text-align:left;">Examples</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Equivalence relation</td>
        <td style="padding:8px;">Reflexive + Symmetric + Transitive</td>
        <td style="padding:8px;">\\(=\\), \\(\\equiv \\pmod{n}\\), same parity</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Partial order</td>
        <td style="padding:8px;">Reflexive + Antisymmetric + Transitive</td>
        <td style="padding:8px;">\\(\\leq\\), \\(\\mid\\), \\(\\subseteq\\)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Total order</td>
        <td style="padding:8px;">Partial order + totality</td>
        <td style="padding:8px;">\\(\\leq\\) on \\(\\mathbb{Z}\\), lexicographic order</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Lattice</td>
        <td style="padding:8px;">Poset with meet and join for all pairs</td>
        <td style="padding:8px;">Divisors of \\(n\\), power set \\(\\mathcal{P}(S)\\)</td>
    </tr>
    <tr>
        <td style="padding:8px;">Transitive closure</td>
        <td style="padding:8px;">Smallest transitive superset of \\(R\\)</td>
        <td style="padding:8px;">Reachability in a digraph</td>
    </tr>
</table>

<div class="env-block remark">
    <div class="env-title">Connections</div>
    <div class="env-body">
        <p>The Fundamental Theorem of Equivalence Relations (Theorem 4.1) is one of the most useful tools in mathematics. Whenever you encounter a partition, there is a hidden equivalence relation; whenever you encounter an equivalence relation, there is a hidden partition. Learning to spot these correspondences is a key mathematical skill.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'A function \\(f: A \\to B\\) is a relation. Which of the four properties (reflexive, symmetric, antisymmetric, transitive) does the relation \\(f \\subseteq A \\times B\\) necessarily satisfy? (Be careful: the relation is from \\(A\\) to \\(B\\), not on \\(A\\).)',
                    hint: 'The four properties are defined for relations on a single set. What does it mean for a relation from A to B when A and B might be different?',
                    solution: 'The four properties (reflexive, symmetric, antisymmetric, transitive) are defined for relations on a <em>single set</em> \\(A\\). For a function \\(f: A \\to B\\) with \\(A \\neq B\\), they do not directly apply. If \\(A = B\\), the function \\(f\\) as a relation need not be reflexive (\\(f(a) \\neq a\\) in general), need not be symmetric or antisymmetric, and need not be transitive. The key property of functions is the "single-valued" condition: each \\(a\\) maps to exactly one \\(b\\).'
                },
                {
                    question: 'Let \\(R\\) be a relation on a finite set \\(A\\). Prove or disprove: if \\(R\\) is symmetric and transitive, then \\(R\\) is reflexive.',
                    hint: 'This is false. Find a counterexample. The empty relation is a good starting point.',
                    solution: 'False. The empty relation \\(R = \\emptyset\\) on \\(\\{1, 2\\}\\) is vacuously symmetric and transitive, but not reflexive (since \\((1,1) \\notin R\\)). The subtlety: symmetry + transitivity give \\(a \\mathrel{R} b \\Rightarrow a \\mathrel{R} a\\), but only for elements \\(a\\) that are <em>related to something</em>. Elements not appearing in any pair are uncontrolled.'
                },
                {
                    question: 'How many partial orders are there on \\(\\{1, 2, 3\\}\\)? (Hint: enumerate or use the fact that partial orders correspond to DAGs plus a topological property.)',
                    hint: 'List all reflexive, antisymmetric, transitive relations on a 3-element set. This requires checking subsets of off-diagonal entries.',
                    solution: 'There are 19 partial orders on a 3-element set. The count includes: 1 with no comparabilities beyond reflexivity (the discrete order), 6 with exactly one comparability, 6 with exactly two (forming a chain of length 2), and 6 total orders (all 3! = 6 linear orders). The sequence for \\(n = 0, 1, 2, 3, 4\\) is 1, 1, 3, 19, 219 (OEIS A001035).'
                }
            ]
        }
    ]
});
