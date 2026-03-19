window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch05',
    number: 5,
    title: 'Functions',
    subtitle: 'Mappings between sets',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Functions?',
            content: `
<h2>Why Functions?</h2>

<div class="env-block intuition">
    <div class="env-title">From Relations to Rules</div>
    <div class="env-body">
        <p>In the previous chapter, we studied relations: arbitrary connections between elements of sets. But many real-world associations are more disciplined than that. A student ID maps each student to exactly one number. A compiler maps each source file to exactly one executable. A hash function maps each input to exactly one digest. The common thread: <strong>each input produces exactly one output</strong>. This is the defining property of a function.</p>
    </div>
</div>

<p>Functions are the single most important concept in all of mathematics. They appear everywhere: as algorithms in computer science, as signals in engineering, as observables in physics, as utility mappings in economics. In discrete mathematics, functions connect the theory of sets and relations to the counting techniques we will develop in upcoming chapters.</p>

<h3>What Makes a Function Special?</h3>

<p>A relation \\(R \\subseteq A \\times B\\) can be completely anarchic: an element of \\(A\\) may be related to zero, one, or many elements of \\(B\\). A function imposes two constraints:</p>

<ol>
    <li><strong>Totality:</strong> Every element of \\(A\\) is related to <em>something</em> in \\(B\\).</li>
    <li><strong>Determinism:</strong> Each element of \\(A\\) is related to <em>at most one</em> element of \\(B\\).</li>
</ol>

<p>Together, these mean: each input has <em>exactly one</em> output. This is the vertical line test you may recall from calculus, but here we work with arbitrary sets, not just real numbers.</p>

<h3>Chapter Overview</h3>

<p>We will define functions precisely, classify them (injective, surjective, bijective), learn to compose and invert them, examine important special functions (floor, ceiling, modular arithmetic), and see how the pigeonhole principle emerges naturally from the theory of injections.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The modern concept of a function evolved over centuries. Leibniz (1694) coined the term "functio." Euler (1748) popularized the \\(f(x)\\) notation. Dirichlet (1837) gave the first rigorous definition as a rule that assigns to each element of one set a unique element of another. The set-theoretic formalization we use today, as a set of ordered pairs, was established by Hausdorff and Bourbaki in the early 20th century.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Definition of Functions
        // ================================================================
        {
            id: 'sec-definition',
            title: 'Functions',
            content: `
<h2>Functions</h2>

<div class="env-block definition">
    <div class="env-title">Definition 5.1 (Function)</div>
    <div class="env-body">
        <p>Let \\(A\\) and \\(B\\) be nonempty sets. A <strong>function</strong> from \\(A\\) to \\(B\\), written \\(f: A \\to B\\), is a relation from \\(A\\) to \\(B\\) such that for every \\(a \\in A\\), there exists a unique \\(b \\in B\\) with \\((a, b) \\in f\\). We write \\(f(a) = b\\) and say "\\(f\\) maps \\(a\\) to \\(b\\)."</p>
    </div>
</div>

<p>Equivalently, \\(f: A \\to B\\) is a function if and only if:</p>
<ol>
    <li>For every \\(a \\in A\\), there exists some \\(b \\in B\\) such that \\(f(a) = b\\). (\\(f\\) is <strong>total</strong>, or "defined everywhere on \\(A\\).")</li>
    <li>If \\(f(a) = b_1\\) and \\(f(a) = b_2\\), then \\(b_1 = b_2\\). (\\(f\\) is <strong>well-defined</strong>, or "single-valued.")</li>
</ol>

<div class="env-block definition">
    <div class="env-title">Definition 5.2 (Domain, Codomain, Range)</div>
    <div class="env-body">
        <p>Given \\(f: A \\to B\\):</p>
        <ul>
            <li>The <strong>domain</strong> of \\(f\\) is \\(A\\): the set of all inputs.</li>
            <li>The <strong>codomain</strong> of \\(f\\) is \\(B\\): the set of all <em>potential</em> outputs.</li>
            <li>The <strong>range</strong> (or <strong>image</strong>) of \\(f\\) is \\(f(A) = \\{f(a) : a \\in A\\} \\subseteq B\\): the set of <em>actual</em> outputs.</li>
        </ul>
    </div>
</div>

<p>The distinction between codomain and range is crucial: the codomain is declared as part of the function's specification, while the range is determined by the function's behavior. For example, \\(f: \\mathbb{Z} \\to \\mathbb{Z}\\) defined by \\(f(n) = n^2\\) has codomain \\(\\mathbb{Z}\\) but range \\(\\{0, 1, 4, 9, 16, \\ldots\\}\\), which is a proper subset.</p>

<div class="env-block definition">
    <div class="env-title">Definition 5.3 (Image and Preimage)</div>
    <div class="env-body">
        <p>Let \\(f: A \\to B\\). For a subset \\(S \\subseteq A\\), the <strong>image of \\(S\\) under \\(f\\)</strong> is</p>
        \\[f(S) = \\{f(a) : a \\in S\\}.\\]
        <p>For a subset \\(T \\subseteq B\\), the <strong>preimage of \\(T\\) under \\(f\\)</strong> is</p>
        \\[f^{-1}(T) = \\{a \\in A : f(a) \\in T\\}.\\]
        <p>Note: \\(f^{-1}(T)\\) is defined even when \\(f\\) has no inverse function.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Arrow Diagram</div>
    <div class="env-body">
        <p>Let \\(A = \\{1, 2, 3\\}\\), \\(B = \\{a, b, c, d\\}\\), and define \\(f(1) = b,\\; f(2) = d,\\; f(3) = b\\).</p>
        <ul>
            <li>Domain: \\(\\{1, 2, 3\\}\\). Codomain: \\(\\{a, b, c, d\\}\\). Range: \\(\\{b, d\\}\\).</li>
            <li>Image of \\(\\{1, 3\\}\\): \\(f(\\{1,3\\}) = \\{b\\}\\).</li>
            <li>Preimage of \\(\\{b\\}\\): \\(f^{-1}(\\{b\\}) = \\{1, 3\\}\\).</li>
            <li>Preimage of \\(\\{a\\}\\): \\(f^{-1}(\\{a\\}) = \\emptyset\\).</li>
        </ul>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Notation</div>
    <div class="env-body">
        <p>The notation \\(B^A\\) denotes the set of all functions from \\(A\\) to \\(B\\). If \\(|A| = m\\) and \\(|B| = n\\), then \\(|B^A| = n^m\\). Why? For each of the \\(m\\) elements of \\(A\\), there are \\(n\\) independent choices for the output in \\(B\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-function-arrows"></div>
`,
            visualizations: [
                {
                    id: 'viz-function-arrows',
                    title: 'Function Builder: Arrow Diagrams',
                    description: 'Drag arrows from elements of A (left) to elements of B (right) to create a mapping. The system auto-classifies your mapping as injective, surjective, bijective, or not a function.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var sizeA = 3, sizeB = 4;
                        // mapping[i] = index in B, or -1 if unassigned
                        var mapping = [];
                        var dragging = -1;
                        var dragEndX = 0, dragEndY = 0;

                        function resetMapping() {
                            mapping = [];
                            for (var i = 0; i < sizeA; i++) mapping.push(-1);
                        }
                        resetMapping();

                        VizEngine.createSlider(controls, '|A|', 1, 6, sizeA, 1, function(v) {
                            sizeA = Math.round(v);
                            resetMapping();
                            draw();
                        });
                        VizEngine.createSlider(controls, '|B|', 1, 6, sizeB, 1, function(v) {
                            sizeB = Math.round(v);
                            resetMapping();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Clear', function() {
                            resetMapping();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Random Function', function() {
                            for (var i = 0; i < sizeA; i++) {
                                mapping[i] = Math.floor(Math.random() * sizeB);
                            }
                            draw();
                        });

                        var leftX = 120, rightX = 440;
                        var nodeR = 18;

                        function getAy(i) { return 60 + i * (280 / Math.max(sizeA - 1, 1)); }
                        function getBy(j) { return 60 + j * (280 / Math.max(sizeB - 1, 1)); }

                        function classify() {
                            // Check totality
                            for (var i = 0; i < sizeA; i++) {
                                if (mapping[i] < 0) return 'Not a function (incomplete)';
                            }
                            // Check injective
                            var hitB = {};
                            var injective = true;
                            for (var i2 = 0; i2 < sizeA; i2++) {
                                var t = mapping[i2];
                                if (hitB[t]) { injective = false; }
                                hitB[t] = true;
                            }
                            // Check surjective
                            var surjective = true;
                            for (var j = 0; j < sizeB; j++) {
                                if (!hitB[j]) { surjective = false; break; }
                            }
                            if (injective && surjective) return 'Bijective (one-to-one & onto)';
                            if (injective) return 'Injective (one-to-one), not surjective';
                            if (surjective) return 'Surjective (onto), not injective';
                            return 'Neither injective nor surjective';
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw set ovals
                            ctx.strokeStyle = viz.colors.blue + '66';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.ellipse(leftX, 60 + 140, 50, Math.max(160, sizeA * 40), 0, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.strokeStyle = viz.colors.teal + '66';
                            ctx.beginPath();
                            ctx.ellipse(rightX, 60 + 140, 50, Math.max(160, sizeB * 40), 0, 0, Math.PI * 2);
                            ctx.stroke();

                            // Labels
                            viz.screenText('A', leftX, 25, viz.colors.blue, 16);
                            viz.screenText('B', rightX, 25, viz.colors.teal, 16);

                            // Draw arrows for current mapping
                            for (var i = 0; i < sizeA; i++) {
                                if (mapping[i] >= 0) {
                                    var ay = getAy(i);
                                    var by = getBy(mapping[i]);
                                    ctx.strokeStyle = viz.colors.orange + 'cc';
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(leftX + nodeR + 4, ay);
                                    ctx.lineTo(rightX - nodeR - 4, by);
                                    ctx.stroke();
                                    // arrowhead
                                    var dx = rightX - nodeR - 4 - (leftX + nodeR + 4);
                                    var dy = by - ay;
                                    var ang = Math.atan2(dy, dx);
                                    ctx.fillStyle = viz.colors.orange + 'cc';
                                    ctx.beginPath();
                                    ctx.moveTo(rightX - nodeR - 4, by);
                                    ctx.lineTo(rightX - nodeR - 4 - 10 * Math.cos(ang - 0.4), by - 10 * Math.sin(ang - 0.4));
                                    ctx.lineTo(rightX - nodeR - 4 - 10 * Math.cos(ang + 0.4), by - 10 * Math.sin(ang + 0.4));
                                    ctx.closePath();
                                    ctx.fill();
                                }
                            }

                            // Draw dragging arrow
                            if (dragging >= 0) {
                                var say = getAy(dragging);
                                ctx.strokeStyle = viz.colors.yellow + 'aa';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([6, 4]);
                                ctx.beginPath();
                                ctx.moveTo(leftX + nodeR + 4, say);
                                ctx.lineTo(dragEndX, dragEndY);
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Draw A nodes
                            for (var ia = 0; ia < sizeA; ia++) {
                                var yy = getAy(ia);
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(leftX, yy, nodeR, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(String(ia + 1), leftX, yy);
                            }

                            // Draw B nodes
                            var bLabels = ['a', 'b', 'c', 'd', 'e', 'f'];
                            for (var ib = 0; ib < sizeB; ib++) {
                                var yb = getBy(ib);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.arc(rightX, yb, nodeR, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(bLabels[ib] || String(ib), rightX, yb);
                            }

                            // Classification
                            var label = classify();
                            var col = label.startsWith('Bijective') ? viz.colors.green :
                                      label.startsWith('Injective') ? viz.colors.blue :
                                      label.startsWith('Surjective') ? viz.colors.teal :
                                      label.startsWith('Not') ? viz.colors.red : viz.colors.orange;
                            viz.screenText(label, viz.width / 2, viz.height - 20, col, 13);
                        }

                        // Drag interaction
                        viz.canvas.addEventListener('mousedown', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            for (var i = 0; i < sizeA; i++) {
                                var yy = getAy(i);
                                if (Math.sqrt((mx - leftX) * (mx - leftX) + (my - yy) * (my - yy)) < nodeR + 6) {
                                    dragging = i;
                                    dragEndX = mx;
                                    dragEndY = my;
                                    e.preventDefault();
                                    break;
                                }
                            }
                        });
                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (dragging < 0) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            dragEndX = e.clientX - rect.left;
                            dragEndY = e.clientY - rect.top;
                            draw();
                        });
                        viz.canvas.addEventListener('mouseup', function(e) {
                            if (dragging < 0) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var snapped = -1;
                            for (var j = 0; j < sizeB; j++) {
                                var yb = getBy(j);
                                if (Math.sqrt((mx - rightX) * (mx - rightX) + (my - yb) * (my - yb)) < nodeR + 10) {
                                    snapped = j;
                                    break;
                                }
                            }
                            if (snapped >= 0) {
                                mapping[dragging] = snapped;
                            }
                            dragging = -1;
                            draw();
                        });
                        viz.canvas.addEventListener('mouseleave', function() {
                            dragging = -1;
                            draw();
                        });

                        // Touch support
                        viz.canvas.addEventListener('touchstart', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.touches[0].clientX - rect.left;
                            var my = e.touches[0].clientY - rect.top;
                            for (var i = 0; i < sizeA; i++) {
                                var yy = getAy(i);
                                if (Math.sqrt((mx - leftX) * (mx - leftX) + (my - yy) * (my - yy)) < nodeR + 10) {
                                    dragging = i;
                                    dragEndX = mx;
                                    dragEndY = my;
                                    e.preventDefault();
                                    break;
                                }
                            }
                        }, { passive: false });
                        viz.canvas.addEventListener('touchmove', function(e) {
                            if (dragging < 0) return;
                            e.preventDefault();
                            var rect = viz.canvas.getBoundingClientRect();
                            dragEndX = e.touches[0].clientX - rect.left;
                            dragEndY = e.touches[0].clientY - rect.top;
                            draw();
                        }, { passive: false });
                        viz.canvas.addEventListener('touchend', function(e) {
                            if (dragging < 0) return;
                            var snapped = -1;
                            for (var j = 0; j < sizeB; j++) {
                                var yb = getBy(j);
                                if (Math.sqrt((dragEndX - rightX) * (dragEndX - rightX) + (dragEndY - yb) * (dragEndY - yb)) < nodeR + 15) {
                                    snapped = j;
                                    break;
                                }
                            }
                            if (snapped >= 0) mapping[dragging] = snapped;
                            dragging = -1;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(A = \\{1, 2, 3, 4\\}\\) and \\(B = \\{a, b, c\\}\\). How many functions \\(f: A \\to B\\) are there?',
                    hint: 'For each element of \\(A\\), you independently choose an output in \\(B\\).',
                    solution: 'Each of the 4 elements of \\(A\\) can be sent to any of the 3 elements of \\(B\\). By the multiplication rule, the total is \\(3^4 = 81\\).'
                },
                {
                    question: 'Let \\(f: \\mathbb{Z} \\to \\mathbb{Z}\\) with \\(f(n) = n^2 + 1\\). Find \\(f(\\{-2, -1, 0, 1, 2\\})\\) and \\(f^{-1}(\\{5\\})\\).',
                    hint: 'Compute \\(f\\) at each value for the image. For the preimage, solve \\(n^2 + 1 = 5\\) over the integers.',
                    solution: '\\(f(-2) = 5,\\; f(-1) = 2,\\; f(0) = 1,\\; f(1) = 2,\\; f(2) = 5\\). So \\(f(\\{-2,-1,0,1,2\\}) = \\{1, 2, 5\\}\\). For the preimage: \\(n^2 + 1 = 5 \\Rightarrow n^2 = 4 \\Rightarrow n = \\pm 2\\). So \\(f^{-1}(\\{5\\}) = \\{-2, 2\\}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Injective, Surjective, Bijective
        // ================================================================
        {
            id: 'sec-types',
            title: 'Injective, Surjective, Bijective',
            content: `
<h2>Injective, Surjective, Bijective</h2>

<div class="env-block intuition">
    <div class="env-title">Three Flavors of Functions</div>
    <div class="env-body">
        <p>Not all functions are created equal. Some never "collide" (two inputs never share an output). Some "hit everything" (every potential output is actually achieved). The best functions do both. These three properties, injective, surjective, and bijective, capture the most important structural distinctions among functions.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 5.4 (Injection / One-to-One)</div>
    <div class="env-body">
        <p>A function \\(f: A \\to B\\) is <strong>injective</strong> (or <strong>one-to-one</strong>) if distinct inputs always produce distinct outputs:</p>
        \\[\\forall a_1, a_2 \\in A,\\quad f(a_1) = f(a_2) \\Rightarrow a_1 = a_2.\\]
        <p>Equivalently: \\(a_1 \\neq a_2 \\Rightarrow f(a_1) \\neq f(a_2)\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 5.5 (Surjection / Onto)</div>
    <div class="env-body">
        <p>A function \\(f: A \\to B\\) is <strong>surjective</strong> (or <strong>onto</strong>) if every element of the codomain is hit:</p>
        \\[\\forall b \\in B,\\; \\exists a \\in A \\text{ such that } f(a) = b.\\]
        <p>Equivalently: \\(f(A) = B\\) (the range equals the codomain).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 5.6 (Bijection / One-to-One Correspondence)</div>
    <div class="env-body">
        <p>A function \\(f: A \\to B\\) is <strong>bijective</strong> if it is both injective and surjective. Bijections establish a <strong>perfect pairing</strong> between elements of \\(A\\) and \\(B\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.1 (Cardinality and Function Types)</div>
    <div class="env-body">
        <p>Let \\(f: A \\to B\\) with \\(|A| = m\\) and \\(|B| = n\\), both finite.</p>
        <ol>
            <li>If \\(f\\) is injective, then \\(m \\leq n\\).</li>
            <li>If \\(f\\) is surjective, then \\(m \\geq n\\).</li>
            <li>If \\(f\\) is bijective, then \\(m = n\\).</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>(1) If \\(f\\) is injective, the \\(m\\) elements of \\(A\\) map to \\(m\\) <em>distinct</em> elements of \\(B\\), so \\(B\\) must have at least \\(m\\) elements.</p>
        <p>(2) If \\(f\\) is surjective, every element of \\(B\\) has at least one preimage in \\(A\\), so \\(|A| \\geq |B|\\).</p>
        <p>(3) Bijective means both, so \\(m \\leq n\\) and \\(m \\geq n\\), hence \\(m = n\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.2 (Bijection for Equal Finite Sets)</div>
    <div class="env-body">
        <p>If \\(|A| = |B| = n\\) (both finite), then for \\(f: A \\to B\\):</p>
        \\[f \\text{ is injective} \\iff f \\text{ is surjective} \\iff f \\text{ is bijective}.\\]
    </div>
</div>

<p>This is a powerful shortcut: for functions between same-size finite sets, you only need to verify one of the three properties.</p>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Let \\(f: \\{1,2,3\\} \\to \\{a,b,c\\}\\) with \\(f(1)=c,\\; f(2)=a,\\; f(3)=b\\). Since \\(|A|=|B|=3\\) and the outputs \\(c, a, b\\) are all distinct, \\(f\\) is injective, hence also surjective and bijective.</p>
    </div>
</div>

<h3>Counting Injections and Bijections</h3>

<p>The number of injections from an \\(m\\)-element set to an \\(n\\)-element set (with \\(m \\leq n\\)) is the falling factorial:</p>
\\[n \\cdot (n-1) \\cdot (n-2) \\cdots (n - m + 1) = \\frac{n!}{(n-m)!} = P(n, m).\\]

<p>The number of bijections from an \\(n\\)-element set to an \\(n\\)-element set is \\(n!\\).</p>

<div class="viz-placeholder" data-viz="viz-injection-surjection"></div>
`,
            visualizations: [
                {
                    id: 'viz-injection-surjection',
                    title: 'Injection & Surjection Visual Tests',
                    description: 'Each row in B shows how many elements of A map to it. Injection means no row has more than 1 arrow; surjection means no row has 0 arrows. Adjust |A| and |B| and click "Random" to explore.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var sizeA = 4, sizeB = 4;
                        var mapping = [];

                        function randomMapping() {
                            mapping = [];
                            for (var i = 0; i < sizeA; i++) {
                                mapping.push(Math.floor(Math.random() * sizeB));
                            }
                        }
                        randomMapping();

                        VizEngine.createSlider(controls, '|A|', 2, 6, sizeA, 1, function(v) {
                            sizeA = Math.round(v);
                            randomMapping();
                            draw();
                        });
                        VizEngine.createSlider(controls, '|B|', 2, 6, sizeB, 1, function(v) {
                            sizeB = Math.round(v);
                            randomMapping();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Random', function() {
                            randomMapping();
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var leftX = 100, rightX = 300, barX = 420;
                            var topY = 50, spacing;

                            // Draw A nodes and arrows
                            spacing = Math.min(50, 280 / Math.max(sizeA, 1));
                            var bSpacing = Math.min(50, 280 / Math.max(sizeB, 1));

                            function ay(i) { return topY + i * spacing; }
                            function by(j) { return topY + j * bSpacing; }

                            // Count hits per B element
                            var hitCount = [];
                            for (var j = 0; j < sizeB; j++) hitCount.push(0);
                            for (var i = 0; i < sizeA; i++) {
                                if (mapping[i] >= 0 && mapping[i] < sizeB) hitCount[mapping[i]]++;
                            }

                            // Arrows
                            for (var i2 = 0; i2 < sizeA; i2++) {
                                var target = mapping[i2];
                                if (target < 0 || target >= sizeB) continue;
                                ctx.strokeStyle = viz.colors.orange + 'aa';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(leftX + 16, ay(i2));
                                ctx.lineTo(rightX - 16, by(target));
                                ctx.stroke();
                            }

                            // A nodes
                            for (var ia = 0; ia < sizeA; ia++) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(leftX, ay(ia), 14, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white; ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(String(ia + 1), leftX, ay(ia));
                            }

                            // B nodes
                            var bLabels = ['a','b','c','d','e','f'];
                            for (var ib = 0; ib < sizeB; ib++) {
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath(); ctx.arc(rightX, by(ib), 14, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white; ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(bLabels[ib], rightX, by(ib));
                            }

                            // Bar chart: hits per B element
                            viz.screenText('Arrows per target', barX + 40, 30, viz.colors.text, 11);
                            var maxBar = 80;
                            for (var jb = 0; jb < sizeB; jb++) {
                                var bw = (hitCount[jb] / Math.max(sizeA, 1)) * maxBar;
                                var barY = by(jb) - 8;
                                ctx.fillStyle = hitCount[jb] === 0 ? viz.colors.red + '66' :
                                               hitCount[jb] === 1 ? viz.colors.green + '88' :
                                               viz.colors.yellow + '88';
                                ctx.fillRect(barX, barY, bw + 2, 16);
                                ctx.fillStyle = viz.colors.white; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText(String(hitCount[jb]), barX + bw + 8, by(jb));
                            }

                            // Classification
                            var injective = true, surjective = true;
                            for (var k = 0; k < sizeB; k++) {
                                if (hitCount[k] > 1) injective = false;
                                if (hitCount[k] === 0) surjective = false;
                            }
                            var infoY = viz.height - 30;
                            var label, color;
                            if (injective && surjective) { label = 'Bijective'; color = viz.colors.green; }
                            else if (injective) { label = 'Injective only'; color = viz.colors.blue; }
                            else if (surjective) { label = 'Surjective only'; color = viz.colors.teal; }
                            else { label = 'Neither'; color = viz.colors.orange; }
                            viz.screenText(label, viz.width / 2, infoY, color, 14);

                            // Legend
                            ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.green; ctx.fillText('Green bar = exactly 1 (good for injection)', barX - 30, viz.height - 55);
                            ctx.fillStyle = viz.colors.red; ctx.fillText('Red bar = 0 hits (violates surjection)', barX - 30, viz.height - 42);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that \\(f: \\mathbb{Z} \\to \\mathbb{Z}\\) defined by \\(f(n) = 2n + 1\\) is injective but not surjective.',
                    hint: 'For injectivity, assume \\(f(a) = f(b)\\) and show \\(a = b\\). For surjectivity, find an element of \\(\\mathbb{Z}\\) not in the range.',
                    solution: '<strong>Injective:</strong> If \\(2a + 1 = 2b + 1\\), then \\(2a = 2b\\), so \\(a = b\\). <strong>Not surjective:</strong> There is no integer \\(n\\) with \\(2n + 1 = 4\\), because \\(n = 3/2 \\notin \\mathbb{Z}\\). More generally, no even integer is in the range.'
                },
                {
                    question: 'How many injections are there from a 3-element set to a 5-element set?',
                    hint: 'Use the falling factorial \\(P(n, m) = n!/(n-m)!\\).',
                    solution: '\\(P(5, 3) = 5 \\times 4 \\times 3 = 60\\). The first element has 5 choices, the second has 4 (to avoid collision), and the third has 3.'
                },
                {
                    question: 'Let \\(A = \\{1, 2, 3, 4, 5\\}\\) and \\(B = \\{a, b, c\\}\\). Can there exist an injective function \\(f: A \\to B\\)? Can there exist a surjective function?',
                    hint: 'Use Theorem 5.1 on cardinality constraints.',
                    solution: 'Injective requires \\(|A| \\leq |B|\\), but \\(5 > 3\\), so <strong>no injection exists</strong>. Surjective requires \\(|A| \\geq |B|\\), and \\(5 \\geq 3\\), so <strong>surjections do exist</strong>. For example: \\(f(1)=a, f(2)=b, f(3)=c, f(4)=a, f(5)=b\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Composition & Inverse
        // ================================================================
        {
            id: 'sec-composition',
            title: 'Composition & Inverse',
            content: `
<h2>Composition & Inverse</h2>

<div class="env-block intuition">
    <div class="env-title">Chaining Functions</div>
    <div class="env-body">
        <p>Functions can be chained: first apply \\(f\\), then apply \\(g\\) to the result. If \\(f\\) converts Celsius to Fahrenheit and \\(g\\) rounds to the nearest integer, then \\(g \\circ f\\) converts Celsius to the nearest whole Fahrenheit degree. This chaining is called <strong>composition</strong>.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 5.7 (Composition)</div>
    <div class="env-body">
        <p>Let \\(f: A \\to B\\) and \\(g: B \\to C\\). The <strong>composition</strong> \\(g \\circ f: A \\to C\\) is defined by</p>
        \\[(g \\circ f)(a) = g(f(a)) \\quad \\text{for all } a \\in A.\\]
        <p>Read "\\(g\\) composed with \\(f\\)" or "\\(g\\) after \\(f\\)." Note: \\(f\\) is applied <em>first</em>, despite being written on the right.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.3 (Composition Preserves Properties)</div>
    <div class="env-body">
        <p>Let \\(f: A \\to B\\) and \\(g: B \\to C\\).</p>
        <ol>
            <li>If \\(f\\) and \\(g\\) are both injective, then \\(g \\circ f\\) is injective.</li>
            <li>If \\(f\\) and \\(g\\) are both surjective, then \\(g \\circ f\\) is surjective.</li>
            <li>If \\(f\\) and \\(g\\) are both bijective, then \\(g \\circ f\\) is bijective.</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of (1)</div>
    <div class="env-body">
        <p>Suppose \\((g \\circ f)(a_1) = (g \\circ f)(a_2)\\), i.e., \\(g(f(a_1)) = g(f(a_2))\\). Since \\(g\\) is injective, \\(f(a_1) = f(a_2)\\). Since \\(f\\) is injective, \\(a_1 = a_2\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.4 (Associativity of Composition)</div>
    <div class="env-body">
        <p>If \\(f: A \\to B\\), \\(g: B \\to C\\), and \\(h: C \\to D\\), then</p>
        \\[h \\circ (g \\circ f) = (h \\circ g) \\circ f.\\]
    </div>
</div>

<h3>Inverse Functions</h3>

<div class="env-block definition">
    <div class="env-title">Definition 5.8 (Inverse Function)</div>
    <div class="env-body">
        <p>Let \\(f: A \\to B\\) be a bijection. The <strong>inverse</strong> of \\(f\\), written \\(f^{-1}: B \\to A\\), is the unique function satisfying</p>
        \\[f^{-1}(b) = a \\iff f(a) = b.\\]
        <p>Equivalently, \\(f^{-1} \\circ f = \\text{id}_A\\) and \\(f \\circ f^{-1} = \\text{id}_B\\), where \\(\\text{id}_X: X \\to X\\) is the identity function \\(\\text{id}_X(x) = x\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.5 (Invertibility \\(\\Leftrightarrow\\) Bijectivity)</div>
    <div class="env-body">
        <p>A function \\(f: A \\to B\\) has an inverse if and only if \\(f\\) is bijective.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof sketch</div>
    <div class="env-body">
        <p>(\\(\\Rightarrow\\)) If \\(f^{-1}\\) exists, then \\(f^{-1} \\circ f = \\text{id}_A\\) forces \\(f\\) to be injective (if \\(f(a_1) = f(a_2)\\), apply \\(f^{-1}\\) to get \\(a_1 = a_2\\)), and \\(f \\circ f^{-1} = \\text{id}_B\\) forces \\(f\\) to be surjective (for any \\(b\\), we have \\(f(f^{-1}(b)) = b\\)).</p>
        <p>(\\(\\Leftarrow\\)) If \\(f\\) is bijective, define \\(f^{-1}(b)\\) to be the unique \\(a\\) with \\(f(a) = b\\). Uniqueness is guaranteed by injectivity; existence by surjectivity.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Let \\(f: \\{1,2,3\\} \\to \\{a,b,c\\}\\) with \\(f(1)=b,\\; f(2)=c,\\; f(3)=a\\). This is a bijection, so \\(f^{-1}\\) exists: \\(f^{-1}(a) = 3,\\; f^{-1}(b) = 1,\\; f^{-1}(c) = 2\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-composition"></div>
<div class="viz-placeholder" data-viz="viz-inverse"></div>
`,
            visualizations: [
                {
                    id: 'viz-composition',
                    title: 'Function Composition: g \u2218 f',
                    description: 'Watch elements flow from set A through set B to set C. First f maps A to B, then g maps B to C. The composition g\u2218f goes directly from A to C. Click "Animate" to see the flow.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var sA = 3, sB = 4, sC = 3;
                        var fMap = [1, 0, 2]; // f: A -> B
                        var gMap = [2, 0, 1, 2]; // g: B -> C
                        var animPhase = 0; // 0=static, 1=f animating, 2=g animating, 3=done
                        var animT = 0;
                        var animId = null;

                        function randomize() {
                            fMap = [];
                            for (var i = 0; i < sA; i++) fMap.push(Math.floor(Math.random() * sB));
                            gMap = [];
                            for (var j = 0; j < sB; j++) gMap.push(Math.floor(Math.random() * sC));
                        }

                        VizEngine.createButton(controls, 'Randomize', function() {
                            randomize();
                            animPhase = 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animId) return;
                            animPhase = 1;
                            animT = 0;
                            function step() {
                                animT += 0.03;
                                if (animT >= 1) {
                                    animT = 0;
                                    animPhase++;
                                    if (animPhase > 3) {
                                        animPhase = 3;
                                        animT = 1;
                                        cancelAnimationFrame(animId);
                                        animId = null;
                                        draw();
                                        return;
                                    }
                                }
                                draw();
                                animId = requestAnimationFrame(step);
                            }
                            animId = requestAnimationFrame(step);
                        });

                        var colX = [80, 230, 380];
                        var nodeR = 14;
                        var labelsA = ['1','2','3','4','5','6'];
                        var labelsB = ['a','b','c','d','e','f'];
                        var labelsC = ['x','y','z','w','v','u'];

                        function getY(idx, total) { return 60 + idx * (240 / Math.max(total - 1, 1)); }

                        function drawArrow(x1, y1, x2, y2, col, progress) {
                            var ctx = viz.ctx;
                            var px = x1 + (x2 - x1) * progress;
                            var py = y1 + (y2 - y1) * progress;
                            ctx.strokeStyle = col;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(x1, y1);
                            ctx.lineTo(px, py);
                            ctx.stroke();
                            if (progress > 0.1) {
                                var ang = Math.atan2(y2 - y1, x2 - x1);
                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.moveTo(px, py);
                                ctx.lineTo(px - 8 * Math.cos(ang - 0.4), py - 8 * Math.sin(ang - 0.4));
                                ctx.lineTo(px - 8 * Math.cos(ang + 0.4), py - 8 * Math.sin(ang + 0.4));
                                ctx.closePath();
                                ctx.fill();
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Column labels
                            viz.screenText('A', colX[0], 25, viz.colors.blue, 15);
                            viz.screenText('B', colX[1], 25, viz.colors.teal, 15);
                            viz.screenText('C', colX[2], 25, viz.colors.purple, 15);
                            viz.screenText('f', (colX[0] + colX[1]) / 2, 25, viz.colors.orange, 12);
                            viz.screenText('g', (colX[1] + colX[2]) / 2, 25, viz.colors.green, 12);

                            // f arrows
                            var fProg = animPhase === 0 ? 1 : animPhase === 1 ? animT : 1;
                            for (var i = 0; i < sA; i++) {
                                drawArrow(colX[0] + nodeR + 2, getY(i, sA),
                                          colX[1] - nodeR - 2, getY(fMap[i], sB),
                                          viz.colors.orange + 'aa', fProg);
                            }

                            // g arrows
                            var gProg = animPhase < 2 ? 0 : animPhase === 2 ? animT : 1;
                            if (gProg > 0) {
                                for (var j = 0; j < sB; j++) {
                                    drawArrow(colX[1] + nodeR + 2, getY(j, sB),
                                              colX[2] - nodeR - 2, getY(gMap[j], sC),
                                              viz.colors.green + 'aa', gProg);
                                }
                            }

                            // g o f direct arrows (phase 3)
                            if (animPhase >= 3) {
                                for (var k = 0; k < sA; k++) {
                                    var target = gMap[fMap[k]];
                                    ctx.strokeStyle = viz.colors.yellow + '44';
                                    ctx.lineWidth = 3;
                                    ctx.setLineDash([4, 4]);
                                    ctx.beginPath();
                                    ctx.moveTo(colX[0] + nodeR + 2, getY(k, sA));
                                    ctx.bezierCurveTo(
                                        colX[0] + 60, getY(k, sA) + 30,
                                        colX[2] - 60, getY(target, sC) - 30,
                                        colX[2] - nodeR - 2, getY(target, sC)
                                    );
                                    ctx.stroke();
                                    ctx.setLineDash([]);
                                }
                            }

                            // Nodes
                            function drawNode(x, y, label, col) {
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(x, y, nodeR, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(label, x, y);
                            }
                            for (var ia = 0; ia < sA; ia++) drawNode(colX[0], getY(ia, sA), labelsA[ia], viz.colors.blue);
                            for (var ib = 0; ib < sB; ib++) drawNode(colX[1], getY(ib, sB), labelsB[ib], viz.colors.teal);
                            for (var ic = 0; ic < sC; ic++) drawNode(colX[2], getY(ic, sC), labelsC[ic], viz.colors.purple);

                            // Composition result
                            if (animPhase >= 3) {
                                var compStr = 'g\u2218f: ';
                                for (var m = 0; m < sA; m++) {
                                    compStr += labelsA[m] + '\u2192' + labelsC[gMap[fMap[m]]];
                                    if (m < sA - 1) compStr += ', ';
                                }
                                viz.screenText(compStr, viz.width / 2, viz.height - 20, viz.colors.yellow, 13);
                            }
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-inverse',
                    title: 'Bijection and Its Inverse',
                    description: 'A bijection pairs each element of A with a unique element of B. The inverse simply reverses every arrow. Click "Flip" to toggle between f and f\u207B\u00B9.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 4;
                        var perm = [2, 0, 3, 1]; // bijection as permutation
                        var showInverse = false;

                        function randomPerm() {
                            perm = [];
                            var arr = [];
                            for (var i = 0; i < n; i++) arr.push(i);
                            for (var j = n - 1; j > 0; j--) {
                                var k = Math.floor(Math.random() * (j + 1));
                                var tmp = arr[j]; arr[j] = arr[k]; arr[k] = tmp;
                            }
                            perm = arr;
                        }

                        VizEngine.createSlider(controls, 'n', 2, 6, n, 1, function(v) {
                            n = Math.round(v);
                            randomPerm();
                            showInverse = false;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Random', function() {
                            randomPerm();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Flip (f / f\u207B\u00B9)', function() {
                            showInverse = !showInverse;
                            draw();
                        });

                        var leftX = 140, rightX = 420, nodeR = 16;
                        var labelsL = ['1','2','3','4','5','6'];
                        var labelsR = ['a','b','c','d','e','f'];

                        function getY(i) { return 50 + i * (240 / Math.max(n - 1, 1)); }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var srcLabels, dstLabels, srcX, dstX, srcCol, dstCol;
                            if (!showInverse) {
                                srcLabels = labelsL; dstLabels = labelsR;
                                srcX = leftX; dstX = rightX;
                                srcCol = viz.colors.blue; dstCol = viz.colors.teal;
                                viz.screenText('f : A \u2192 B', viz.width / 2, 22, viz.colors.orange, 14);
                            } else {
                                srcLabels = labelsR; dstLabels = labelsL;
                                srcX = rightX; dstX = leftX;
                                srcCol = viz.colors.teal; dstCol = viz.colors.blue;
                                viz.screenText('f\u207B\u00B9 : B \u2192 A', viz.width / 2, 22, viz.colors.green, 14);
                            }

                            // Arrows
                            for (var i = 0; i < n; i++) {
                                var from, to;
                                if (!showInverse) {
                                    from = i; to = perm[i];
                                } else {
                                    from = perm[i]; to = i;
                                }
                                var sx = srcX + (srcX < dstX ? nodeR + 4 : -nodeR - 4);
                                var ex = dstX + (dstX > srcX ? -nodeR - 4 : nodeR + 4);
                                var sy = getY(from);
                                var ey = getY(to);

                                var ang = Math.atan2(ey - sy, ex - sx);
                                var col = showInverse ? viz.colors.green : viz.colors.orange;
                                ctx.strokeStyle = col + 'cc';
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
                                ctx.fillStyle = col + 'cc';
                                ctx.beginPath();
                                ctx.moveTo(ex, ey);
                                ctx.lineTo(ex - 10 * Math.cos(ang - 0.4), ey - 10 * Math.sin(ang - 0.4));
                                ctx.lineTo(ex - 10 * Math.cos(ang + 0.4), ey - 10 * Math.sin(ang + 0.4));
                                ctx.closePath(); ctx.fill();
                            }

                            // Nodes
                            for (var ia = 0; ia < n; ia++) {
                                // Left side always A
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(leftX, getY(ia), nodeR, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white; ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(labelsL[ia], leftX, getY(ia));

                                // Right side always B
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath(); ctx.arc(rightX, getY(ia), nodeR, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(labelsR[ia], rightX, getY(ia));
                            }

                            viz.screenText('A', leftX, getY(n) + 20, viz.colors.blue, 14);
                            viz.screenText('B', rightX, getY(n) + 20, viz.colors.teal, 14);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(f: \\mathbb{R} \\to \\mathbb{R}\\) with \\(f(x) = 2x + 3\\) and \\(g: \\mathbb{R} \\to \\mathbb{R}\\) with \\(g(x) = x^2\\). Find \\((g \\circ f)(x)\\) and \\((f \\circ g)(x)\\). Are they equal?',
                    hint: 'Apply the inner function first: \\((g \\circ f)(x) = g(f(x))\\).',
                    solution: '\\((g \\circ f)(x) = g(2x+3) = (2x+3)^2 = 4x^2 + 12x + 9\\). \\((f \\circ g)(x) = f(x^2) = 2x^2 + 3\\). These are <strong>not equal</strong>. Composition is not commutative in general.'
                },
                {
                    question: 'Find the inverse of \\(f: \\mathbb{R} \\to \\mathbb{R}\\) defined by \\(f(x) = 5x - 7\\). Verify that \\(f^{-1}(f(x)) = x\\).',
                    hint: 'Set \\(y = 5x - 7\\) and solve for \\(x\\) in terms of \\(y\\).',
                    solution: '\\(y = 5x - 7 \\Rightarrow x = (y + 7)/5\\), so \\(f^{-1}(y) = (y+7)/5\\). Verification: \\(f^{-1}(f(x)) = f^{-1}(5x - 7) = ((5x-7)+7)/5 = x\\). \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Special Functions
        // ================================================================
        {
            id: 'sec-special',
            title: 'Special Functions',
            content: `
<h2>Special Functions</h2>

<p>Several functions appear so frequently in discrete mathematics and computer science that they deserve special attention.</p>

<h3>Floor and Ceiling</h3>

<div class="env-block definition">
    <div class="env-title">Definition 5.9 (Floor and Ceiling)</div>
    <div class="env-body">
        <p>For any real number \\(x\\):</p>
        <ul>
            <li>The <strong>floor</strong> of \\(x\\), written \\(\\lfloor x \\rfloor\\), is the greatest integer less than or equal to \\(x\\).</li>
            <li>The <strong>ceiling</strong> of \\(x\\), written \\(\\lceil x \\rceil\\), is the least integer greater than or equal to \\(x\\).</li>
        </ul>
        <p>Formally: \\(\\lfloor x \\rfloor = \\max\\{n \\in \\mathbb{Z} : n \\leq x\\}\\) and \\(\\lceil x \\rceil = \\min\\{n \\in \\mathbb{Z} : n \\geq x\\}\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <p>\\(\\lfloor 3.7 \\rfloor = 3\\), \\(\\lceil 3.7 \\rceil = 4\\). \\(\\lfloor -2.3 \\rfloor = -3\\), \\(\\lceil -2.3 \\rceil = -2\\). \\(\\lfloor 5 \\rfloor = \\lceil 5 \\rceil = 5\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.6 (Floor and Ceiling Properties)</div>
    <div class="env-body">
        <p>For all \\(x \\in \\mathbb{R}\\) and \\(n \\in \\mathbb{Z}\\):</p>
        <ol>
            <li>\\(\\lfloor x \\rfloor \\leq x < \\lfloor x \\rfloor + 1\\) and \\(\\lceil x \\rceil - 1 < x \\leq \\lceil x \\rceil\\).</li>
            <li>\\(x - 1 < \\lfloor x \\rfloor \\leq x \\leq \\lceil x \\rceil < x + 1\\).</li>
            <li>\\(\\lfloor x + n \\rfloor = \\lfloor x \\rfloor + n\\) and \\(\\lceil x + n \\rceil = \\lceil x \\rceil + n\\).</li>
            <li>\\(\\lceil x \\rceil = -\\lfloor -x \\rfloor\\).</li>
            <li>If \\(x\\) is not an integer, \\(\\lceil x \\rceil = \\lfloor x \\rfloor + 1\\).</li>
        </ol>
    </div>
</div>

<h3>The Modulo Operator</h3>

<div class="env-block definition">
    <div class="env-title">Definition 5.10 (Mod)</div>
    <div class="env-body">
        <p>For integers \\(a\\) and positive integer \\(m\\), \\(a \\bmod m\\) is the remainder when \\(a\\) is divided by \\(m\\):</p>
        \\[a \\bmod m = a - m \\lfloor a/m \\rfloor.\\]
        <p>So \\(0 \\leq a \\bmod m < m\\). The function \\(f(a) = a \\bmod m\\) maps \\(\\mathbb{Z} \\to \\{0, 1, \\ldots, m-1\\}\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <p>\\(17 \\bmod 5 = 2\\) (since \\(17 = 3 \\times 5 + 2\\)). \\(-7 \\bmod 3 = 2\\) (since \\(-7 = (-3) \\times 3 + 2\\); note \\(\\lfloor -7/3 \\rfloor = -3\\)).</p>
    </div>
</div>

<h3>Sequences as Functions</h3>

<div class="env-block definition">
    <div class="env-title">Definition 5.11 (Sequence)</div>
    <div class="env-body">
        <p>A <strong>sequence</strong> is a function \\(a: \\mathbb{N} \\to S\\) for some set \\(S\\). We write \\(a_n\\) instead of \\(a(n)\\) and denote the sequence \\(\\{a_n\\}_{n=0}^{\\infty}\\) or \\((a_0, a_1, a_2, \\ldots)\\).</p>
    </div>
</div>

<p>Examples include arithmetic sequences \\(a_n = a_0 + nd\\), geometric sequences \\(a_n = a_0 r^n\\), and recursively defined sequences like the Fibonacci numbers \\(F_0 = 0,\\; F_1 = 1,\\; F_n = F_{n-1} + F_{n-2}\\).</p>

<div class="viz-placeholder" data-viz="viz-floor-ceiling"></div>
`,
            visualizations: [
                {
                    id: 'viz-floor-ceiling',
                    title: 'Floor and Ceiling Step Functions',
                    description: 'The floor function \\(\\lfloor x \\rfloor\\) rounds down (blue staircase); the ceiling function \\(\\lceil x \\rceil\\) rounds up (teal staircase). Drag the red point to explore values. At integers, both functions agree.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 200, scale: 50
                        });

                        var probeX = 1.7;

                        var drag = viz.addDraggable('probe', probeX, 0, viz.colors.red, 8, function(wx) {
                            probeX = wx;
                        });

                        viz.animate(function() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            var ctx = viz.ctx;
                            var xMin = -viz.originX / viz.scale;
                            var xMax = (viz.width - viz.originX) / viz.scale;

                            // Draw y = x reference line
                            viz.drawFunction(function(x) { return x; }, xMin, xMax, viz.colors.text + '33', 1);

                            // Floor function (blue)
                            for (var n = Math.floor(xMin) - 1; n <= Math.ceil(xMax) + 1; n++) {
                                var sx1 = viz.toScreen(n, n)[0];
                                var sx2 = viz.toScreen(n + 1, n)[0];
                                var sy = viz.toScreen(n, n)[1];
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.moveTo(sx1, sy);
                                ctx.lineTo(sx2, sy);
                                ctx.stroke();
                                // Closed dot at left
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(sx1, sy, 3, 0, Math.PI * 2); ctx.fill();
                                // Open dot at right
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.arc(sx2, sy, 3, 0, Math.PI * 2); ctx.stroke();
                            }

                            // Ceiling function (teal)
                            for (var m = Math.floor(xMin) - 1; m <= Math.ceil(xMax) + 1; m++) {
                                var cx1 = viz.toScreen(m, m)[0];
                                var cx2 = viz.toScreen(m + 1, m + 1)[0];
                                var cy1 = viz.toScreen(m, m + 1)[1];
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.moveTo(cx1, cy1);
                                ctx.lineTo(cx2, cy1);
                                ctx.stroke();
                                // Open dot at left
                                ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.arc(cx1, cy1, 3, 0, Math.PI * 2); ctx.stroke();
                                // Closed dot at right
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath(); ctx.arc(cx2, cy1, 3, 0, Math.PI * 2); ctx.fill();
                            }

                            // Probe
                            drag.y = 0;
                            probeX = drag.x;
                            var floorVal = Math.floor(probeX);
                            var ceilVal = Math.ceil(probeX);

                            // Vertical dashed line at probe
                            var probeScreen = viz.toScreen(probeX, 0);
                            ctx.strokeStyle = viz.colors.red + '66';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(probeScreen[0], 0);
                            ctx.lineTo(probeScreen[0], viz.height);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Show floor and ceil dots on probe line
                            var floorPt = viz.toScreen(probeX, floorVal);
                            var ceilPt = viz.toScreen(probeX, ceilVal);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(floorPt[0], floorPt[1], 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(ceilPt[0], ceilPt[1], 5, 0, Math.PI * 2); ctx.fill();

                            viz.drawDraggables();

                            // Info text
                            var xStr = probeX.toFixed(2);
                            viz.screenText('x = ' + xStr, viz.width / 2 - 120, viz.height - 20, viz.colors.red, 12);
                            viz.screenText('\u230A' + xStr + '\u230B = ' + floorVal, viz.width / 2, viz.height - 20, viz.colors.blue, 12);
                            viz.screenText('\u2308' + xStr + '\u2309 = ' + ceilVal, viz.width / 2 + 120, viz.height - 20, viz.colors.teal, 12);

                            // Legend
                            viz.screenText('\u230Ax\u230B floor', 70, 20, viz.colors.blue, 11);
                            viz.screenText('\u2308x\u2309 ceiling', 70, 36, viz.colors.teal, 11);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\lfloor -3.2 \\rfloor\\), \\(\\lceil -3.2 \\rceil\\), \\(\\lfloor 7 \\rfloor\\), and \\(\\lceil 7 \\rceil\\).',
                    hint: 'Floor rounds toward \\(-\\infty\\), ceiling rounds toward \\(+\\infty\\).',
                    solution: '\\(\\lfloor -3.2 \\rfloor = -4\\) (not \\(-3\\); floor goes <em>down</em>). \\(\\lceil -3.2 \\rceil = -3\\). \\(\\lfloor 7 \\rfloor = \\lceil 7 \\rceil = 7\\) (integers are fixed points of both functions).'
                },
                {
                    question: 'How many multiples of 7 lie in the range \\([100, 1000]\\)?',
                    hint: 'The smallest multiple of 7 that is \\(\\geq 100\\) is \\(7 \\lceil 100/7 \\rceil\\). The largest that is \\(\\leq 1000\\) is \\(7 \\lfloor 1000/7 \\rfloor\\).',
                    solution: 'First: \\(\\lceil 100/7 \\rceil = \\lceil 14.28...\\rceil = 15\\), so the smallest is \\(7 \\times 15 = 105\\). Last: \\(\\lfloor 1000/7 \\rfloor = \\lfloor 142.85...\\rfloor = 142\\), so the largest is \\(7 \\times 142 = 994\\). Count: \\(142 - 15 + 1 = 128\\) multiples.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to Counting
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Bridge to Counting',
            content: `
<h2>Bridge to Counting</h2>

<div class="env-block intuition">
    <div class="env-title">Functions as Counting Tools</div>
    <div class="env-body">
        <p>We have been classifying functions by their structural properties. But injections, surjections, and bijections have a direct payoff in combinatorics. A bijection between two finite sets proves they have the same size (without counting either set directly). An injection from \\(A\\) to \\(B\\) proves \\(|A| \\leq |B|\\). These ideas lead to one of the most useful principles in discrete mathematics: the pigeonhole principle.</p>
    </div>
</div>

<h3>The Pigeonhole Principle</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.7 (Pigeonhole Principle)</div>
    <div class="env-body">
        <p>If \\(f: A \\to B\\) is a function and \\(|A| > |B|\\), then \\(f\\) is <strong>not injective</strong>. That is, there exist distinct \\(a_1, a_2 \\in A\\) with \\(f(a_1) = f(a_2)\\).</p>
        <p>Colloquially: if \\(n\\) pigeons roost in \\(m\\) holes and \\(n > m\\), then at least one hole contains at least two pigeons.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>By Theorem 5.1, an injection from \\(A\\) to \\(B\\) requires \\(|A| \\leq |B|\\). If \\(|A| > |B|\\), no injection exists, so every function \\(f: A \\to B\\) must map two distinct elements to the same output.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.8 (Generalized Pigeonhole Principle)</div>
    <div class="env-body">
        <p>If \\(f: A \\to B\\) with \\(|A| = n\\) and \\(|B| = m\\), then there exists some \\(b \\in B\\) with \\(|f^{-1}(\\{b\\})| \\geq \\lceil n/m \\rceil\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Birthday Paradox Setup</div>
    <div class="env-body">
        <p>Among 367 people, at least two share a birthday. Here \\(A\\) = people (367), \\(B\\) = possible birthdays (366, including Feb 29), and \\(|A| > |B|\\), so the "birthday function" cannot be injective.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Generalized PHP</div>
    <div class="env-body">
        <p>If 50 people take a test with integer scores from 0 to 10 (11 possible values), then at least \\(\\lceil 50/11 \\rceil = 5\\) people received the same score.</p>
    </div>
</div>

<h3>Bijective Proof Technique</h3>

<p>To show that two finite sets \\(S\\) and \\(T\\) have the same cardinality, construct a bijection \\(f: S \\to T\\). This is often easier than counting \\(|S|\\) and \\(|T|\\) independently. We will see this technique extensively in the counting chapters ahead.</p>

<div class="env-block example">
    <div class="env-title">Example: Subsets and Binary Strings</div>
    <div class="env-body">
        <p>The number of subsets of \\(\\{1, 2, \\ldots, n\\}\\) equals the number of binary strings of length \\(n\\). The bijection: associate each subset \\(S\\) with the string \\(b_1 b_2 \\ldots b_n\\) where \\(b_i = 1\\) if \\(i \\in S\\) and \\(b_i = 0\\) otherwise. Both sets have \\(2^n\\) elements.</p>
    </div>
</div>

<h3>Looking Ahead</h3>

<p>In Chapter 6 (Basic Counting Principles), we will use the multiplication rule, which is fundamentally about counting functions. In Chapter 7, the pigeonhole principle will yield surprising existence results. In Part D (Graph Theory), functions will reappear as graph homomorphisms and colorings. The language of functions is the language of mathematics itself.</p>

<div class="viz-placeholder" data-viz="viz-pigeonhole-preview"></div>
`,
            visualizations: [
                {
                    id: 'viz-pigeonhole-preview',
                    title: 'Pigeonhole Principle: Why Injection Fails',
                    description: 'Place n pigeons into m holes. When n > m, at least one hole must contain two or more pigeons. Drag the sliders to see the principle in action.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nPigeons = 5, mHoles = 3;
                        var assignment = [];

                        function assignPigeons() {
                            assignment = [];
                            for (var i = 0; i < nPigeons; i++) {
                                assignment.push(Math.floor(Math.random() * mHoles));
                            }
                        }
                        assignPigeons();

                        VizEngine.createSlider(controls, 'Pigeons (n)', 1, 10, nPigeons, 1, function(v) {
                            nPigeons = Math.round(v);
                            assignPigeons();
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Holes (m)', 1, 8, mHoles, 1, function(v) {
                            mHoles = Math.round(v);
                            assignPigeons();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reassign', function() {
                            assignPigeons();
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Count per hole
                            var counts = [];
                            for (var j = 0; j < mHoles; j++) counts.push(0);
                            for (var i = 0; i < nPigeons; i++) {
                                if (assignment[i] < mHoles) counts[assignment[i]]++;
                            }

                            var maxCount = 0;
                            for (var k = 0; k < mHoles; k++) if (counts[k] > maxCount) maxCount = counts[k];

                            // Draw holes as boxes
                            var holeW = Math.min(60, (viz.width - 60) / mHoles);
                            var holeH = 180;
                            var startX = (viz.width - mHoles * holeW) / 2;
                            var baseY = 300;

                            for (var h = 0; h < mHoles; h++) {
                                var hx = startX + h * holeW;
                                var isMax = counts[h] === maxCount && maxCount > 1;
                                ctx.strokeStyle = isMax ? viz.colors.red : viz.colors.text + '66';
                                ctx.lineWidth = isMax ? 2 : 1;
                                ctx.strokeRect(hx + 4, baseY - holeH, holeW - 8, holeH);

                                // Hole label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText('Hole ' + (h + 1), hx + holeW / 2, baseY + 4);

                                // Count label
                                ctx.fillStyle = counts[h] > 1 ? viz.colors.red : viz.colors.green;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.fillText(String(counts[h]), hx + holeW / 2, baseY + 18);

                                // Draw pigeons as stacked circles
                                var pigeonR = Math.min(12, (holeW - 16) / 2);
                                for (var p = 0; p < counts[h]; p++) {
                                    var px = hx + holeW / 2;
                                    var py = baseY - 10 - p * (pigeonR * 2 + 4) - pigeonR;
                                    ctx.fillStyle = counts[h] > 1 ? viz.colors.orange : viz.colors.blue;
                                    ctx.beginPath(); ctx.arc(px, py, pigeonR, 0, Math.PI * 2); ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                }
                            }

                            // Title and info
                            viz.screenText('Pigeonhole Principle', viz.width / 2, 20, viz.colors.white, 15);

                            var injective = nPigeons <= mHoles;
                            var phpApplies = nPigeons > mHoles;
                            var bound = Math.ceil(nPigeons / mHoles);

                            if (phpApplies) {
                                viz.screenText(
                                    nPigeons + ' pigeons > ' + mHoles + ' holes: injection impossible!',
                                    viz.width / 2, 48, viz.colors.red, 12
                                );
                                viz.screenText(
                                    'Some hole must have \u2265 \u2308' + nPigeons + '/' + mHoles + '\u2309 = ' + bound + ' pigeons',
                                    viz.width / 2, 66, viz.colors.orange, 12
                                );
                            } else {
                                viz.screenText(
                                    nPigeons + ' pigeons \u2264 ' + mHoles + ' holes: injection is possible',
                                    viz.width / 2, 48, viz.colors.green, 12
                                );
                            }

                            viz.screenText('Max occupancy: ' + maxCount, viz.width / 2, viz.height - 16, viz.colors.white, 12);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a group of 13 people, prove that at least two were born in the same month.',
                    hint: 'What is \\(A\\)? What is \\(B\\)? What is the function?',
                    solution: 'Let \\(A\\) = the 13 people, \\(B\\) = \\{Jan, Feb, ..., Dec\\} (12 months), and \\(f: A \\to B\\) assign to each person their birth month. Since \\(|A| = 13 > 12 = |B|\\), by the pigeonhole principle, \\(f\\) is not injective: at least two people share a birth month.'
                },
                {
                    question: 'Prove: among any 5 integers, there exist two whose difference is divisible by 4.',
                    hint: 'Consider the function that maps each integer to its remainder modulo 4. How many possible remainders are there?',
                    solution: 'Define \\(f: A \\to \\{0, 1, 2, 3\\}\\) by \\(f(n) = n \\bmod 4\\). With 5 integers and 4 possible remainders, by pigeonhole, two integers \\(a, b\\) have the same remainder. Then \\(a - b \\equiv 0 \\pmod{4}\\), i.e., \\(4 \\mid (a - b)\\).'
                },
                {
                    question: 'Show that in any set of 10 distinct integers between 1 and 60, there exist two disjoint pairs with equal sums.',
                    hint: 'Count the number of pairs and the range of possible pair sums. Apply pigeonhole.',
                    solution: 'There are \\(\\binom{10}{2} = 45\\) pairs. The minimum pair sum is \\(1 + 2 = 3\\) and the maximum is \\(59 + 60 = 119\\), giving at most \\(119 - 3 + 1 = 117\\) possible sums. With 45 pairs and 117 possible sums, pigeonhole does not directly force a collision. But we need <em>disjoint</em> pairs. A more careful argument: group the 10 integers into pairs; there are many more unordered pairs than distinct achievable sums among them, guaranteeing two disjoint pairs with equal sums. (Full proof uses a refined counting argument or the Erdos-Ginzburg-Ziv theorem.)'
                }
            ]
        }
    ]
});
