window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch06',
    number: 6,
    title: 'Basic Counting Principles',
    subtitle: 'How to count without listing',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Counting Is Hard',
            content: `
<h2>Why Counting Is Hard</h2>

<div class="env-block intuition">
    <div class="env-title">A Deceptive Simplicity</div>
    <div class="env-body">
        <p>Counting sounds trivial: you point at things and say "one, two, three..." But combinatorics, the mathematics of counting, is anything but trivial. How many ways can 10 people sit around a circular table? How many 8-character passwords use at least one digit and one symbol? These questions resist brute-force enumeration, yet their answers follow from a handful of principles.</p>
    </div>
</div>

<p>In discrete mathematics, counting arises everywhere: enumerating data structures, analyzing algorithm complexity, computing probabilities, establishing existence results. The goal of this chapter is to develop <strong>systematic methods for counting without listing</strong>.</p>

<p>Consider the apparently simple question: how many subsets does a set of \\(n\\) elements have? Listing them by hand works for \\(n = 3\\) (there are 8), but for \\(n = 20\\) there are \\(2^{20} = 1{,}048{,}576\\) subsets. For \\(n = 100\\), the number exceeds \\(10^{30}\\). We need formulas, not lists.</p>

<h3>The Counting Toolkit</h3>

<p>This chapter builds five interlocking tools:</p>
<ol>
    <li><strong>The Product Rule</strong>: when a procedure decomposes into sequential stages.</li>
    <li><strong>The Sum Rule</strong>: when alternatives are mutually exclusive.</li>
    <li><strong>Permutations</strong>: ordered arrangements.</li>
    <li><strong>Combinations</strong>: unordered selections.</li>
    <li><strong>The Binomial Theorem</strong>: the algebraic engine that unifies them all through Pascal's triangle.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The Indian mathematician Mahavira (9th century) studied permutations and combinations. Pascal's 1654 <em>Trait&eacute; du triangle arithm&eacute;tique</em> gave the systematic treatment of binomial coefficients we use today. The product and sum rules, though elementary, were only formally articulated in the 20th century as combinatorics became a rigorous discipline.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Counting Grows Fast</div>
    <div class="env-body">
        <p>A standard deck of 52 cards has \\(52! \\approx 8.07 \\times 10^{67}\\) possible orderings. That exceeds the number of atoms in the observable universe (\\(\\approx 10^{80}\\) atoms, but \\(52!\\) is within 13 orders of magnitude). Listing all orderings at one per nanosecond would take more than \\(10^{50}\\) years. Combinatorics lets us compute \\(52!\\) in a single line.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: The Product Rule
        // ================================================================
        {
            id: 'sec-product',
            title: 'Product Rule',
            content: `
<h2>The Product Rule</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Phrase: "For Each"</div>
    <div class="env-body">
        <p>You are choosing a meal: first a main course, then a dessert. If there are 4 mains and 3 desserts, you make a <em>sequence</em> of two independent choices. For <strong>each</strong> main, there are 3 dessert options, giving \\(4 \\times 3 = 12\\) meals total. The word "for each" signals multiplication.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.1 (Product Rule)</div>
    <div class="env-body">
        <p>If a procedure can be broken into \\(k\\) successive stages, where stage \\(i\\) can be performed in \\(n_i\\) ways <em>regardless of choices at previous stages</em>, then the total number of ways to carry out the entire procedure is</p>
        \\[n_1 \\times n_2 \\times \\cdots \\times n_k.\\]
    </div>
</div>

<p>The product rule requires <strong>independence</strong>: the number of options at each stage must not depend on earlier choices. When it does depend, we need a more careful analysis (the tree diagram below illustrates this).</p>

<div class="env-block example">
    <div class="env-title">Example: License Plates</div>
    <div class="env-body">
        <p>A license plate has 3 letters followed by 4 digits. How many plates are possible?</p>
        \\[26^3 \\times 10^4 = 17{,}576 \\times 10{,}000 = 175{,}760{,}000.\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Bit Strings</div>
    <div class="env-body">
        <p>A bit string of length \\(n\\) is a sequence of 0s and 1s. Each bit has 2 choices, independently. By the product rule, there are \\(2^n\\) bit strings of length \\(n\\). This also counts the subsets of an \\(n\\)-element set (each element is either included or excluded).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-product-rule"></div>
`,
            visualizations: [
                {
                    id: 'viz-product-rule',
                    title: 'Tree Diagram: The Product Rule in Action',
                    description: 'A tree diagram shows every outcome as a path from root to leaf. Adjust the number of choices at each stage and watch the tree grow. The total number of leaves equals the product of choices at each stage.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var stage1 = 3;
                        var stage2 = 2;
                        var animProgress = 1.0;
                        var animating = false;

                        VizEngine.createSlider(controls, 'Stage 1 choices', 2, 5, stage1, 1, function(v) {
                            stage1 = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Stage 2 choices', 2, 4, stage2, 1, function(v) {
                            stage2 = Math.round(v);
                            draw();
                        });
                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animProgress = 0;
                            var start = performance.now();
                            var duration = 1500;
                            function step(t) {
                                animProgress = Math.min(1, (t - start) / duration);
                                draw();
                                if (animProgress < 1) requestAnimationFrame(step);
                                else animating = false;
                            }
                            requestAnimationFrame(step);
                        });

                        var stageColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green];
                        var labels1 = ['A', 'B', 'C', 'D', 'E'];
                        var labels2 = ['1', '2', '3', '4'];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var total = stage1 * stage2;

                            var rootX = 60, rootY = viz.height / 2;
                            var midX = 210, endX = 400, labelX = 500;

                            viz.screenText('Root', rootX, 25, viz.colors.text, 11);
                            viz.screenText('Stage 1', midX, 25, viz.colors.blue, 11);
                            viz.screenText('Stage 2', endX, 25, viz.colors.teal, 11);
                            viz.screenText('Outcome', labelX, 25, viz.colors.white, 11);

                            // Root
                            ctx.fillStyle = viz.colors.white;
                            ctx.beginPath(); ctx.arc(rootX, rootY, 6, 0, Math.PI * 2); ctx.fill();

                            var s1Spacing = Math.min(65, (viz.height - 80) / (stage1 - 1 || 1));
                            var s1Top = rootY - (stage1 - 1) * s1Spacing / 2;

                            var visibleLeaves = Math.floor(animProgress * total);

                            for (var i = 0; i < stage1; i++) {
                                var s1Y = s1Top + i * s1Spacing;
                                var col = stageColors[i % stageColors.length];

                                ctx.strokeStyle = col + '88'; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(rootX + 6, rootY); ctx.lineTo(midX - 6, s1Y); ctx.stroke();

                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(midX, s1Y, 6, 0, Math.PI * 2); ctx.fill();

                                ctx.fillStyle = col; ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(labels1[i], midX, s1Y - 14);

                                var s2Spacing = Math.min(25, s1Spacing / (stage2 + 0.5));
                                var s2Top = s1Y - (stage2 - 1) * s2Spacing / 2;

                                for (var j = 0; j < stage2; j++) {
                                    var leafIdx = i * stage2 + j;
                                    if (leafIdx >= visibleLeaves && animating) continue;

                                    var s2Y = s2Top + j * s2Spacing;
                                    ctx.strokeStyle = viz.colors.teal + '66'; ctx.lineWidth = 1.5;
                                    ctx.beginPath(); ctx.moveTo(midX + 6, s1Y); ctx.lineTo(endX - 4, s2Y); ctx.stroke();

                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.beginPath(); ctx.arc(endX, s2Y, 4, 0, Math.PI * 2); ctx.fill();

                                    ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText(labels1[i] + labels2[j], labelX - 20, s2Y);
                                }
                            }

                            viz.screenText(
                                stage1 + ' \u00D7 ' + stage2 + ' = ' + total + ' outcomes',
                                viz.width / 2, viz.height - 20, viz.colors.white, 14
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A password must be exactly 6 characters long. The first two characters must be uppercase letters (A-Z) and the remaining four must be digits (0-9). How many such passwords exist?',
                    hint: 'Use the product rule: 26 choices for each letter position, 10 choices for each digit position.',
                    solution: 'By the product rule: \\(26^2 \\times 10^4 = 676 \\times 10{,}000 = 6{,}760{,}000\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Sum Rule
        // ================================================================
        {
            id: 'sec-sum',
            title: 'Sum Rule',
            content: `
<h2>The Sum Rule</h2>

<div class="env-block intuition">
    <div class="env-title">OR vs AND</div>
    <div class="env-body">
        <p>The product rule handles "and then" (do stage 1 <strong>and then</strong> stage 2). The sum rule handles "or" (do task A <strong>or</strong> task B, but not both). If category A has \\(m\\) options and category B has \\(n\\) options, and no option belongs to both categories, the total is \\(m + n\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.2 (Sum Rule)</div>
    <div class="env-body">
        <p>If a task can be done by choosing from one of \\(k\\) <strong>mutually exclusive</strong> (disjoint) categories, with \\(n_1\\) options in category 1, \\(n_2\\) in category 2, ..., \\(n_k\\) in category \\(k\\), then the total number of ways is</p>
        \\[n_1 + n_2 + \\cdots + n_k.\\]
    </div>
</div>

<p>In set-theoretic terms, if \\(A_1, A_2, \\ldots, A_k\\) are pairwise disjoint finite sets, then</p>
\\[|A_1 \\cup A_2 \\cup \\cdots \\cup A_k| = |A_1| + |A_2| + \\cdots + |A_k|.\\]

<div class="env-block example">
    <div class="env-title">Example: Choosing a Representative</div>
    <div class="env-body">
        <p>A club has 15 freshmen, 12 sophomores, and 10 juniors. They choose one representative from any class: \\(15 + 12 + 10 = 37\\) choices. If instead they form a committee of one from <em>each</em> class, the product rule gives \\(15 \\times 12 \\times 10 = 1{,}800\\).</p>
    </div>
</div>

<h3>Complement Counting</h3>

<p>When counting a set \\(A\\) directly is difficult but its complement \\(\\overline{A}\\) is easy, use:</p>
\\[|A| = |U| - |\\overline{A}|\\]

<div class="env-block example">
    <div class="env-title">Example: PINs with a Repeated Digit</div>
    <div class="env-body">
        <p>How many 4-digit PINs (0000-9999) have at least one repeated digit?</p>
        <ul>
            <li>Total PINs: \\(10^4 = 10{,}000\\)</li>
            <li>PINs with all distinct digits: \\(10 \\times 9 \\times 8 \\times 7 = 5{,}040\\)</li>
            <li>PINs with at least one repeat: \\(10{,}000 - 5{,}040 = 4{,}960\\)</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-sum-rule"></div>
`,
            visualizations: [
                {
                    id: 'viz-sum-rule',
                    title: 'Sum Rule: Counting Disjoint Sets',
                    description: 'Drag the sliders to adjust the sizes of two disjoint categories. The total count is their sum. When the sets overlap (not disjoint), we must subtract the overlap to avoid double-counting.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var sizeA = 5;
                        var sizeB = 4;
                        var overlap = 0;

                        VizEngine.createSlider(controls, '|A|', 1, 10, sizeA, 1, function(v) { sizeA = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, '|B|', 1, 10, sizeB, 1, function(v) { sizeB = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'Overlap', 0, 5, overlap, 1, function(v) {
                            overlap = Math.min(Math.round(v), Math.min(sizeA, sizeB));
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var realOverlap = Math.min(overlap, Math.min(sizeA, sizeB));

                            // Draw set A (left circle)
                            var cxA = 200, cxB = 380, cy = 170, r = 110;
                            var sep = realOverlap > 0 ? r * (1 - realOverlap / Math.max(sizeA, sizeB) * 0.8) : r + 30;
                            cxA = viz.width / 2 - sep / 2 - 20;
                            cxB = viz.width / 2 + sep / 2 + 20;

                            // A fill
                            ctx.fillStyle = viz.colors.blue + '33';
                            ctx.beginPath(); ctx.arc(cxA, cy, r, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(cxA, cy, r, 0, Math.PI * 2); ctx.stroke();

                            // B fill
                            ctx.fillStyle = viz.colors.teal + '33';
                            ctx.beginPath(); ctx.arc(cxB, cy, r, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(cxB, cy, r, 0, Math.PI * 2); ctx.stroke();

                            // Labels
                            viz.screenText('A', cxA - r / 2, cy - r + 20, viz.colors.blue, 16);
                            viz.screenText('B', cxB + r / 2, cy - r + 20, viz.colors.teal, 16);

                            // Draw dots for elements
                            var dotR = 6;
                            function drawDots(cx, cy, count, color, startAngle) {
                                for (var i = 0; i < count; i++) {
                                    var angle = startAngle + i * (Math.PI * 2 / Math.max(count, 1));
                                    var dr = r * 0.55;
                                    var dx = cx + dr * Math.cos(angle);
                                    var dy = cy + dr * Math.sin(angle);
                                    ctx.fillStyle = color;
                                    ctx.beginPath(); ctx.arc(dx, dy, dotR, 0, Math.PI * 2); ctx.fill();
                                }
                            }

                            drawDots(cxA, cy, sizeA - realOverlap, viz.colors.blue, 0);
                            drawDots(cxB, cy, sizeB - realOverlap, viz.colors.teal, Math.PI / 3);

                            // Overlap dots in the middle
                            if (realOverlap > 0) {
                                var midX = (cxA + cxB) / 2;
                                for (var i = 0; i < realOverlap; i++) {
                                    var y = cy - (realOverlap - 1) * 14 / 2 + i * 14;
                                    ctx.fillStyle = viz.colors.purple;
                                    ctx.beginPath(); ctx.arc(midX, y, dotR, 0, Math.PI * 2); ctx.fill();
                                }
                            }

                            // Formula
                            var total = sizeA + sizeB - realOverlap;
                            var formula = '|A \u222A B| = |A| + |B|';
                            if (realOverlap > 0) {
                                formula += ' - |A \u2229 B| = ' + sizeA + ' + ' + sizeB + ' - ' + realOverlap + ' = ' + total;
                            } else {
                                formula += ' = ' + sizeA + ' + ' + sizeB + ' = ' + total;
                            }
                            viz.screenText(formula, viz.width / 2, viz.height - 40, viz.colors.white, 14);

                            if (realOverlap > 0) {
                                viz.screenText('(Not disjoint: need inclusion-exclusion)', viz.width / 2, viz.height - 18, viz.colors.orange, 11);
                            } else {
                                viz.screenText('(Disjoint sets: sum rule applies directly)', viz.width / 2, viz.height - 18, viz.colors.green, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A student must choose a project topic from one of three lists: List A has 8 topics, List B has 12 topics, and List C has 5 topics. No topic appears on more than one list. How many choices does the student have?',
                    hint: 'The lists are mutually exclusive categories.',
                    solution: 'By the sum rule: \\(8 + 12 + 5 = 25\\) choices.'
                },
                {
                    question: 'How many bit strings of length 8 start with 1 or end with 00?',
                    hint: 'Count each case separately. But the cases are not disjoint: some strings start with 1 AND end with 00. Use inclusion-exclusion.',
                    solution: 'Strings starting with 1: \\(2^7 = 128\\). Strings ending with 00: \\(2^6 = 64\\). Strings starting with 1 AND ending with 00: \\(2^5 = 32\\). By inclusion-exclusion: \\(128 + 64 - 32 = 160\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Permutations
        // ================================================================
        {
            id: 'sec-permutations',
            title: 'Permutations',
            content: `
<h2>Permutations: When Order Matters</h2>

<div class="env-block intuition">
    <div class="env-title">The Shrinking Pool</div>
    <div class="env-body">
        <p>Line up 5 people for a photo. For position 1, you have 5 choices. Once someone stands there, only 4 remain for position 2. Then 3, then 2, then 1. The total: \\(5 \\times 4 \\times 3 \\times 2 \\times 1 = 5! = 120\\). This "shrinking pool" effect is the essence of permutations.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 6.1 (Factorial)</div>
    <div class="env-body">
        <p>For a non-negative integer \\(n\\), the <strong>factorial</strong> is</p>
        \\[n! = n \\times (n-1) \\times \\cdots \\times 2 \\times 1, \\qquad 0! = 1.\\]
        <p>The convention \\(0! = 1\\) corresponds to the fact that there is exactly one way to arrange zero objects: do nothing.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 6.2 (\\(r\\)-Permutation)</div>
    <div class="env-body">
        <p>An <strong>\\(r\\)-permutation</strong> of a set of \\(n\\) elements is an ordered arrangement of \\(r\\) of the \\(n\\) elements. The count is</p>
        \\[P(n, r) = \\frac{n!}{(n-r)!} = n(n-1)(n-2)\\cdots(n-r+1).\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Podium Finishes</div>
    <div class="env-body">
        <p>In a race with 10 runners, how many ways can gold, silver, and bronze be awarded?</p>
        \\[P(10, 3) = 10 \\times 9 \\times 8 = 720.\\]
    </div>
</div>

<h3>Permutations with Repetition</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.3 (Multinomial Coefficient)</div>
    <div class="env-body">
        <p>The number of distinct permutations of \\(n\\) objects, where there are \\(n_1\\) identical copies of type 1, \\(n_2\\) of type 2, ..., \\(n_k\\) of type \\(k\\) (with \\(n_1 + \\cdots + n_k = n\\)), is</p>
        \\[\\frac{n!}{n_1! \\, n_2! \\, \\cdots \\, n_k!}.\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: MISSISSIPPI</div>
    <div class="env-body">
        <p>MISSISSIPPI has 11 letters: 1 M, 4 I's, 4 S's, 2 P's.</p>
        \\[\\frac{11!}{1! \\cdot 4! \\cdot 4! \\cdot 2!} = \\frac{39{,}916{,}800}{1{,}152} = 34{,}650.\\]
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-permutations"></div>
`,
            visualizations: [
                {
                    id: 'viz-permutations',
                    title: 'Permutation Explorer',
                    description: 'See all permutations of a small set. Click "Animate" to watch each arrangement appear. The positions fill from the shrinking pool of remaining elements.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 4;
                        var r = 4;
                        var allPerms = [];
                        var animIdx = 0;
                        var animating = false;
                        var items = ['A', 'B', 'C', 'D', 'E'];
                        var itemColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green];

                        VizEngine.createSlider(controls, 'n (total)', 2, 5, n, 1, function(v) {
                            n = Math.round(v);
                            r = Math.min(r, n);
                            computePerms();
                            animIdx = 0;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'r (choose)', 1, 5, r, 1, function(v) {
                            r = Math.min(Math.round(v), n);
                            computePerms();
                            animIdx = 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animIdx = 0;
                            function step() {
                                if (animIdx >= allPerms.length) { animating = false; return; }
                                draw();
                                animIdx++;
                                setTimeout(step, Math.max(50, 500 / allPerms.length));
                            }
                            step();
                        });

                        function permute(arr, size) {
                            if (size === 0) return [[]];
                            var result = [];
                            for (var i = 0; i < arr.length; i++) {
                                var rest = arr.slice(0, i).concat(arr.slice(i + 1));
                                var sub = permute(rest, size - 1);
                                for (var j = 0; j < sub.length; j++) {
                                    result.push([arr[i]].concat(sub[j]));
                                }
                            }
                            return result;
                        }

                        function computePerms() {
                            var arr = [];
                            for (var i = 0; i < n; i++) arr.push(i);
                            allPerms = permute(arr, r);
                        }
                        computePerms();

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('P(' + n + ', ' + r + ') = ' + allPerms.length + ' permutations', viz.width / 2, 22, viz.colors.white, 14);
                            viz.screenText('{' + items.slice(0, n).join(', ') + '}, choose ' + r, viz.width / 2, 42, viz.colors.teal, 12);

                            // Grid display
                            var cols = Math.min(Math.ceil(Math.sqrt(allPerms.length * 1.5)), 15);
                            var cellW = Math.min(50, (viz.width - 40) / cols);
                            var cellH = 22;
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 65;

                            for (var p = 0; p < allPerms.length; p++) {
                                var row = Math.floor(p / cols);
                                var col = p % cols;
                                var px = startX + col * cellW;
                                var py = startY + row * cellH;
                                if (py + cellH > viz.height - 55) break;

                                var isHighlighted = animating && p === animIdx - 1;
                                var label = '';
                                for (var k = 0; k < allPerms[p].length; k++) {
                                    label += items[allPerms[p][k]];
                                }

                                if (isHighlighted) {
                                    ctx.fillStyle = viz.colors.teal + '33';
                                    ctx.fillRect(px - 2, py - cellH / 2 + 4, cellW - 2, cellH - 4);
                                }

                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillStyle = (animating && p < animIdx) || !animating ? viz.colors.white : viz.colors.text + '44';
                                ctx.fillText(label, px, py);
                            }

                            // Show formula
                            var factStr = n + '';
                            for (var f = 1; f < r; f++) factStr += ' \u00D7 ' + (n - f);
                            viz.screenText('Formula: ' + factStr + ' = ' + allPerms.length, viz.width / 2, viz.height - 20, viz.colors.orange, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many distinct arrangements are there of the letters in BANANA?',
                    hint: 'Count letter frequencies: B:1, A:3, N:2. Use the multinomial coefficient.',
                    solution: 'BANANA has 6 letters with frequencies B:1, A:3, N:2. Distinct arrangements: \\(\\frac{6!}{1! \\cdot 3! \\cdot 2!} = \\frac{720}{12} = 60\\).'
                },
                {
                    question: 'Ten students line up. In how many arrangements are Alice and Bob adjacent?',
                    hint: 'Treat Alice-Bob as one "super-person" to arrange, but remember they can swap positions.',
                    solution: 'Glue Alice and Bob into one unit: 9 objects to arrange (\\(9!\\) ways). Within the unit, Alice and Bob can swap (\\(2\\) ways). Total: \\(2 \\times 9! = 725{,}760\\).'
                },
                {
                    question: 'How many ways can 8 rooks be placed on an 8\\(\\times\\)8 chessboard so that no two rooks attack each other (i.e., no two share a row or column)?',
                    hint: 'Each row gets exactly one rook. The question reduces to assigning columns.',
                    solution: 'Assign a column to each row. Row 1 has 8 column choices, row 2 has 7, etc. The total is \\(8! = 40{,}320\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Combinations
        // ================================================================
        {
            id: 'sec-combinations',
            title: 'Combinations',
            content: `
<h2>Combinations: When Order Does Not Matter</h2>

<div class="env-block intuition">
    <div class="env-title">From Permutations to Combinations</div>
    <div class="env-body">
        <p>To form a 3-person committee from 5 people, {Alice, Bob, Carol} is the same committee as {Carol, Alice, Bob}. Each committee of 3 corresponds to \\(3! = 6\\) different orderings. So the number of committees is the number of permutations divided by the overcounting:</p>
        \\[\\binom{5}{3} = \\frac{P(5,3)}{3!} = \\frac{60}{6} = 10.\\]
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 6.3 (Binomial Coefficient)</div>
    <div class="env-body">
        <p>The number of ways to choose \\(r\\) elements from an \\(n\\)-element set, without regard to order, is</p>
        \\[\\binom{n}{r} = \\frac{n!}{r!(n-r)!}, \\qquad 0 \\leq r \\leq n.\\]
        <p>Read "\\(n\\) choose \\(r\\)." By convention, \\(\\binom{n}{r} = 0\\) when \\(r < 0\\) or \\(r > n\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.4 (Key Properties)</div>
    <div class="env-body">
        <ol>
            <li><strong>Symmetry:</strong> \\(\\binom{n}{r} = \\binom{n}{n-r}\\). (Choosing who is in = choosing who is out.)</li>
            <li><strong>Pascal's Rule:</strong> \\(\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}\\) for \\(n \\geq 1\\).</li>
            <li><strong>Row Sum:</strong> \\(\\displaystyle\\sum_{r=0}^{n} \\binom{n}{r} = 2^n\\). (Total number of subsets.)</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of Pascal's Rule</div>
    <div class="env-body">
        <p>Fix one element \\(x\\). Every \\(r\\)-subset either contains \\(x\\) or does not.</p>
        <ul>
            <li><strong>Contains \\(x\\):</strong> choose the remaining \\(r-1\\) from \\(n-1\\) elements: \\(\\binom{n-1}{r-1}\\) ways.</li>
            <li><strong>Does not contain \\(x\\):</strong> choose all \\(r\\) from the other \\(n-1\\): \\(\\binom{n-1}{r}\\) ways.</li>
        </ul>
        <p>These cases are disjoint and exhaustive, so \\(\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Poker Hands</div>
    <div class="env-body">
        <p>Total 5-card hands from 52: \\(\\binom{52}{5} = 2{,}598{,}960\\).</p>
        <p><strong>Full house</strong> (three of one rank + two of another): choose the triple's rank (13), suits for triple (\\(\\binom{4}{3} = 4\\)), the pair's rank from remaining 12, suits for pair (\\(\\binom{4}{2} = 6\\)):</p>
        \\[13 \\times 4 \\times 12 \\times 6 = 3{,}744.\\]
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-combinations"></div>
`,
            visualizations: [
                {
                    id: 'viz-combinations',
                    title: 'Combination Explorer',
                    description: 'See all ways to choose r items from n. Each highlighted group is one combination. Compare with P(n,r) to see the overcounting factor of r!.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 5;
                        var r = 3;
                        var highlightIdx = -1;
                        var items = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
                        var itemCols = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.red, viz.colors.yellow, viz.colors.pink];

                        VizEngine.createSlider(controls, 'n', 3, 8, n, 1, function(v) {
                            n = Math.round(v);
                            r = Math.min(r, n);
                            highlightIdx = -1;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'r', 1, 6, r, 1, function(v) {
                            r = Math.min(Math.round(v), n);
                            highlightIdx = -1;
                            draw();
                        });

                        function choose(nn, kk) {
                            if (kk < 0 || kk > nn) return 0;
                            var res = 1;
                            for (var i = 0; i < kk; i++) res = res * (nn - i) / (i + 1);
                            return Math.round(res);
                        }

                        function combinations(arr, size) {
                            if (size === 0) return [[]];
                            if (arr.length === 0) return [];
                            var first = arr[0], rest = arr.slice(1);
                            var withFirst = combinations(rest, size - 1).map(function(c) { return [first].concat(c); });
                            var withoutFirst = combinations(rest, size);
                            return withFirst.concat(withoutFirst);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            var combos = combinations(items.slice(0, n).map(function(_, i) { return i; }), r);
                            var cols = Math.min(Math.ceil(Math.sqrt(combos.length * 1.5)), 12);
                            var cellW = Math.min(60, (viz.width - 40) / cols);
                            var cellH = 24;
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 70;

                            for (var p = 0; p < combos.length; p++) {
                                var row = Math.floor(p / cols);
                                var col = p % cols;
                                var px = startX + col * cellW;
                                var py = startY + row * cellH;
                                if (mx >= px && mx <= px + cellW && my >= py - cellH / 2 && my <= py + cellH / 2) {
                                    highlightIdx = (highlightIdx === p) ? -1 : p;
                                    draw();
                                    return;
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var total = choose(n, r);
                            viz.screenText('C(' + n + ', ' + r + ') = ' + total + ' combinations', viz.width / 2, 22, viz.colors.white, 14);
                            viz.screenText('{' + items.slice(0, n).join(', ') + '}, choose ' + r, viz.width / 2, 44, viz.colors.teal, 12);

                            var arr = [];
                            for (var i = 0; i < n; i++) arr.push(i);
                            var combos = combinations(arr, r);

                            var cols = Math.min(Math.ceil(Math.sqrt(combos.length * 1.5)), 12);
                            var cellW = Math.min(60, (viz.width - 40) / cols);
                            var cellH = 24;
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 70;

                            for (var p = 0; p < combos.length; p++) {
                                var row = Math.floor(p / cols);
                                var col = p % cols;
                                var px = startX + col * cellW;
                                var py = startY + row * cellH;
                                if (py + cellH > viz.height - 60) break;

                                var isHL = p === highlightIdx;
                                if (isHL) {
                                    ctx.fillStyle = viz.colors.teal + '33';
                                    ctx.fillRect(px - 2, py - cellH / 2 + 2, cellW - 2, cellH - 2);
                                }

                                var label = '{' + combos[p].map(function(idx) { return items[idx]; }).join(',') + '}';
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillStyle = isHL ? viz.colors.white : viz.colors.text;
                                ctx.fillText(label, px, py);
                            }

                            // Info
                            var factorial = 1;
                            for (var f = 2; f <= r; f++) factorial *= f;
                            viz.screenText(
                                'P(' + n + ',' + r + ') = ' + (total * factorial) + '   \u00F7   ' + r + '! = ' + factorial + '   =   C(' + n + ',' + r + ') = ' + total,
                                viz.width / 2, viz.height - 30, viz.colors.orange, 12
                            );
                            viz.screenText('Click any combination to highlight it', viz.width / 2, viz.height - 10, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A class has 20 students, including 8 math majors. How many 5-person committees have at least 2 math majors?',
                    hint: 'Use complement counting: total committees minus those with 0 or 1 math major.',
                    solution: 'Total: \\(\\binom{20}{5} = 15{,}504\\). Zero math majors: \\(\\binom{12}{5} = 792\\). Exactly one: \\(\\binom{8}{1}\\binom{12}{4} = 8 \\times 495 = 3{,}960\\). At least two: \\(15{,}504 - 792 - 3{,}960 = 10{,}752\\).'
                },
                {
                    question: 'Prove combinatorially that \\(\\binom{n}{r} = \\binom{n}{n-r}\\).',
                    hint: 'Think about what "choosing who is in" says about "who is out."',
                    solution: 'Every \\(r\\)-element subset determines a unique \\((n-r)\\)-element complement. This is a bijection between \\(r\\)-subsets and \\((n-r)\\)-subsets, so \\(\\binom{n}{r} = \\binom{n}{n-r}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Pascal's Triangle & Binomial Theorem
        // ================================================================
        {
            id: 'sec-pascal',
            title: "Pascal's Triangle & Binomial Theorem",
            content: `
<h2>Pascal's Triangle and the Binomial Theorem</h2>

<div class="env-block intuition">
    <div class="env-title">Where Do Binomial Coefficients Get Their Name?</div>
    <div class="env-body">
        <p>Expand \\((x+y)^3 = (x+y)(x+y)(x+y)\\). Each term comes from choosing \\(x\\) or \\(y\\) from each factor. The term \\(x^2y\\) arises when we choose \\(x\\) from 2 factors and \\(y\\) from 1. How many ways? \\(\\binom{3}{1} = 3\\). These are <em>binomial</em> coefficients because they arise from expanding a binomial power.</p>
    </div>
</div>

<h3>Pascal's Triangle</h3>

<p>Arrange the binomial coefficients in a triangle: row \\(n\\) contains \\(\\binom{n}{0}, \\binom{n}{1}, \\ldots, \\binom{n}{n}\\). Pascal's rule (\\(\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}\\)) means each entry is the sum of the two entries directly above it.</p>

<div class="viz-placeholder" data-viz="viz-pascal-triangle"></div>

<h3>The Binomial Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.5 (Binomial Theorem)</div>
    <div class="env-body">
        <p>For any \\(x, y\\) and non-negative integer \\(n\\):</p>
        \\[(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Combinatorial)</div>
    <div class="env-body">
        <p>Write \\((x+y)^n\\) as a product of \\(n\\) factors. Expanding gives \\(2^n\\) terms, each formed by choosing \\(x\\) or \\(y\\) from each factor. A term \\(x^{n-k}y^k\\) arises by choosing \\(y\\) from exactly \\(k\\) of the \\(n\\) factors. The number of ways to choose those \\(k\\) factors is \\(\\binom{n}{k}\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Important Special Cases</h3>

<div class="env-block corollary">
    <div class="env-title">Corollary</div>
    <div class="env-body">
        <ol>
            <li>\\(x = y = 1\\): \\(2^n = \\sum_{k=0}^n \\binom{n}{k}\\). (Number of subsets of an \\(n\\)-set.)</li>
            <li>\\(x = 1, y = -1\\): \\(0 = \\sum_{k=0}^n (-1)^k\\binom{n}{k}\\) for \\(n \\geq 1\\). (Even-sized and odd-sized subsets are equally numerous.)</li>
        </ol>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-binomial"></div>
`,
            visualizations: [
                {
                    id: 'viz-pascal-triangle',
                    title: "Interactive Pascal's Triangle",
                    description: "Click any entry to highlight it and the two parent entries that sum to produce it. Row sums (shown at right) are always powers of 2.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 600, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var maxRows = 9;
                        var hlR = -1, hlK = -1;

                        VizEngine.createSlider(controls, 'Rows', 4, 14, maxRows, 1, function(v) {
                            maxRows = Math.round(v);
                            hlR = -1; hlK = -1;
                            draw();
                        });

                        function choose(nn, kk) {
                            if (kk < 0 || kk > nn) return 0;
                            var res = 1;
                            for (var i = 0; i < kk; i++) res = res * (nn - i) / (i + 1);
                            return Math.round(res);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var rowH = Math.min(34, (viz.height - 60) / maxRows);
                            var startY = 28;
                            var cellW = Math.min(48, (viz.width - 80) / (maxRows + 1));

                            for (var rr = 0; rr <= maxRows; rr++) {
                                var rowWidth = (rr + 1) * cellW;
                                var xStart = (viz.width - rowWidth) / 2;
                                var yy = startY + rr * rowH;
                                for (var kk = 0; kk <= rr; kk++) {
                                    var xx = xStart + kk * cellW + cellW / 2;
                                    if (Math.abs(mx - xx) < cellW / 2 && Math.abs(my - yy) < rowH / 2) {
                                        if (hlR === rr && hlK === kk) { hlR = -1; hlK = -1; }
                                        else { hlR = rr; hlK = kk; }
                                        draw();
                                        return;
                                    }
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var rowH = Math.min(34, (viz.height - 60) / maxRows);
                            var startY = 28;
                            var cellW = Math.min(48, (viz.width - 80) / (maxRows + 1));

                            for (var rr = 0; rr <= maxRows; rr++) {
                                var rowWidth = (rr + 1) * cellW;
                                var xStart = (viz.width - rowWidth) / 2;
                                var yy = startY + rr * rowH;
                                var rowSum = 0;

                                for (var kk = 0; kk <= rr; kk++) {
                                    var val = choose(rr, kk);
                                    rowSum += val;
                                    var xx = xStart + kk * cellW + cellW / 2;

                                    var isHL = (rr === hlR && kk === hlK);
                                    var isParent = (hlR > 0 && rr === hlR - 1 && (kk === hlK - 1 || kk === hlK));

                                    if (isHL) {
                                        ctx.fillStyle = viz.colors.teal + '44';
                                        ctx.beginPath(); ctx.arc(xx, yy, 16, 0, Math.PI * 2); ctx.fill();
                                    } else if (isParent) {
                                        ctx.fillStyle = viz.colors.blue + '44';
                                        ctx.beginPath(); ctx.arc(xx, yy, 16, 0, Math.PI * 2); ctx.fill();

                                        var childRowW = (hlR + 1) * cellW;
                                        var childXS = (viz.width - childRowW) / 2;
                                        var childXX = childXS + hlK * cellW + cellW / 2;
                                        var childYY = startY + hlR * rowH;
                                        ctx.strokeStyle = viz.colors.blue + '66'; ctx.lineWidth = 2;
                                        ctx.beginPath(); ctx.moveTo(xx, yy + 10); ctx.lineTo(childXX, childYY - 10); ctx.stroke();
                                    }

                                    var fontSize = val > 9999 ? 8 : (val > 999 ? 9 : (val > 99 ? 10 : 12));
                                    ctx.font = (isHL ? 'bold ' : '') + fontSize + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillStyle = isHL ? viz.colors.teal : isParent ? viz.colors.blue : viz.colors.white;
                                    ctx.fillText(val.toString(), xx, yy);
                                }

                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.fillStyle = viz.colors.text;
                                ctx.fillText('= ' + rowSum, xStart + rowWidth + 8, yy);

                                ctx.textAlign = 'right'; ctx.fillStyle = viz.colors.text;
                                ctx.fillText('n=' + rr, 30, yy);
                            }

                            if (hlR >= 0 && hlK >= 0) {
                                var info = 'C(' + hlR + ',' + hlK + ') = ' + choose(hlR, hlK);
                                if (hlR > 0) {
                                    info += '  =  C(' + (hlR - 1) + ',' + (hlK - 1) + ') + C(' + (hlR - 1) + ',' + hlK + ')';
                                    info += '  =  ' + choose(hlR - 1, hlK - 1) + ' + ' + choose(hlR - 1, hlK);
                                }
                                viz.screenText(info, viz.width / 2, viz.height - 12, viz.colors.teal, 12);
                            } else {
                                viz.screenText("Click any entry to see Pascal's rule", viz.width / 2, viz.height - 12, viz.colors.text, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-binomial',
                    title: 'Binomial Expansion Visualizer',
                    description: 'See the terms of \\((x+y)^n\\) as bars. The coefficients come from row n of Pascal\'s triangle. Adjust x, y, and n to see how the terms change.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nVal = 6;
                        var xVal = 1;
                        var yVal = 1;

                        VizEngine.createSlider(controls, 'n', 1, 12, nVal, 1, function(v) { nVal = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'x', -2, 2, xVal, 0.1, function(v) { xVal = v; draw(); });
                        VizEngine.createSlider(controls, 'y', -2, 2, yVal, 0.1, function(v) { yVal = v; draw(); });

                        function choose(nn, kk) {
                            if (kk < 0 || kk > nn) return 0;
                            var res = 1;
                            for (var i = 0; i < kk; i++) res = res * (nn - i) / (i + 1);
                            return Math.round(res);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var terms = [];
                            var maxAbs = 0, total = 0;
                            for (var k = 0; k <= nVal; k++) {
                                var coeff = choose(nVal, k);
                                var tVal = coeff * Math.pow(xVal, nVal - k) * Math.pow(yVal, k);
                                terms.push({ k: k, coeff: coeff, value: tVal });
                                maxAbs = Math.max(maxAbs, Math.abs(tVal));
                                total += tVal;
                            }
                            if (maxAbs < 1) maxAbs = 1;

                            viz.screenText('(' + xVal.toFixed(1) + ' + ' + yVal.toFixed(1) + ')^' + nVal + ' = ' + total.toFixed(2), viz.width / 2, 22, viz.colors.white, 14);

                            var chartL = 60, chartR = viz.width - 40;
                            var chartW = chartR - chartL;
                            var barW = Math.min(38, chartW / (nVal + 1) - 4);
                            var chartBot = viz.height - 60, chartTop = 50;
                            var zeroY = (chartBot + chartTop) / 2;
                            var halfH = (chartBot - chartTop) / 2;

                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartL, zeroY); ctx.lineTo(chartR, zeroY); ctx.stroke();

                            var barColors = [viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange,
                                viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink,
                                viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange, viz.colors.purple];

                            for (var i = 0; i < terms.length; i++) {
                                var t = terms[i];
                                var cx = chartL + (i + 0.5) * (chartW / (nVal + 1));
                                var barH = (t.value / maxAbs) * halfH;

                                ctx.fillStyle = barColors[i % barColors.length] + 'cc';
                                if (barH >= 0) {
                                    ctx.fillRect(cx - barW / 2, zeroY - barH, barW, barH);
                                } else {
                                    ctx.fillRect(cx - barW / 2, zeroY, barW, -barH);
                                }

                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.fillStyle = viz.colors.text;
                                ctx.textBaseline = barH >= 0 ? 'bottom' : 'top';
                                ctx.fillText(t.value.toFixed(1), cx, barH >= 0 ? zeroY - barH - 4 : zeroY - barH + 4);

                                ctx.textBaseline = 'top'; ctx.fillStyle = viz.colors.text;
                                ctx.fillText('k=' + t.k, cx, chartBot + 4);
                                ctx.fillText('C=' + t.coeff, cx, chartBot + 18);
                            }

                            viz.screenText('Term index k', viz.width / 2, viz.height - 8, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Expand \\((1 + x)^5\\) using the binomial theorem and verify that the coefficients sum to 32.',
                    hint: 'Apply the formula. Then plug in \\(x = 1\\) to check the sum.',
                    solution: '\\((1+x)^5 = 1 + 5x + 10x^2 + 10x^3 + 5x^4 + x^5\\). Setting \\(x = 1\\): \\(2^5 = 1 + 5 + 10 + 10 + 5 + 1 = 32\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Find the coefficient of \\(x^3 y^4\\) in \\((2x + 3y)^7\\).',
                    hint: 'The general term is \\(\\binom{7}{k}(2x)^{7-k}(3y)^k\\). Which \\(k\\) gives \\(y^4\\)?',
                    solution: '\\(k = 4\\): \\(\\binom{7}{4}(2x)^3(3y)^4 = 35 \\cdot 8x^3 \\cdot 81y^4 = 22{,}680\\, x^3 y^4\\). The coefficient is \\(22{,}680\\).'
                },
                {
                    question: 'Prove combinatorially that \\(\\sum_{k=0}^{n}(-1)^k \\binom{n}{k} = 0\\) for \\(n \\geq 1\\).',
                    hint: 'Find a bijection between even-sized and odd-sized subsets by toggling one fixed element.',
                    solution: 'Fix element 1. Map each subset \\(S\\): if \\(1 \\in S\\), remove it; if \\(1 \\notin S\\), add it. This pairs every even-sized subset with an odd-sized one, so the alternating sum is 0.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Which Formula? A Decision Framework',
            content: `
<h2>Which Formula? A Decision Framework</h2>

<div class="env-block intuition">
    <div class="env-title">Two Questions, Four Answers</div>
    <div class="env-body">
        <p>When selecting \\(r\\) items from \\(n\\), two binary questions determine the formula:</p>
        <ol>
            <li><strong>Does order matter?</strong> (Is "AB" different from "BA"?)</li>
            <li><strong>Is repetition allowed?</strong> (Can we pick the same item twice?)</li>
        </ol>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">The Four Counting Regimes</div>
    <div class="env-body">
        <table style="width:100%; border-collapse:collapse; margin:12px 0; font-size:0.9em;">
            <tr style="border-bottom:2px solid var(--border-default);">
                <th style="padding:8px; text-align:left;"></th>
                <th style="padding:8px; text-align:center;"><strong>Order Matters</strong></th>
                <th style="padding:8px; text-align:center;"><strong>Order Doesn't Matter</strong></th>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;"><strong>With Repetition</strong></td>
                <td style="padding:8px; text-align:center;">\\(n^r\\)</td>
                <td style="padding:8px; text-align:center;">\\(\\binom{n+r-1}{r}\\)</td>
            </tr>
            <tr>
                <td style="padding:8px;"><strong>Without Repetition</strong></td>
                <td style="padding:8px; text-align:center;">\\(P(n,r) = \\dfrac{n!}{(n-r)!}\\)</td>
                <td style="padding:8px; text-align:center;">\\(\\binom{n}{r}\\)</td>
            </tr>
        </table>
    </div>
</div>

<h3>Stars and Bars</h3>

<p>The upper-right entry, \\(\\binom{n+r-1}{r}\\), counts <strong>multisets</strong>: unordered selections with repetition. It also counts the non-negative integer solutions to \\(x_1 + x_2 + \\cdots + x_n = r\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.6 (Stars and Bars)</div>
    <div class="env-body">
        <p>The number of ways to distribute \\(r\\) identical objects into \\(n\\) distinct bins is</p>
        \\[\\binom{n + r - 1}{r} = \\binom{n + r - 1}{n - 1}.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Represent \\(r\\) objects as stars (\\(\\star\\)) and use \\(n-1\\) bars (|) to separate them into \\(n\\) bins. Any arrangement of \\(r\\) stars and \\(n-1\\) bars gives a valid distribution. We choose positions for the \\(n-1\\) bars among \\(r + n - 1\\) total symbols:</p>
        \\[\\binom{r + n - 1}{n - 1}.\\]
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Distributing Cookies</div>
    <div class="env-body">
        <p>Distribute 10 identical cookies among 4 children, each getting at least 1. Give each child 1 cookie first (uses 4), then freely distribute 6 among 4:</p>
        \\[\\binom{6 + 4 - 1}{4 - 1} = \\binom{9}{3} = 84.\\]
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-counting-decision"></div>

<h3>Summary: The Counting Toolkit</h3>

<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:0.92em;">
    <tr style="border-bottom:2px solid var(--border-default);">
        <th style="padding:8px; text-align:left;">Concept</th>
        <th style="padding:8px; text-align:center;">Formula</th>
        <th style="padding:8px; text-align:left;">Counts</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Factorial</td>
        <td style="padding:8px; text-align:center;">\\(n!\\)</td>
        <td style="padding:8px;">Arrangements of \\(n\\) distinct objects</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">\\(r\\)-Permutation</td>
        <td style="padding:8px; text-align:center;">\\(P(n,r) = n!/(n-r)!\\)</td>
        <td style="padding:8px;">Ordered selections of \\(r\\) from \\(n\\)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Combination</td>
        <td style="padding:8px; text-align:center;">\\(\\binom{n}{r} = n!/[r!(n-r)!]\\)</td>
        <td style="padding:8px;">Unordered selections of \\(r\\) from \\(n\\)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Multinomial</td>
        <td style="padding:8px; text-align:center;">\\(n!/(n_1! \\cdots n_k!)\\)</td>
        <td style="padding:8px;">Arrangements with repeated types</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Stars and Bars</td>
        <td style="padding:8px; text-align:center;">\\(\\binom{n+r-1}{r}\\)</td>
        <td style="padding:8px;">Multisets of size \\(r\\) from \\(n\\) types</td>
    </tr>
    <tr>
        <td style="padding:8px;">Binomial Theorem</td>
        <td style="padding:8px; text-align:center;">\\((x+y)^n = \\sum \\binom{n}{k} x^{n-k}y^k\\)</td>
        <td style="padding:8px;">Expansion of a binomial power</td>
    </tr>
</table>

<div class="env-block remark">
    <div class="env-title">Looking Ahead</div>
    <div class="env-body">
        <p>These basic tools handle a large fraction of counting problems, but not all. In <strong>Chapter 7</strong>, we develop the pigeonhole principle and inclusion-exclusion, which handle overcounting and existence arguments. <strong>Chapter 8</strong> introduces recurrence relations for counts that satisfy recursive structure. <strong>Chapter 9</strong> brings generating functions, which encode entire counting sequences in a single algebraic object.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-counting-decision',
                    title: 'Counting Decision Tree',
                    description: 'Follow the decision tree to determine which counting formula applies. Answer two questions: does order matter? Is repetition allowed? The tree leads you to the correct formula and computes the answer.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 5, r = 3;
                        var orderMatters = -1; // -1=unset, 0=no, 1=yes
                        var repAllowed = -1;

                        VizEngine.createSlider(controls, 'n', 2, 10, n, 1, function(v) { n = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'r', 1, 8, r, 1, function(v) { r = Math.round(v); draw(); });
                        VizEngine.createButton(controls, 'Reset choices', function() {
                            orderMatters = -1; repAllowed = -1; draw();
                        });

                        function factorial(m) { var res = 1; for (var i = 2; i <= m; i++) res *= i; return res; }
                        function choose(nn, kk) {
                            if (kk < 0 || kk > nn) return 0;
                            var res = 1;
                            for (var i = 0; i < kk; i++) res = res * (nn - i) / (i + 1);
                            return Math.round(res);
                        }

                        // Clickable regions
                        var buttons = [];

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            for (var i = 0; i < buttons.length; i++) {
                                var b = buttons[i];
                                if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
                                    b.action();
                                    draw();
                                    return;
                                }
                            }
                        });

                        function drawBtn(ctx, x, y, w, h, text, color, active) {
                            ctx.fillStyle = active ? color + '55' : color + '22';
                            ctx.strokeStyle = color;
                            ctx.lineWidth = active ? 2.5 : 1.5;
                            ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill(); ctx.stroke();
                            ctx.fillStyle = active ? viz.colors.white : color;
                            ctx.font = (active ? 'bold ' : '') + '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(text, x + w / 2, y + h / 2);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            buttons = [];

                            viz.screenText('Counting Decision Tree', viz.width / 2, 20, viz.colors.white, 16);
                            viz.screenText('n = ' + n + ', r = ' + r, viz.width / 2, 42, viz.colors.text, 12);

                            // Question 1: Order?
                            var q1X = viz.width / 2 - 80, q1Y = 65;
                            ctx.fillStyle = viz.colors.purple + '22';
                            ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.roundRect(q1X, q1Y, 160, 30, 6); ctx.fill(); ctx.stroke();
                            ctx.fillStyle = viz.colors.purple; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('Does order matter?', q1X + 80, q1Y + 15);

                            // Yes / No buttons for order
                            var yesOX = viz.width / 2 - 140, noOX = viz.width / 2 + 60;
                            var btnY1 = 110;
                            drawBtn(ctx, yesOX, btnY1, 80, 28, 'Yes', viz.colors.blue, orderMatters === 1);
                            drawBtn(ctx, noOX, btnY1, 80, 28, 'No', viz.colors.teal, orderMatters === 0);
                            buttons.push({ x: yesOX, y: btnY1, w: 80, h: 28, action: function() { orderMatters = 1; repAllowed = -1; } });
                            buttons.push({ x: noOX, y: btnY1, w: 80, h: 28, action: function() { orderMatters = 0; repAllowed = -1; } });

                            // Lines from question to buttons
                            ctx.strokeStyle = viz.colors.text + '44'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(q1X + 40, q1Y + 30); ctx.lineTo(yesOX + 40, btnY1); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(q1X + 120, q1Y + 30); ctx.lineTo(noOX + 40, btnY1); ctx.stroke();

                            if (orderMatters >= 0) {
                                // Question 2: Replacement?
                                var q2X = (orderMatters === 1 ? yesOX : noOX) - 10;
                                var q2Y = 160;
                                ctx.fillStyle = viz.colors.orange + '22';
                                ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.roundRect(q2X, q2Y, 100, 28, 6); ctx.fill(); ctx.stroke();
                                ctx.fillStyle = viz.colors.orange; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText('Repetition?', q2X + 50, q2Y + 14);

                                ctx.strokeStyle = viz.colors.text + '44'; ctx.lineWidth = 1;
                                var fromX = (orderMatters === 1 ? yesOX : noOX) + 40;
                                ctx.beginPath(); ctx.moveTo(fromX, btnY1 + 28); ctx.lineTo(q2X + 50, q2Y); ctx.stroke();

                                var yesRX = q2X - 30, noRX = q2X + 60;
                                var btnY2 = 205;
                                drawBtn(ctx, yesRX, btnY2, 60, 26, 'Yes', viz.colors.green, repAllowed === 1);
                                drawBtn(ctx, noRX, btnY2, 60, 26, 'No', viz.colors.red, repAllowed === 0);
                                buttons.push({ x: yesRX, y: btnY2, w: 60, h: 26, action: function() { repAllowed = 1; } });
                                buttons.push({ x: noRX, y: btnY2, w: 60, h: 26, action: function() { repAllowed = 0; } });

                                ctx.strokeStyle = viz.colors.text + '44'; ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(q2X + 25, q2Y + 28); ctx.lineTo(yesRX + 30, btnY2); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(q2X + 75, q2Y + 28); ctx.lineTo(noRX + 30, btnY2); ctx.stroke();

                                if (repAllowed >= 0) {
                                    // Result box
                                    var resultY = 260;
                                    var formula = '', value = 0, name = '';

                                    if (orderMatters === 1 && repAllowed === 1) {
                                        name = 'Sequences with repetition';
                                        formula = n + '^' + r;
                                        value = Math.pow(n, r);
                                    } else if (orderMatters === 1 && repAllowed === 0) {
                                        name = 'r-Permutations';
                                        formula = 'P(' + n + ',' + r + ') = ' + n + '!/(' + n + '-' + r + ')!';
                                        value = (r <= n) ? factorial(n) / factorial(n - r) : 0;
                                    } else if (orderMatters === 0 && repAllowed === 1) {
                                        name = 'Multisets (Stars & Bars)';
                                        formula = 'C(' + n + '+' + r + '-1, ' + r + ')';
                                        value = choose(n + r - 1, r);
                                    } else {
                                        name = 'Combinations';
                                        formula = 'C(' + n + ',' + r + ')';
                                        value = choose(n, r);
                                    }

                                    var resX = viz.width / 2 - 130, resW = 260, resH = 100;
                                    var col = viz.colors.white;
                                    ctx.fillStyle = '#1a1a40';
                                    ctx.strokeStyle = col; ctx.lineWidth = 2;
                                    ctx.beginPath(); ctx.roundRect(resX, resultY, resW, resH, 8); ctx.fill(); ctx.stroke();

                                    viz.screenText(name, viz.width / 2, resultY + 20, viz.colors.teal, 14);
                                    viz.screenText(formula, viz.width / 2, resultY + 48, viz.colors.orange, 13);
                                    viz.screenText('= ' + (value > 999999 ? value.toExponential(3) : value.toLocaleString()), viz.width / 2, resultY + 74, viz.colors.white, 20);

                                    // Arrow from button to result
                                    var fromBtn = repAllowed === 1 ? yesRX + 30 : noRX + 30;
                                    ctx.strokeStyle = viz.colors.white + '44'; ctx.lineWidth = 1;
                                    ctx.beginPath(); ctx.moveTo(fromBtn, btnY2 + 26); ctx.lineTo(viz.width / 2, resultY); ctx.stroke();
                                }
                            }

                            viz.screenText('Click the buttons to follow the decision tree', viz.width / 2, viz.height - 12, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Classify each into one of the four regimes and solve: (a) 3-letter "words" from 26 letters. (b) Choose a 3-person committee from 26 people. (c) Award gold, silver, bronze to 3 of 26 runners. (d) Choose 3 donuts from 26 varieties (repeats ok).',
                    hint: 'For each, ask: order? repetition?',
                    solution: '(a) Ordered, with repetition: \\(26^3 = 17{,}576\\). (b) Unordered, without: \\(\\binom{26}{3} = 2{,}600\\). (c) Ordered, without: \\(P(26,3) = 15{,}600\\). (d) Unordered, with: \\(\\binom{28}{3} = 3{,}276\\).'
                },
                {
                    question: 'How many non-negative integer solutions does \\(x_1 + x_2 + x_3 + x_4 = 12\\) have?',
                    hint: 'Stars and bars with \\(n = 4\\) bins, \\(r = 12\\) objects.',
                    solution: '\\(\\binom{12 + 4 - 1}{4 - 1} = \\binom{15}{3} = 455\\).'
                },
                {
                    question: 'How many ways can 7 identical apples be distributed among 3 children if each must get at least 2?',
                    hint: 'Give each child 2 first, then distribute the remaining 1.',
                    solution: 'After giving 2 each, distribute \\(7 - 6 = 1\\) apple among 3 children: \\(\\binom{1 + 3 - 1}{1} = \\binom{3}{1} = 3\\).'
                }
            ]
        }
    ]
});
