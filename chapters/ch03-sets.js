window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch03',
    number: 3,
    title: 'Sets & Set Operations',
    subtitle: 'The foundation of mathematics',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Sets?',
            content: `
<h2>Why Sets?</h2>

<div class="env-block intuition">
    <div class="env-title">The Language Everything Rests On</div>
    <div class="env-body">
        <p>Open any mathematics textbook past the introductory chapter, and you will find the word "set" within the first page. Functions are sets of ordered pairs. Probability spaces are sets of outcomes. Graphs are sets of vertices and edges. Relations are sets of tuples. Number systems are sets with operations. Sets are not one branch of mathematics; they are the <em>language</em> in which all of mathematics is written.</p>
    </div>
</div>

<p>Georg Cantor introduced set theory in the 1870s with a deceptively simple idea: a <strong>set</strong> is any well-defined collection of distinct objects. "Well-defined" means that for every object, we can determine unambiguously whether it belongs to the collection or not. This single idea turned out to be powerful enough to serve as a foundation for all of mathematics.</p>

<h3>Sets in Computer Science</h3>

<p>Sets are not merely an abstract mathematical curiosity. They appear throughout computer science:</p>
<ul>
    <li><strong>Databases:</strong> A relational database table is a set of tuples. SQL operations (SELECT, JOIN, UNION, INTERSECT, EXCEPT) correspond directly to set operations.</li>
    <li><strong>Type systems:</strong> Types in programming languages can be understood as sets of values. Union types, intersection types, and the empty type correspond to set union, intersection, and the empty set.</li>
    <li><strong>Algorithms:</strong> Hash sets, tree sets, and bit vectors are data structures that implement the set abstraction. Membership testing, union, and intersection are among the most fundamental operations in algorithm design.</li>
    <li><strong>Formal verification:</strong> Program correctness proofs reason about sets of states, sets of inputs, and sets of reachable configurations.</li>
</ul>

<h3>What This Chapter Covers</h3>

<p>We begin with the basic language of sets: membership, subsets, the empty set, and the power set. We then develop the algebra of set operations (union, intersection, complement, difference, symmetric difference) and visualize them with Venn diagrams. The chapter culminates with the surprising results of Cantor on the sizes of infinite sets: that some infinities are genuinely larger than others.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Cantor's work on infinite sets was deeply controversial in his time. Leopold Kronecker called him a "scientific charlatan," and Henri Poincar&eacute; described set theory as a "disease" from which mathematics would eventually recover. Instead, set theory became the standard foundation, and Hilbert declared: "No one shall expel us from the paradise that Cantor has created."</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Sets & Membership
        // ================================================================
        {
            id: 'sec-basics',
            title: 'Sets & Membership',
            content: `
<h2>Sets &amp; Membership</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Set)</div>
    <div class="env-body">
        <p>A <strong>set</strong> is an unordered collection of distinct objects, called <strong>elements</strong> (or <strong>members</strong>). We write \\(a \\in A\\) to mean "\\(a\\) is an element of \\(A\\)," and \\(a \\notin A\\) to mean "\\(a\\) is not an element of \\(A\\)."</p>
    </div>
</div>

<p>Two fundamental properties distinguish sets from other collections:</p>
<ol>
    <li><strong>No duplicates:</strong> \\(\\{1, 2, 2, 3\\} = \\{1, 2, 3\\}\\). Listing an element twice does not change the set.</li>
    <li><strong>No order:</strong> \\(\\{1, 2, 3\\} = \\{3, 1, 2\\}\\). The arrangement of elements is irrelevant.</li>
</ol>

<h3>Describing Sets</h3>

<p>There are two standard ways to specify a set:</p>

<div class="env-block definition">
    <div class="env-title">Definition (Roster Notation)</div>
    <div class="env-body">
        <p><strong>Roster notation</strong> (also called <em>enumeration</em>) lists all elements explicitly:</p>
        \\[A = \\{2, 4, 6, 8, 10\\}.\\]
        <p>For infinite sets with a clear pattern, we use ellipsis: \\(\\mathbb{N} = \\{0, 1, 2, 3, \\ldots\\}\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Set-Builder Notation)</div>
    <div class="env-body">
        <p><strong>Set-builder notation</strong> describes elements by a property:</p>
        \\[A = \\{x \\in \\mathbb{Z} \\mid x \\text{ is even and } 1 \\leq x \\leq 10\\}.\\]
        <p>Read this as "the set of all integers \\(x\\) such that \\(x\\) is even and between 1 and 10." The vertical bar \\(\\mid\\) (or colon :) means "such that."</p>
    </div>
</div>

<h3>Important Sets</h3>

<p>Standard notation for number sets that appear throughout mathematics:</p>
<ul>
    <li>\\(\\mathbb{N} = \\{0, 1, 2, 3, \\ldots\\}\\) (natural numbers; some authors start at 1)</li>
    <li>\\(\\mathbb{Z} = \\{\\ldots, -2, -1, 0, 1, 2, \\ldots\\}\\) (integers)</li>
    <li>\\(\\mathbb{Q}\\) (rational numbers: all fractions \\(p/q\\) with \\(p, q \\in \\mathbb{Z}, q \\neq 0\\))</li>
    <li>\\(\\mathbb{R}\\) (real numbers)</li>
    <li>\\(\\mathbb{C}\\) (complex numbers)</li>
</ul>

<h3>Subsets</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Subset)</div>
    <div class="env-body">
        <p>\\(A\\) is a <strong>subset</strong> of \\(B\\), written \\(A \\subseteq B\\), if every element of \\(A\\) is also an element of \\(B\\):</p>
        \\[A \\subseteq B \\iff (\\forall x)(x \\in A \\rightarrow x \\in B).\\]
        <p>If \\(A \\subseteq B\\) and \\(A \\neq B\\), we write \\(A \\subset B\\) and say \\(A\\) is a <strong>proper subset</strong> of \\(B\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.1 (Set Equality)</div>
    <div class="env-body">
        <p>Two sets are equal if and only if each is a subset of the other:</p>
        \\[A = B \\iff (A \\subseteq B \\text{ and } B \\subseteq A).\\]
    </div>
</div>

<p>This is the standard technique for proving set equality: show mutual inclusion.</p>

<h3>The Empty Set</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Empty Set)</div>
    <div class="env-body">
        <p>The <strong>empty set</strong>, written \\(\\emptyset\\) or \\(\\{\\}\\), is the set with no elements. For every object \\(x\\), \\(x \\notin \\emptyset\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.2</div>
    <div class="env-body">
        <p>The empty set is a subset of every set: for any set \\(A\\), \\(\\emptyset \\subseteq A\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>We must show: for all \\(x\\), if \\(x \\in \\emptyset\\) then \\(x \\in A\\). Since there is no \\(x \\in \\emptyset\\), the implication is <em>vacuously true</em>.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Power Set</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Power Set)</div>
    <div class="env-body">
        <p>The <strong>power set</strong> of \\(A\\), denoted \\(\\mathcal{P}(A)\\) or \\(2^A\\), is the set of all subsets of \\(A\\):</p>
        \\[\\mathcal{P}(A) = \\{S \\mid S \\subseteq A\\}.\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>If \\(A = \\{1, 2, 3\\}\\), then</p>
        \\[\\mathcal{P}(A) = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{3\\}, \\{1,2\\}, \\{1,3\\}, \\{2,3\\}, \\{1,2,3\\}\\}.\\]
        <p>Note \\(|\\mathcal{P}(A)| = 2^3 = 8\\). In general, if \\(|A| = n\\), then \\(|\\mathcal{P}(A)| = 2^n\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.3</div>
    <div class="env-body">
        <p>If \\(A\\) is a finite set with \\(|A| = n\\) elements, then \\(|\\mathcal{P}(A)| = 2^n\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Each element of \\(A\\) is either included or excluded from a given subset. These are \\(n\\) independent binary choices, giving \\(2^n\\) subsets total.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="viz-placeholder" data-viz="viz-power-set"></div>
`,
            visualizations: [
                {
                    id: 'viz-power-set',
                    title: 'Power Set Lattice',
                    description: 'Enter a set (comma-separated elements) and see all its subsets organized as a Hasse diagram. Each level groups subsets by size; lines connect subsets that differ by exactly one element.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var elements = ['a', 'b', 'c'];

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;';
                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.value = 'a, b, c';
                        inp.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.82rem;width:180px;';
                        var btn = document.createElement('button');
                        btn.textContent = 'Update';
                        btn.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                        btn.addEventListener('click', function() {
                            var raw = inp.value.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
                            var unique = [];
                            for (var i = 0; i < raw.length; i++) {
                                if (unique.indexOf(raw[i]) === -1) unique.push(raw[i]);
                            }
                            if (unique.length > 5) { unique = unique.slice(0, 5); }
                            elements = unique;
                            draw();
                        });
                        inputDiv.appendChild(inp);
                        inputDiv.appendChild(btn);
                        controls.appendChild(inputDiv);

                        function getSubsets(elems) {
                            var n = elems.length;
                            var total = 1 << n;
                            var result = [];
                            for (var mask = 0; mask < total; mask++) {
                                var sub = [];
                                for (var j = 0; j < n; j++) {
                                    if (mask & (1 << j)) sub.push(elems[j]);
                                }
                                result.push(sub);
                            }
                            return result;
                        }

                        function subsetLabel(sub) {
                            if (sub.length === 0) return '\u2205';
                            return '{' + sub.join(', ') + '}';
                        }

                        function diffByOne(a, b) {
                            if (b.length !== a.length + 1) return false;
                            var count = 0;
                            for (var i = 0; i < b.length; i++) {
                                if (a.indexOf(b[i]) === -1) count++;
                            }
                            return count === 1;
                        }

                        var nodeColors = [viz.colors.purple, viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange, viz.colors.yellow];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var n = elements.length;
                            var subs = getSubsets(elements);

                            viz.screenText('\u2118(' + subsetLabel(elements) + ')  =  ' + subs.length + ' subsets', viz.width / 2, 20, viz.colors.white, 14);

                            // Group by size
                            var levels = [];
                            for (var k = 0; k <= n; k++) levels.push([]);
                            for (var i = 0; i < subs.length; i++) levels[subs[i].length].push(subs[i]);

                            var levelY = [];
                            var gap = Math.min(60, (viz.height - 80) / (n + 1));
                            for (var lv = 0; lv <= n; lv++) {
                                levelY.push(viz.height - 40 - lv * gap);
                            }

                            // Compute positions for each node
                            var nodePos = {};
                            for (var lv = 0; lv <= n; lv++) {
                                var arr = levels[lv];
                                var w = Math.min(100, (viz.width - 60) / Math.max(arr.length, 1));
                                var totalW = arr.length * w;
                                var sx = (viz.width - totalW) / 2 + w / 2;
                                for (var j = 0; j < arr.length; j++) {
                                    var key = arr[j].join(',');
                                    nodePos[key] = { x: sx + j * w, y: levelY[lv], sub: arr[j] };
                                }
                            }

                            // Draw edges
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1;
                            for (var lv = 0; lv < n; lv++) {
                                for (var a = 0; a < levels[lv].length; a++) {
                                    for (var b = 0; b < levels[lv + 1].length; b++) {
                                        if (diffByOne(levels[lv][a], levels[lv + 1][b])) {
                                            var ka = levels[lv][a].join(',');
                                            var kb = levels[lv + 1][b].join(',');
                                            var pa = nodePos[ka], pb = nodePos[kb];
                                            ctx.beginPath();
                                            ctx.moveTo(pa.x, pa.y);
                                            ctx.lineTo(pb.x, pb.y);
                                            ctx.stroke();
                                        }
                                    }
                                }
                            }

                            // Draw nodes
                            for (var key in nodePos) {
                                var nd = nodePos[key];
                                var col = nodeColors[nd.sub.length % nodeColors.length];
                                ctx.fillStyle = col + '33';
                                ctx.beginPath();
                                ctx.arc(nd.x, nd.y, 14, 0, Math.PI * 2);
                                ctx.fill();

                                var lbl = subsetLabel(nd.sub);
                                var fs = lbl.length > 10 ? 8 : (lbl.length > 6 ? 9 : 10);
                                ctx.font = fs + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = col;
                                ctx.fillText(lbl, nd.x, nd.y);
                            }

                            // Level labels
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.muted;
                            for (var lv = 0; lv <= n; lv++) {
                                ctx.fillText('size ' + lv, 8, levelY[lv]);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(A = \\{1, 2, 3, 4, 5\\}\\). How many subsets does \\(A\\) have? How many proper subsets? True or false: \\(\\{\\emptyset\\} = \\emptyset\\).',
                    hint: 'A set with \\(n\\) elements has \\(2^n\\) subsets. A proper subset is any subset that is not equal to \\(A\\) itself. For the last part, compare the number of elements in each set.',
                    solution: 'Total subsets: \\(2^5 = 32\\). Proper subsets: \\(32 - 1 = 31\\) (all subsets except \\(A\\) itself). The statement \\(\\{\\emptyset\\} = \\emptyset\\) is false: \\(\\emptyset\\) has 0 elements, while \\(\\{\\emptyset\\}\\) has 1 element (the empty set itself).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Set Operations
        // ================================================================
        {
            id: 'sec-operations',
            title: 'Set Operations',
            content: `
<h2>Set Operations</h2>

<p>Just as arithmetic builds complex numbers from simple ones using \\(+, -, \\times, \\div\\), set theory builds complex sets from simple ones using operations. All operations are defined relative to a <strong>universal set</strong> \\(U\\) that contains every element under discussion.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Union)</div>
    <div class="env-body">
        <p>The <strong>union</strong> of \\(A\\) and \\(B\\) is the set of elements in \\(A\\) <em>or</em> \\(B\\) (or both):</p>
        \\[A \\cup B = \\{x \\mid x \\in A \\text{ or } x \\in B\\}.\\]
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Intersection)</div>
    <div class="env-body">
        <p>The <strong>intersection</strong> of \\(A\\) and \\(B\\) is the set of elements in <em>both</em> \\(A\\) and \\(B\\):</p>
        \\[A \\cap B = \\{x \\mid x \\in A \\text{ and } x \\in B\\}.\\]
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Complement)</div>
    <div class="env-body">
        <p>The <strong>complement</strong> of \\(A\\) (with respect to \\(U\\)) is the set of elements in \\(U\\) but not in \\(A\\):</p>
        \\[\\overline{A} = A^c = U \\setminus A = \\{x \\in U \\mid x \\notin A\\}.\\]
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Difference)</div>
    <div class="env-body">
        <p>The <strong>set difference</strong> \\(A \\setminus B\\) (also written \\(A - B\\)) is the set of elements in \\(A\\) but not in \\(B\\):</p>
        \\[A \\setminus B = \\{x \\mid x \\in A \\text{ and } x \\notin B\\} = A \\cap \\overline{B}.\\]
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Symmetric Difference)</div>
    <div class="env-body">
        <p>The <strong>symmetric difference</strong> of \\(A\\) and \\(B\\) is the set of elements in exactly one of the two sets:</p>
        \\[A \\triangle B = (A \\setminus B) \\cup (B \\setminus A) = (A \\cup B) \\setminus (A \\cap B).\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Let \\(U = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\\}\\), \\(A = \\{1, 2, 3, 4, 5\\}\\), \\(B = \\{3, 4, 5, 6, 7\\}\\). Then:</p>
        <ul>
            <li>\\(A \\cup B = \\{1, 2, 3, 4, 5, 6, 7\\}\\)</li>
            <li>\\(A \\cap B = \\{3, 4, 5\\}\\)</li>
            <li>\\(A \\setminus B = \\{1, 2\\}\\)</li>
            <li>\\(B \\setminus A = \\{6, 7\\}\\)</li>
            <li>\\(A \\triangle B = \\{1, 2, 6, 7\\}\\)</li>
            <li>\\(\\overline{A} = \\{6, 7, 8, 9, 10\\}\\)</li>
        </ul>
    </div>
</div>

<p>Sets \\(A\\) and \\(B\\) are <strong>disjoint</strong> if \\(A \\cap B = \\emptyset\\).</p>

<div class="viz-placeholder" data-viz="viz-set-operations"></div>
`,
            visualizations: [
                {
                    id: 'viz-set-operations',
                    title: 'Set Operations Explorer',
                    description: 'Enter two sets and see the results of union, intersection, difference, and symmetric difference computed and displayed visually.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var setA = [1, 2, 3, 4, 5];
                        var setB = [3, 4, 5, 6, 7];

                        var row = document.createElement('div');
                        row.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';

                        var lA = document.createElement('span');
                        lA.textContent = 'A:';
                        lA.style.cssText = 'color:#58a6ff;font-size:0.82rem;';
                        var inpA = document.createElement('input');
                        inpA.type = 'text'; inpA.value = '1, 2, 3, 4, 5';
                        inpA.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.82rem;width:140px;';
                        var lB = document.createElement('span');
                        lB.textContent = 'B:';
                        lB.style.cssText = 'color:#3fb9a0;font-size:0.82rem;';
                        var inpB = document.createElement('input');
                        inpB.type = 'text'; inpB.value = '3, 4, 5, 6, 7';
                        inpB.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.82rem;width:140px;';

                        var goBtn = document.createElement('button');
                        goBtn.textContent = 'Compute';
                        goBtn.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                        goBtn.addEventListener('click', function() {
                            setA = inpA.value.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
                            setB = inpB.value.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
                            draw();
                        });

                        row.appendChild(lA); row.appendChild(inpA);
                        row.appendChild(lB); row.appendChild(inpB);
                        row.appendChild(goBtn);
                        controls.appendChild(row);

                        function arrStr(arr) {
                            if (arr.length === 0) return '\u2205';
                            return '{' + arr.join(', ') + '}';
                        }

                        function setUnion(a, b) {
                            var r = a.slice();
                            for (var i = 0; i < b.length; i++) {
                                if (r.indexOf(b[i]) === -1) r.push(b[i]);
                            }
                            return r;
                        }
                        function setIntersect(a, b) {
                            return a.filter(function(x) { return b.indexOf(x) !== -1; });
                        }
                        function setDiff(a, b) {
                            return a.filter(function(x) { return b.indexOf(x) === -1; });
                        }
                        function setSymDiff(a, b) {
                            return setUnion(setDiff(a, b), setDiff(b, a));
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var results = [
                                { label: 'A \u222A B  (Union)', value: setUnion(setA, setB), color: viz.colors.blue },
                                { label: 'A \u2229 B  (Intersection)', value: setIntersect(setA, setB), color: viz.colors.teal },
                                { label: 'A \u2216 B  (Difference)', value: setDiff(setA, setB), color: viz.colors.orange },
                                { label: 'B \u2216 A  (Difference)', value: setDiff(setB, setA), color: viz.colors.purple },
                                { label: 'A \u25B3 B  (Symmetric Diff)', value: setSymDiff(setA, setB), color: viz.colors.green }
                            ];

                            // Header
                            viz.screenText('A = ' + arrStr(setA), viz.width * 0.3, 22, viz.colors.blue, 13);
                            viz.screenText('B = ' + arrStr(setB), viz.width * 0.7, 22, viz.colors.teal, 13);

                            // Draw Venn overview on top half
                            var cxA = viz.width * 0.38, cxB = viz.width * 0.62, cy = 130, cr = 70;
                            ctx.globalAlpha = 0.15;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(cxA, cy, cr, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(cxB, cy, cr, 0, Math.PI * 2); ctx.fill();
                            ctx.globalAlpha = 1;
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(cxA, cy, cr, 0, Math.PI * 2); ctx.stroke();
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(cxB, cy, cr, 0, Math.PI * 2); ctx.stroke();

                            // Place elements in Venn
                            var onlyA = setDiff(setA, setB);
                            var onlyB = setDiff(setB, setA);
                            var both = setIntersect(setA, setB);

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

                            // Only A elements (left side)
                            for (var i = 0; i < onlyA.length; i++) {
                                var ang = (i / Math.max(onlyA.length, 1)) * Math.PI * 2;
                                var ex = cxA - 25 + Math.cos(ang) * 25;
                                var ey = cy + Math.sin(ang) * Math.min(20, cr * 0.4);
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText(onlyA[i], ex, ey);
                            }
                            // Only B elements (right side)
                            for (var i = 0; i < onlyB.length; i++) {
                                var ang = (i / Math.max(onlyB.length, 1)) * Math.PI * 2;
                                var ex = cxB + 25 + Math.cos(ang) * 25;
                                var ey = cy + Math.sin(ang) * Math.min(20, cr * 0.4);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText(onlyB[i], ex, ey);
                            }
                            // Intersection elements (center)
                            for (var i = 0; i < both.length; i++) {
                                var midX = (cxA + cxB) / 2;
                                var ey = cy - (both.length - 1) * 8 + i * 16;
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText(both[i], midX, ey);
                            }

                            // Labels
                            viz.screenText('A', cxA - cr + 12, cy - cr + 12, viz.colors.blue, 14);
                            viz.screenText('B', cxB + cr - 12, cy - cr + 12, viz.colors.teal, 14);

                            // Results table
                            var startY = 220;
                            var rowH = 36;
                            for (var r = 0; r < results.length; r++) {
                                var res = results[r];
                                var ry = startY + r * rowH;
                                ctx.fillStyle = res.color + '18';
                                ctx.fillRect(20, ry - 12, viz.width - 40, rowH - 4);
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillStyle = res.color;
                                ctx.fillText(res.label, 30, ry + 5);
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.white;
                                ctx.textAlign = 'right';
                                ctx.fillText(arrStr(res.value), viz.width - 30, ry + 5);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(U = \\{1,\\ldots,10\\}\\), \\(A = \\{2,4,6,8,10\\}\\), \\(B = \\{1,2,3,4,5\\}\\). Find \\(A \\cup B\\), \\(A \\cap B\\), \\(A \\setminus B\\), \\(A \\triangle B\\), and \\(\\overline{A}\\).',
                    hint: 'Apply each definition directly. For symmetric difference, find elements in exactly one of the two sets.',
                    solution: '\\(A \\cup B = \\{1,2,3,4,5,6,8,10\\}\\), \\(A \\cap B = \\{2,4\\}\\), \\(A \\setminus B = \\{6,8,10\\}\\), \\(A \\triangle B = \\{1,3,5,6,8,10\\}\\), \\(\\overline{A} = \\{1,3,5,7,9\\}\\).'
                },
                {
                    question: 'Let \\(A = \\{1,2,3,4\\}\\) and \\(B = \\{2,4,6,8\\}\\). Verify that \\(|A \\cup B| = |A| + |B| - |A \\cap B|\\).',
                    hint: 'Compute each side explicitly.',
                    solution: '\\(A \\cup B = \\{1,2,3,4,6,8\\}\\), so \\(|A \\cup B| = 6\\). Also \\(|A| + |B| - |A \\cap B| = 4 + 4 - |\\{2,4\\}| = 4 + 4 - 2 = 6\\). This is the inclusion-exclusion principle for two sets.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Venn Diagrams
        // ================================================================
        {
            id: 'sec-venn',
            title: 'Venn Diagrams',
            content: `
<h2>Venn Diagrams</h2>

<p>A <strong>Venn diagram</strong> represents sets as overlapping regions within a rectangle (the universal set \\(U\\)). For two sets, the diagram has \\(2^2 = 4\\) distinct regions; for three sets, \\(2^3 = 8\\) regions. Each region corresponds to a unique combination of membership and non-membership in each set.</p>

<h3>Two-Set Venn Diagrams</h3>

<p>The four regions of a two-set Venn diagram correspond to:</p>
<ol>
    <li>\\(A \\cap B\\) (the overlap)</li>
    <li>\\(A \\setminus B\\) (in \\(A\\) only)</li>
    <li>\\(B \\setminus A\\) (in \\(B\\) only)</li>
    <li>\\(\\overline{A \\cup B}\\) (outside both, the complement of the union)</li>
</ol>

<div class="viz-placeholder" data-viz="viz-venn-2"></div>

<h3>Three-Set Venn Diagrams</h3>

<p>With three sets \\(A, B, C\\), there are \\(2^3 = 8\\) regions. Each region corresponds to membership/non-membership in all three sets. For instance, \\(A \\cap B \\cap \\overline{C}\\) is the region inside both \\(A\\) and \\(B\\) but outside \\(C\\).</p>

<div class="viz-placeholder" data-viz="viz-venn-3"></div>

<div class="env-block remark">
    <div class="env-title">Why Venn Diagrams Work</div>
    <div class="env-body">
        <p>Venn diagrams are not just pretty pictures. They provide a visual proof technique: to verify a set identity, shade the left-hand side and the right-hand side separately, and check that the shaded regions coincide. This works for identities involving finitely many sets, though algebraic proofs (element-chasing) are more rigorous for general statements.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-venn-2',
                    title: 'Interactive 2-Set Venn Diagram',
                    description: 'Click on any region to toggle its shading. The set expression describing the shaded region is displayed below. Use this to build intuition for set operations.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        // 4 regions: 0=A only, 1=B only, 2=A&B, 3=neither
                        var regionActive = [false, false, false, false];
                        var regionNames = ['A \u2216 B', 'B \u2216 A', 'A \u2229 B', '\u0100\u0304 \u222A B\u0304'];
                        var regionExprs = ['A \u2216 B', 'B \u2216 A', 'A \u2229 B', '(A \u222A B)\u1d9c'];

                        var cxA = 210, cxB = 350, cy = 160, cr = 100;
                        var rectL = 60, rectT = 30, rectW = 440, rectH = 260;

                        function getRegion(x, y) {
                            var inA = Math.sqrt((x - cxA) * (x - cxA) + (y - cy) * (y - cy)) <= cr;
                            var inB = Math.sqrt((x - cxB) * (x - cxB) + (y - cy) * (y - cy)) <= cr;
                            if (inA && inB) return 2;
                            if (inA) return 0;
                            if (inB) return 1;
                            if (x >= rectL && x <= rectL + rectW && y >= rectT && y <= rectT + rectH) return 3;
                            return -1;
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var r = getRegion(mx, my);
                            if (r >= 0) {
                                regionActive[r] = !regionActive[r];
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Clear All', function() {
                            regionActive = [false, false, false, false];
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Universe rectangle
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(rectL, rectT, rectW, rectH);
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.muted;
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'top';
                            ctx.fillText('U', rectL + rectW - 6, rectT + 4);

                            // Fill active regions using pixel test
                            var imgData = ctx.getImageData(0, 0, viz.width, viz.height);
                            var data = imgData.data;
                            var colors = [
                                [88, 166, 255],  // blue for A only
                                [63, 185, 160],  // teal for B only
                                [63, 185, 80],   // green for A&B
                                [188, 140, 255]   // purple for outside
                            ];
                            for (var py = rectT; py < rectT + rectH; py++) {
                                for (var px = rectL; px < rectL + rectW; px++) {
                                    var r = getRegion(px, py);
                                    if (r >= 0 && regionActive[r]) {
                                        var idx = (py * viz.width + px) * 4;
                                        var c = colors[r];
                                        data[idx] = c[0];
                                        data[idx + 1] = c[1];
                                        data[idx + 2] = c[2];
                                        data[idx + 3] = 100;
                                    }
                                }
                            }
                            ctx.putImageData(imgData, 0, 0);

                            // Circle outlines
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.arc(cxA, cy, cr, 0, Math.PI * 2); ctx.stroke();
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(cxB, cy, cr, 0, Math.PI * 2); ctx.stroke();

                            // Labels
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('A', cxA - cr + 25, cy - cr + 25);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('B', cxB + cr - 25, cy - cr + 25);

                            // Rectangle outline on top
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(rectL, rectT, rectW, rectH);

                            // Expression
                            var active = [];
                            for (var i = 0; i < 4; i++) {
                                if (regionActive[i]) active.push(regionExprs[i]);
                            }
                            var expr = active.length === 0 ? 'Click a region to select it' :
                                       active.length === 4 ? 'U (Universal set)' :
                                       active.join(' \u222A ');
                            viz.screenText(expr, viz.width / 2, viz.height - 30, viz.colors.white, 13);
                            viz.screenText('Click regions to toggle shading', viz.width / 2, viz.height - 10, viz.colors.muted, 10);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-venn-3',
                    title: 'Interactive 3-Set Venn Diagram',
                    description: 'All 8 regions of a three-set Venn diagram are clickable. Toggle regions to explore which set expression corresponds to each area.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        // 8 regions indexed by bitmask: bit0=A, bit1=B, bit2=C
                        var regionActive = [false, false, false, false, false, false, false, false];

                        var cxA = 230, cyA = 150, cxB = 330, cyB = 150, cxC = 280, cyC = 235;
                        var cr = 90;
                        var rectL = 60, rectT = 30, rectW = 440, rectH = 320;

                        function getRegion(x, y) {
                            var inA = Math.sqrt((x - cxA) * (x - cxA) + (y - cyA) * (y - cyA)) <= cr;
                            var inB = Math.sqrt((x - cxB) * (x - cxB) + (y - cyB) * (y - cyB)) <= cr;
                            var inC = Math.sqrt((x - cxC) * (x - cxC) + (y - cyC) * (y - cyC)) <= cr;
                            var mask = (inA ? 1 : 0) | (inB ? 2 : 0) | (inC ? 4 : 0);
                            if (mask === 0 && x >= rectL && x <= rectL + rectW && y >= rectT && y <= rectT + rectH) return 0;
                            return mask;
                        }

                        var regionLabels = [
                            'Outside all', 'A only', 'B only', 'A \u2229 B only',
                            'C only', 'A \u2229 C only', 'B \u2229 C only', 'A \u2229 B \u2229 C'
                        ];

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var r = getRegion(mx, my);
                            if (r >= 0 && r < 8) {
                                regionActive[r] = !regionActive[r];
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Clear All', function() {
                            regionActive = [false, false, false, false, false, false, false, false];
                            draw();
                        });

                        VizEngine.createButton(controls, 'Select A', function() {
                            regionActive = [false, false, false, false, false, false, false, false];
                            regionActive[1] = true; regionActive[3] = true; regionActive[5] = true; regionActive[7] = true;
                            draw();
                        });

                        VizEngine.createButton(controls, 'A \u222A B', function() {
                            regionActive = [false, false, false, false, false, false, false, false];
                            regionActive[1] = true; regionActive[2] = true; regionActive[3] = true;
                            regionActive[5] = true; regionActive[6] = true; regionActive[7] = true;
                            draw();
                        });

                        VizEngine.createButton(controls, 'A \u2229 B \u2229 C', function() {
                            regionActive = [false, false, false, false, false, false, false, false];
                            regionActive[7] = true;
                            draw();
                        });

                        var regionColors = [
                            [100, 100, 120], // outside
                            [88, 166, 255],  // A only
                            [63, 185, 160],  // B only
                            [63, 185, 80],   // A&B
                            [248, 81, 73],   // C only
                            [188, 140, 255], // A&C
                            [240, 136, 62],  // B&C
                            [247, 120, 186]  // A&B&C
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Fill active regions
                            var imgData = ctx.getImageData(0, 0, viz.width, viz.height);
                            var data = imgData.data;
                            for (var py = rectT; py < rectT + rectH; py++) {
                                for (var px = rectL; px < rectL + rectW; px++) {
                                    var r = getRegion(px, py);
                                    if (r >= 0 && r < 8 && regionActive[r]) {
                                        var idx = (py * viz.width + px) * 4;
                                        var c = regionColors[r];
                                        data[idx] = c[0];
                                        data[idx + 1] = c[1];
                                        data[idx + 2] = c[2];
                                        data[idx + 3] = 100;
                                    }
                                }
                            }
                            ctx.putImageData(imgData, 0, 0);

                            // Circle outlines
                            ctx.lineWidth = 2.5;
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(cxA, cyA, cr, 0, Math.PI * 2); ctx.stroke();
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(cxB, cyB, cr, 0, Math.PI * 2); ctx.stroke();
                            ctx.strokeStyle = viz.colors.red;
                            ctx.beginPath(); ctx.arc(cxC, cyC, cr, 0, Math.PI * 2); ctx.stroke();

                            // Labels
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('A', cxA - cr + 15, cyA - cr + 20);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('B', cxB + cr - 15, cyB - cr + 20);
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillText('C', cxC, cyC + cr - 10);

                            // Universe
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(rectL, rectT, rectW, rectH);
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.muted;
                            ctx.textAlign = 'right'; ctx.textBaseline = 'top';
                            ctx.fillText('U', rectL + rectW - 6, rectT + 4);

                            // Active region labels
                            var active = [];
                            for (var i = 0; i < 8; i++) {
                                if (regionActive[i]) active.push(regionLabels[i]);
                            }
                            var expr = active.length === 0 ? 'Click regions to toggle' :
                                       active.length === 8 ? 'U' :
                                       active.join(', ');
                            if (expr.length > 70) expr = active.length + ' regions selected';
                            viz.screenText(expr, viz.width / 2, viz.height - 15, viz.colors.white, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using a Venn diagram, shade the region corresponding to \\(A \\cap (B \\cup C)\\). Then shade \\((A \\cap B) \\cup (A \\cap C)\\). Are they the same?',
                    hint: 'This is the distributive law. Try shading each step on a 3-set Venn diagram.',
                    solution: 'Both expressions shade exactly the same regions, confirming the distributive law: \\(A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)\\). In both cases the shaded region is the part of \\(A\\) that overlaps with \\(B\\), \\(C\\), or both.'
                },
                {
                    question: 'In a 3-set Venn diagram, how many of the 8 regions are contained in the expression \\((A \\cup B) \\setminus C\\)?',
                    hint: 'Shade \\(A \\cup B\\) first, then remove everything in \\(C\\).',
                    solution: '\\(A \\cup B\\) covers 6 of the 8 regions (all except "C only" and "outside all"). Removing \\(C\\) removes regions that include \\(C\\), leaving: A only, B only, A\\(\\cap\\)B only. That is 3 regions.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Laws of Set Algebra
        // ================================================================
        {
            id: 'sec-laws',
            title: 'Laws of Set Algebra',
            content: `
<h2>Laws of Set Algebra</h2>

<p>Set operations obey a rich collection of algebraic laws that parallel (and generalize) the laws of logic. These laws allow us to simplify and manipulate set expressions just as we simplify algebraic expressions.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.4 (Fundamental Laws of Set Algebra)</div>
    <div class="env-body">
        <p>For any sets \\(A, B, C\\) within a universal set \\(U\\):</p>

        <p><strong>Commutative Laws:</strong></p>
        \\[A \\cup B = B \\cup A, \\qquad A \\cap B = B \\cap A.\\]

        <p><strong>Associative Laws:</strong></p>
        \\[A \\cup (B \\cup C) = (A \\cup B) \\cup C, \\qquad A \\cap (B \\cap C) = (A \\cap B) \\cap C.\\]

        <p><strong>Distributive Laws:</strong></p>
        \\[A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C),\\]
        \\[A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C).\\]

        <p><strong>Identity Laws:</strong></p>
        \\[A \\cup \\emptyset = A, \\qquad A \\cap U = A.\\]

        <p><strong>Complement Laws:</strong></p>
        \\[A \\cup \\overline{A} = U, \\qquad A \\cap \\overline{A} = \\emptyset, \\qquad \\overline{\\overline{A}} = A.\\]

        <p><strong>Absorption Laws:</strong></p>
        \\[A \\cup (A \\cap B) = A, \\qquad A \\cap (A \\cup B) = A.\\]
    </div>
</div>

<h3>De Morgan's Laws</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.5 (De Morgan's Laws for Sets)</div>
    <div class="env-body">
        <p>For any sets \\(A\\) and \\(B\\):</p>
        \\[\\overline{A \\cup B} = \\overline{A} \\cap \\overline{B},\\]
        \\[\\overline{A \\cap B} = \\overline{A} \\cup \\overline{B}.\\]
        <p>In words: the complement of a union is the intersection of complements, and the complement of an intersection is the union of complements.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of the First De Morgan Law</div>
    <div class="env-body">
        <p>We prove \\(\\overline{A \\cup B} = \\overline{A} \\cap \\overline{B}\\) by mutual inclusion.</p>
        <p><strong>(\\(\\subseteq\\))</strong> Let \\(x \\in \\overline{A \\cup B}\\). Then \\(x \\notin A \\cup B\\), which means \\(x \\notin A\\) and \\(x \\notin B\\). So \\(x \\in \\overline{A}\\) and \\(x \\in \\overline{B}\\), giving \\(x \\in \\overline{A} \\cap \\overline{B}\\).</p>
        <p><strong>(\\(\\supseteq\\))</strong> Let \\(x \\in \\overline{A} \\cap \\overline{B}\\). Then \\(x \\notin A\\) and \\(x \\notin B\\), so \\(x \\notin A \\cup B\\), giving \\(x \\in \\overline{A \\cup B}\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>These laws have direct analogues in propositional logic (replace \\(\\cup\\) with \\(\\lor\\), \\(\\cap\\) with \\(\\land\\), complement with \\(\\neg\\)), databases (UNION with OR, INTERSECT with AND), and programming (bitwise OR with |, AND with &amp;, NOT with ~).</p>

<div class="viz-placeholder" data-viz="viz-de-morgan-sets"></div>
`,
            visualizations: [
                {
                    id: 'viz-de-morgan-sets',
                    title: "De Morgan's Laws Animated",
                    description: "Watch how the complement of a union equals the intersection of complements. The animation shows both sides step by step.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var step = 0;
                        var maxStep = 3;
                        var law = 0; // 0 = first law, 1 = second law

                        VizEngine.createButton(controls, 'First Law: (A\u222AB)\u1d9c = A\u1d9c\u2229B\u1d9c', function() {
                            law = 0; step = 0; draw();
                        });
                        VizEngine.createButton(controls, 'Second Law: (A\u2229B)\u1d9c = A\u1d9c\u222AB\u1d9c', function() {
                            law = 1; step = 0; draw();
                        });
                        VizEngine.createButton(controls, 'Next Step \u2192', function() {
                            step = (step + 1) % (maxStep + 1);
                            draw();
                        });

                        var cxA = 160, cxB = 260, cy = 160, cr = 80;
                        var rectL = 50, rectT = 50, rectW = 280, rectH = 220;

                        function getRegion(x, y) {
                            var inA = Math.sqrt((x - cxA) * (x - cxA) + (y - cy) * (y - cy)) <= cr;
                            var inB = Math.sqrt((x - cxB) * (x - cxB) + (y - cy) * (y - cy)) <= cr;
                            return { inA: inA, inB: inB };
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var leftX = 20, rightX = 310;
                            var titles;
                            if (law === 0) {
                                titles = ['Step ' + step + ': LHS = (A \u222A B)\u1d9c', 'Step ' + step + ': RHS = A\u1d9c \u2229 B\u1d9c'];
                            } else {
                                titles = ['Step ' + step + ': LHS = (A \u2229 B)\u1d9c', 'Step ' + step + ': RHS = A\u1d9c \u222A B\u1d9c'];
                            }

                            // Draw two Venn diagrams side by side
                            for (var side = 0; side < 2; side++) {
                                var offX = side === 0 ? 0 : 290;
                                var lCx = cxA + offX, lCxB = cxB + offX;
                                var lRL = rectL + offX;

                                // Fill regions based on step
                                var imgData = ctx.getImageData(0, 0, viz.width, viz.height);
                                var data = imgData.data;
                                for (var py = rectT; py < rectT + rectH; py++) {
                                    for (var px = lRL; px < lRL + rectW; px++) {
                                        var inA = Math.sqrt((px - lCx) * (px - lCx) + (py - cy) * (py - cy)) <= cr;
                                        var inB = Math.sqrt((px - lCxB) * (px - lCxB) + (py - cy) * (py - cy)) <= cr;
                                        var shade = false;

                                        if (law === 0) {
                                            if (side === 0) { // LHS
                                                if (step === 0) shade = inA || inB;                      // show A union B
                                                else if (step === 1) shade = inA || inB;                 // still highlight union
                                                else shade = !(inA || inB);                               // complement
                                            } else { // RHS
                                                if (step === 0) shade = !inA;                              // Ac
                                                else if (step === 1) shade = !inB;                         // Bc
                                                else shade = !inA && !inB;                                 // Ac intersect Bc
                                            }
                                        } else {
                                            if (side === 0) { // LHS
                                                if (step === 0) shade = inA && inB;                       // A intersect B
                                                else if (step === 1) shade = inA && inB;
                                                else shade = !(inA && inB);                                // complement
                                            } else { // RHS
                                                if (step === 0) shade = !inA;
                                                else if (step === 1) shade = !inB;
                                                else shade = !inA || !inB;                                 // Ac union Bc
                                            }
                                        }

                                        if (shade) {
                                            var idx = (py * viz.width + px) * 4;
                                            var c = side === 0 ? [88, 166, 255] : [63, 185, 160];
                                            if (step >= 2) c = [63, 185, 80];
                                            data[idx] = c[0]; data[idx + 1] = c[1]; data[idx + 2] = c[2]; data[idx + 3] = 90;
                                        }
                                    }
                                }
                                ctx.putImageData(imgData, 0, 0);

                                // Outlines
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(lCx, cy, cr, 0, Math.PI * 2); ctx.stroke();
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.beginPath(); ctx.arc(lCxB, cy, cr, 0, Math.PI * 2); ctx.stroke();
                                ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                                ctx.strokeRect(lRL, rectT, rectW, rectH);

                                // Set labels
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText('A', lCx - 50, cy - 70);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText('B', lCxB + 50, cy - 70);

                                // Title
                                viz.screenText(titles[side], lRL + rectW / 2, 30, side === 0 ? viz.colors.blue : viz.colors.teal, 12);
                            }

                            // Step descriptions
                            var stepDescs;
                            if (law === 0) {
                                stepDescs = [
                                    'Start: LHS shows A \u222A B. RHS shows A\u1d9c.',
                                    'LHS still shows A \u222A B. RHS now shows B\u1d9c.',
                                    'LHS: complement of A \u222A B. RHS: A\u1d9c \u2229 B\u1d9c. They match!',
                                    'Both sides shade exactly the same region. De Morgan verified!'
                                ];
                            } else {
                                stepDescs = [
                                    'Start: LHS shows A \u2229 B. RHS shows A\u1d9c.',
                                    'LHS still shows A \u2229 B. RHS now shows B\u1d9c.',
                                    'LHS: complement of A \u2229 B. RHS: A\u1d9c \u222A B\u1d9c. They match!',
                                    'Both sides shade exactly the same region. De Morgan verified!'
                                ];
                            }

                            viz.screenText(stepDescs[step], viz.width / 2, viz.height - 30, viz.colors.white, 12);
                            viz.screenText('Step ' + step + ' of ' + maxStep, viz.width / 2, viz.height - 10, viz.colors.muted, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove the second De Morgan law: \\(\\overline{A \\cap B} = \\overline{A} \\cup \\overline{B}\\) by element-chasing.',
                    hint: 'Show mutual inclusion. Start with an element in one side and show it belongs to the other.',
                    solution: '\\((\\subseteq)\\) Let \\(x \\in \\overline{A \\cap B}\\). Then \\(x \\notin A \\cap B\\), so \\(x \\notin A\\) or \\(x \\notin B\\). Thus \\(x \\in \\overline{A}\\) or \\(x \\in \\overline{B}\\), so \\(x \\in \\overline{A} \\cup \\overline{B}\\). \\((\\supseteq)\\) Let \\(x \\in \\overline{A} \\cup \\overline{B}\\). Then \\(x \\notin A\\) or \\(x \\notin B\\). Either way, \\(x \\notin A \\cap B\\), so \\(x \\in \\overline{A \\cap B}\\).'
                },
                {
                    question: 'Simplify \\(\\overline{\\overline{A} \\cup B} \\cup (A \\cap B)\\) using set algebra laws.',
                    hint: 'Apply De Morgan to the first term, then use the absorption law.',
                    solution: '\\(\\overline{\\overline{A} \\cup B} = A \\cap \\overline{B}\\) by De Morgan. So the expression becomes \\((A \\cap \\overline{B}) \\cup (A \\cap B) = A \\cap (\\overline{B} \\cup B) = A \\cap U = A\\). The answer is \\(A\\).'
                },
            ]
        },

        // ================================================================
        // SECTION 6: Cardinality
        // ================================================================
        {
            id: 'sec-cardinality',
            title: 'Cardinality',
            content: `
<h2>Cardinality: Measuring the Size of Sets</h2>

<div class="env-block intuition">
    <div class="env-title">When Counting Goes to Infinity</div>
    <div class="env-body">
        <p>For finite sets, cardinality is straightforward: \\(|\\{a,b,c\\}| = 3\\). But what about infinite sets? Is \\(\\mathbb{N}\\) (natural numbers) "the same size" as \\(\\mathbb{Z}\\) (integers)? As \\(\\mathbb{Q}\\) (rationals)? As \\(\\mathbb{R}\\) (reals)? The answers are yes, yes, and no. Understanding why requires Cantor's brilliant idea of comparing infinite sets via bijections.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Cardinality)</div>
    <div class="env-body">
        <p>Two sets \\(A\\) and \\(B\\) have the <strong>same cardinality</strong>, written \\(|A| = |B|\\), if there exists a bijection (one-to-one correspondence) \\(f: A \\to B\\).</p>
    </div>
</div>

<h3>Countably Infinite Sets</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Countable)</div>
    <div class="env-body">
        <p>A set is <strong>countably infinite</strong> if it has the same cardinality as \\(\\mathbb{N}\\). A set is <strong>countable</strong> if it is finite or countably infinite. A set that is not countable is <strong>uncountable</strong>.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.6</div>
    <div class="env-body">
        <p>\\(\\mathbb{Z}\\) is countably infinite.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Define \\(f: \\mathbb{N} \\to \\mathbb{Z}\\) by:</p>
        \\[f(n) = \\begin{cases} n/2 & \\text{if } n \\text{ is even,} \\\\ -(n+1)/2 & \\text{if } n \\text{ is odd.} \\end{cases}\\]
        <p>This gives the enumeration \\(0, -1, 1, -2, 2, -3, 3, \\ldots\\), which is a bijection. So \\(|\\mathbb{Z}| = |\\mathbb{N}|\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.7</div>
    <div class="env-body">
        <p>\\(\\mathbb{Q}\\) (the rationals) is countably infinite.</p>
    </div>
</div>

<p>The proof uses a diagonal enumeration of the grid of fractions \\(p/q\\), skipping duplicates. The key idea is that the Cartesian product \\(\\mathbb{Z} \\times \\mathbb{Z}\\) is countable, and \\(\\mathbb{Q}\\) is a subset of it (with an equivalence relation).</p>

<h3>Uncountable Sets: Cantor's Diagonal Argument</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.8 (Cantor, 1891)</div>
    <div class="env-body">
        <p>The set of real numbers \\(\\mathbb{R}\\) is uncountable. In fact, even the interval \\((0,1)\\) is uncountable.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Diagonal Argument)</div>
    <div class="env-body">
        <p>Suppose for contradiction that the reals in \\((0,1)\\) can be listed as \\(r_1, r_2, r_3, \\ldots\\). Write each in decimal:</p>
        \\[r_1 = 0.d_{11}d_{12}d_{13}\\ldots\\]
        \\[r_2 = 0.d_{21}d_{22}d_{23}\\ldots\\]
        \\[r_3 = 0.d_{31}d_{32}d_{33}\\ldots\\]
        \\[\\vdots\\]
        <p>Construct a new number \\(r^* = 0.d_1^* d_2^* d_3^* \\ldots\\) where \\(d_n^* \\neq d_{nn}\\) (e.g., if \\(d_{nn} = 5\\), set \\(d_n^* = 6\\); otherwise set \\(d_n^* = 5\\)). Then \\(r^*\\) differs from \\(r_n\\) in the \\(n\\)-th decimal place, so \\(r^* \\neq r_n\\) for all \\(n\\). This contradicts the assumption that our list was exhaustive.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.9 (Cantor's Theorem)</div>
    <div class="env-body">
        <p>For any set \\(A\\), \\(|A| < |\\mathcal{P}(A)|\\). That is, no set can be put in bijection with its power set. There is no largest infinity.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-cantor-diagonal"></div>
<div class="viz-placeholder" data-viz="viz-cardinality-comparison"></div>
`,
            visualizations: [
                {
                    id: 'viz-cantor-diagonal',
                    title: "Cantor's Diagonal Argument",
                    description: "Watch the diagonal argument in action. We attempt to list all reals in (0,1), then construct a number that cannot be on the list. Click 'Next Step' to advance the construction.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var numRows = 8;
                        var step = 0;

                        // Generate random decimal digits for each "listed" real
                        var digits = [];
                        function regenerate() {
                            digits = [];
                            for (var i = 0; i < numRows; i++) {
                                var row = [];
                                for (var j = 0; j < numRows; j++) {
                                    row.push(Math.floor(Math.random() * 10));
                                }
                                digits.push(row);
                            }
                        }
                        regenerate();

                        VizEngine.createButton(controls, 'Next Step \u2192', function() {
                            if (step <= numRows) step++;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0; regenerate(); draw();
                        });

                        function antiDigit(d) {
                            return d === 5 ? 6 : 5;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText("Cantor's Diagonal Argument", viz.width / 2, 20, viz.colors.white, 15);
                            viz.screenText('Suppose we could list all reals in (0,1)...', viz.width / 2, 42, viz.colors.muted, 11);

                            var startX = 70, startY = 70;
                            var cellW = 38, cellH = 32;
                            var labelW = 50;

                            // Column headers
                            for (var j = 0; j < numRows; j++) {
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                ctx.fillStyle = viz.colors.muted;
                                ctx.fillText('d' + (j + 1), startX + labelW + j * cellW + cellW / 2, startY - 4);
                            }

                            for (var i = 0; i < numRows; i++) {
                                var rowY = startY + i * cellH;

                                // Row label
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('r' + (i + 1) + ' = 0.', startX + labelW - 4, rowY + cellH / 2);

                                for (var j = 0; j < numRows; j++) {
                                    var cx = startX + labelW + j * cellW;
                                    var isDiag = (i === j);

                                    // Highlight diagonal
                                    if (isDiag && step > i) {
                                        ctx.fillStyle = viz.colors.red + '33';
                                        ctx.fillRect(cx, rowY, cellW, cellH);
                                    }

                                    // Digit
                                    ctx.font = (isDiag && step > i) ? 'bold 14px -apple-system,sans-serif' : '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillStyle = (isDiag && step > i) ? viz.colors.red : viz.colors.white;
                                    ctx.fillText(digits[i][j].toString(), cx + cellW / 2, rowY + cellH / 2);

                                    // Grid line
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.strokeRect(cx, rowY, cellW, cellH);
                                }

                                // Strike through if step > numRows
                                if (step > numRows && step > i) {
                                    ctx.strokeStyle = viz.colors.red + '66';
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.moveTo(startX + labelW, rowY + cellH / 2);
                                    ctx.lineTo(startX + labelW + numRows * cellW, rowY + cellH / 2);
                                    ctx.stroke();
                                }
                            }

                            // Constructed number r*
                            var rstarY = startY + numRows * cellH + 30;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('r* = 0.', startX + labelW - 4, rstarY);

                            for (var j = 0; j < numRows; j++) {
                                var cx = startX + labelW + j * cellW;
                                if (step > j) {
                                    var ad = antiDigit(digits[j][j]);
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.fillText(ad.toString(), cx + cellW / 2, rstarY);

                                    // Show the flip
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.fillStyle = viz.colors.muted;
                                    ctx.fillText(digits[j][j] + '\u2192' + ad, cx + cellW / 2, rstarY + 16);
                                } else {
                                    ctx.font = '14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillStyle = viz.colors.muted;
                                    ctx.fillText('?', cx + cellW / 2, rstarY);
                                }
                            }

                            // Explanation
                            var msgY = rstarY + 45;
                            if (step === 0) {
                                viz.screenText('Click "Next Step" to start building r* from the diagonal.', viz.width / 2, msgY, viz.colors.muted, 11);
                            } else if (step <= numRows) {
                                viz.screenText('r* differs from r' + step + ' in position ' + step + ' (diagonal digit ' + digits[step - 1][step - 1] + ' \u2192 ' + antiDigit(digits[step - 1][step - 1]) + ')', viz.width / 2, msgY, viz.colors.green, 11);
                            } else {
                                viz.screenText('r* differs from every r_n on the list. The list was not exhaustive!', viz.width / 2, msgY, viz.colors.red, 12);
                                viz.screenText('Therefore (0,1) is uncountable. \u220E', viz.width / 2, msgY + 20, viz.colors.white, 12);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-cardinality-comparison',
                    title: 'Cardinality Comparison: Countable vs. Uncountable',
                    description: 'See how N, Z, and Q are all countable (same cardinality, \u2135\u2080), while R is uncountable (cardinality of the continuum, c). The visualization shows the bijections and the diagonal argument.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var mode = 0; // 0=N-Z, 1=N-Q, 2=R uncountable

                        VizEngine.createButton(controls, '\u2124 is countable', function() { mode = 0; draw(); });
                        VizEngine.createButton(controls, '\u211A is countable', function() { mode = 1; draw(); });
                        VizEngine.createButton(controls, '\u211D is uncountable', function() { mode = 2; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            if (mode === 0) {
                                // N -> Z bijection
                                viz.screenText('\u2124 is countable: a bijection from \u2115 to \u2124', viz.width / 2, 24, viz.colors.white, 14);

                                var pairs = [
                                    [0, 0], [1, -1], [2, 1], [3, -2], [4, 2], [5, -3], [6, 3], [7, -4], [8, 4], [9, -5], [10, 5]
                                ];

                                var topY = 80, botY = 200;
                                var startX = 50, gap = (viz.width - 100) / (pairs.length - 1);

                                // N row
                                viz.screenText('\u2115:', 25, topY, viz.colors.blue, 13);
                                for (var i = 0; i < pairs.length; i++) {
                                    var px = startX + i * gap;
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.beginPath(); ctx.arc(px, topY, 14, 0, Math.PI * 2); ctx.fill();
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.fillText(pairs[i][0].toString(), px, topY);
                                }

                                // Z row
                                viz.screenText('\u2124:', 25, botY, viz.colors.teal, 13);
                                for (var i = 0; i < pairs.length; i++) {
                                    var px = startX + i * gap;
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.beginPath(); ctx.arc(px, botY, 14, 0, Math.PI * 2); ctx.fill();
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.fillText(pairs[i][1].toString(), px, botY);
                                }

                                // Arrows
                                for (var i = 0; i < pairs.length; i++) {
                                    var px = startX + i * gap;
                                    ctx.strokeStyle = viz.colors.green + '88';
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath(); ctx.moveTo(px, topY + 16); ctx.lineTo(px, botY - 16); ctx.stroke();
                                    // arrowhead
                                    ctx.fillStyle = viz.colors.green + '88';
                                    ctx.beginPath();
                                    ctx.moveTo(px, botY - 16);
                                    ctx.lineTo(px - 4, botY - 22);
                                    ctx.lineTo(px + 4, botY - 22);
                                    ctx.closePath(); ctx.fill();
                                }

                                viz.screenText('f(n) = n/2 if even; -(n+1)/2 if odd', viz.width / 2, 260, viz.colors.muted, 12);
                                viz.screenText('0 \u2194 0,  1 \u2194 -1,  2 \u2194 1,  3 \u2194 -2,  4 \u2194 2, ...', viz.width / 2, 285, viz.colors.white, 12);
                                viz.screenText('|\u2124| = |\u2115| = \u2135\u2080', viz.width / 2, 320, viz.colors.green, 16);

                            } else if (mode === 1) {
                                // Q is countable - diagonal enumeration
                                viz.screenText('\u211A is countable: diagonal enumeration of p/q', viz.width / 2, 24, viz.colors.white, 14);

                                var gridSize = 6;
                                var cellS = 42;
                                var gx0 = (viz.width - gridSize * cellS) / 2;
                                var gy0 = 60;

                                // Draw grid
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.muted;
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

                                // Column headers (numerator)
                                for (var p = 1; p <= gridSize; p++) {
                                    ctx.fillText('p=' + p, gx0 + (p - 0.5) * cellS, gy0 - 10);
                                }
                                // Row headers (denominator)
                                for (var q = 1; q <= gridSize; q++) {
                                    ctx.textAlign = 'right';
                                    ctx.fillText('q=' + q, gx0 - 8, gy0 + (q - 0.5) * cellS);
                                }

                                // Diagonal path
                                var order = [];
                                for (var s = 2; s <= gridSize * 2; s++) {
                                    for (var p = 1; p < s; p++) {
                                        var q = s - p;
                                        if (q >= 1 && q <= gridSize && p <= gridSize) {
                                            order.push([p, q]);
                                        }
                                    }
                                }

                                // Draw connecting line
                                ctx.strokeStyle = viz.colors.green + '44';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var i = 0; i < Math.min(order.length, 20); i++) {
                                    var px = gx0 + (order[i][0] - 0.5) * cellS;
                                    var py = gy0 + (order[i][1] - 0.5) * cellS;
                                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // Draw grid cells
                                for (var p = 1; p <= gridSize; p++) {
                                    for (var q = 1; q <= gridSize; q++) {
                                        var px = gx0 + (p - 0.5) * cellS;
                                        var py = gy0 + (q - 0.5) * cellS;

                                        var orderIdx = -1;
                                        for (var i = 0; i < order.length; i++) {
                                            if (order[i][0] === p && order[i][1] === q) { orderIdx = i; break; }
                                        }

                                        var r = (orderIdx >= 0 && orderIdx < 20) ? 10 : 6;
                                        ctx.fillStyle = (orderIdx >= 0 && orderIdx < 20) ? viz.colors.teal : viz.colors.axis;
                                        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();

                                        if (orderIdx >= 0 && orderIdx < 20) {
                                            ctx.font = '9px -apple-system,sans-serif';
                                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                            ctx.fillStyle = viz.colors.white;
                                            ctx.fillText(p + '/' + q, px, py);
                                        }
                                    }
                                }

                                viz.screenText('Follow diagonals: 1/1, 1/2, 2/1, 1/3, 2/2, 3/1, ...', viz.width / 2, gy0 + gridSize * cellS + 20, viz.colors.white, 12);
                                viz.screenText('(Skip duplicates like 2/2 = 1/1). Every rational appears!', viz.width / 2, gy0 + gridSize * cellS + 40, viz.colors.muted, 11);
                                viz.screenText('|\u211A| = |\u2115| = \u2135\u2080', viz.width / 2, viz.height - 20, viz.colors.green, 16);

                            } else {
                                // R is uncountable
                                viz.screenText('\u211D is uncountable: |N| < |\u211D|', viz.width / 2, 24, viz.colors.white, 14);

                                // Draw a number line
                                var lineY = 100;
                                ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(40, lineY); ctx.lineTo(viz.width - 40, lineY); ctx.stroke();

                                // Mark some naturals
                                for (var i = 0; i <= 8; i++) {
                                    var px = 80 + i * 55;
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.beginPath(); ctx.arc(px, lineY, 4, 0, Math.PI * 2); ctx.fill();
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText(i.toString(), px, lineY + 8);
                                }
                                viz.screenText('\u2115: discrete dots on the line', viz.width / 2, lineY + 30, viz.colors.blue, 11);

                                // Continuum
                                var contY = 200;
                                var grad = ctx.createLinearGradient(40, contY, viz.width - 40, contY);
                                grad.addColorStop(0, viz.colors.red + '00');
                                grad.addColorStop(0.1, viz.colors.red);
                                grad.addColorStop(0.9, viz.colors.red);
                                grad.addColorStop(1, viz.colors.red + '00');
                                ctx.strokeStyle = grad; ctx.lineWidth = 6;
                                ctx.beginPath(); ctx.moveTo(40, contY); ctx.lineTo(viz.width - 40, contY); ctx.stroke();
                                viz.screenText('\u211D: a continuous line, no gaps', viz.width / 2, contY + 20, viz.colors.red, 11);

                                // Cardinalities
                                var boxY = 270;
                                var cards = [
                                    { name: '\u2115', card: '\u2135\u2080', color: viz.colors.blue },
                                    { name: '\u2124', card: '\u2135\u2080', color: viz.colors.teal },
                                    { name: '\u211A', card: '\u2135\u2080', color: viz.colors.green },
                                    { name: '\u211D', card: '\uD835\uDC50', color: viz.colors.red },
                                    { name: '\uD835\uDCAB(\u2115)', card: '\uD835\uDC50', color: viz.colors.purple }
                                ];
                                var bw = 90, totalW = cards.length * bw + (cards.length - 1) * 10;
                                var bx0 = (viz.width - totalW) / 2;
                                for (var i = 0; i < cards.length; i++) {
                                    var bx = bx0 + i * (bw + 10);
                                    ctx.fillStyle = cards[i].color + '22';
                                    ctx.strokeStyle = cards[i].color + '66';
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath(); ctx.roundRect(bx, boxY, bw, 60, 6);
                                    ctx.fill(); ctx.stroke();

                                    ctx.font = 'bold 16px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillStyle = cards[i].color;
                                    ctx.fillText(cards[i].name, bx + bw / 2, boxY + 20);
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.fillText(cards[i].card, bx + bw / 2, boxY + 44);
                                }

                                viz.screenText('\u2135\u2080 < \uD835\uDC50  (Cantor, 1891)', viz.width / 2, viz.height - 20, viz.colors.white, 14);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the set of even natural numbers \\(E = \\{0, 2, 4, 6, \\ldots\\}\\) has the same cardinality as \\(\\mathbb{N}\\).',
                    hint: 'Find an explicit bijection \\(f: \\mathbb{N} \\to E\\).',
                    solution: 'Define \\(f: \\mathbb{N} \\to E\\) by \\(f(n) = 2n\\). This is clearly one-to-one (\\(2n = 2m \\implies n = m\\)) and onto (every even number \\(2k\\) is \\(f(k)\\)). So \\(f\\) is a bijection and \\(|E| = |\\mathbb{N}|\\). A proper subset of an infinite set can have the same cardinality as the whole set!'
                },
                {
                    question: 'Explain in your own words why Cantor\'s diagonal argument fails for \\(\\mathbb{Q}\\) (i.e., why can\'t we use it to "prove" \\(\\mathbb{Q}\\) is uncountable?).',
                    hint: 'The key is that the constructed number \\(r^*\\) might not be rational.',
                    solution: 'The diagonal argument constructs a real number \\(r^*\\) that differs from every listed number in at least one decimal place. But there is no guarantee that \\(r^*\\) is rational (it almost certainly is not). So if we tried to apply the argument to a listing of \\(\\mathbb{Q}\\), the constructed \\(r^*\\) would be irrational, and its absence from the list does not contradict the claim that all rationals were listed.'
                },
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to Relations
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead: From Sets to Relations and Functions</h2>

<p>We now have a complete toolkit for working with sets: membership, subsets, power sets, union, intersection, complement, difference, and symmetric difference. We can reason about both finite and infinite sets, and we know that different infinities exist.</p>

<h3>Cartesian Products</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Cartesian Product)</div>
    <div class="env-body">
        <p>The <strong>Cartesian product</strong> of sets \\(A\\) and \\(B\\) is</p>
        \\[A \\times B = \\{(a, b) \\mid a \\in A, b \\in B\\}.\\]
        <p>If \\(|A| = m\\) and \\(|B| = n\\), then \\(|A \\times B| = mn\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>If \\(A = \\{1, 2\\}\\) and \\(B = \\{x, y, z\\}\\), then</p>
        \\[A \\times B = \\{(1,x), (1,y), (1,z), (2,x), (2,y), (2,z)\\}.\\]
        <p>Note \\(A \\times B \\neq B \\times A\\) in general (the pairs are ordered).</p>
    </div>
</div>

<h3>The Road Ahead</h3>

<p>With sets and Cartesian products in hand, we are ready to define:</p>
<ul>
    <li><strong>Relations</strong> (Chapter 4): A relation from \\(A\\) to \\(B\\) is a subset of \\(A \\times B\\). Equivalence relations partition sets into classes; partial orders let us compare elements.</li>
    <li><strong>Functions</strong> (Chapter 5): A function \\(f: A \\to B\\) is a special relation where each element of \\(A\\) is paired with exactly one element of \\(B\\). Injections, surjections, and bijections are the key vocabulary for counting and cardinality arguments.</li>
</ul>

<p>The set-theoretic perspective unifies these concepts: a function is a set of pairs, a graph is a set of vertices and edges, a probability space is a set of outcomes. The language of sets is the connective tissue of all mathematics that follows.</p>

<div class="env-block remark">
    <div class="env-title">Russell's Paradox</div>
    <div class="env-body">
        <p>Naive set theory allows "the set of all sets that do not contain themselves." Does this set contain itself? If yes, then by definition it should not. If no, then by definition it should. This paradox, discovered by Bertrand Russell in 1901, showed that unrestricted set formation leads to contradictions. Modern set theory (ZFC axioms) resolves this by carefully restricting which collections count as sets.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Let \\(A = \\{1, 2, 3\\}\\) and \\(B = \\{a, b\\}\\). List all elements of \\(A \\times B\\). Is \\(A \\times B = B \\times A\\)?',
                    hint: 'The Cartesian product \\(A \\times B\\) consists of all ordered pairs \\((a,b)\\) with \\(a \\in A\\) and \\(b \\in B\\).',
                    solution: '\\(A \\times B = \\{(1,a),(1,b),(2,a),(2,b),(3,a),(3,b)\\}\\). \\(B \\times A = \\{(a,1),(a,2),(a,3),(b,1),(b,2),(b,3)\\}\\). They are not equal: \\((1,a) \\neq (a,1)\\) since ordered pairs respect order. In general \\(A \\times B \\neq B \\times A\\) unless \\(A = B\\) or one is empty.'
                },
            ]
        }
    ]
});
