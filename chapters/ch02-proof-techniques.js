window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch02',
    number: 2,
    title: 'Proof Techniques',
    subtitle: 'How to prove things',
    sections: [
        // ================================================================
        // SECTION 1: Why We Need Proofs
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why We Need Proofs',
            content: `
<h2>Why We Need Proofs</h2>

<div class="env-block intuition">
    <div class="env-title">A Dangerous Pattern</div>
    <div class="env-body">
        <p>Consider the formula \\(n^2 - n + 41\\). Plug in \\(n = 0, 1, 2, \\ldots, 40\\) and you get 41, 41, 43, 47, 53, 61, ... all prime numbers. Forty-one consecutive primes! Surely the formula always produces primes?</p>
        <p>At \\(n = 41\\): \\(41^2 - 41 + 41 = 41^2\\), which is not prime. A pattern that holds for 41 cases fails on the 42nd. No number of examples can replace a proof.</p>
    </div>
</div>

<p>Mathematics is built on <strong>proof</strong>: a logical argument that establishes the truth of a statement beyond all doubt. Unlike the sciences, where theories are supported by evidence and subject to revision, a mathematical proof, once verified, stands forever.</p>

<p>But what exactly counts as a proof? Informally, a proof is a sequence of logical steps, each following from axioms, definitions, or previously established results, that leads inevitably to the conclusion. The standard of correctness is that any competent reader, following the argument step by step, must be convinced.</p>

<h3>Statements and Their Structure</h3>

<p>Most mathematical theorems take one of these forms:</p>
<ul>
    <li><strong>Universal:</strong> "For all \\(x\\) with property \\(P\\), \\(Q(x)\\) holds." (\\(\\forall x, P(x) \\Rightarrow Q(x)\\))</li>
    <li><strong>Existential:</strong> "There exists an \\(x\\) with property \\(P\\)." (\\(\\exists x, P(x)\\))</li>
    <li><strong>Conditional:</strong> "If \\(P\\), then \\(Q\\)." (\\(P \\Rightarrow Q\\))</li>
    <li><strong>Biconditional:</strong> "\\(P\\) if and only if \\(Q\\)." (\\(P \\Leftrightarrow Q\\))</li>
</ul>

<p>The structure of the statement often dictates the proof technique. A conditional \\(P \\Rightarrow Q\\) invites a direct proof (assume \\(P\\), derive \\(Q\\)) or a contrapositive proof (assume \\(\\neg Q\\), derive \\(\\neg P\\)). An existential statement requires producing a witness. A universal statement requires an argument that works for every instance.</p>

<h3>The Proof Toolbox</h3>

<p>This chapter covers the main proof strategies:</p>
<ol>
    <li><strong>Direct proof:</strong> Assume the hypothesis, derive the conclusion.</li>
    <li><strong>Proof by contrapositive:</strong> Prove \\(\\neg Q \\Rightarrow \\neg P\\) instead of \\(P \\Rightarrow Q\\).</li>
    <li><strong>Proof by contradiction:</strong> Assume the negation of what you want to prove, derive a contradiction.</li>
    <li><strong>Proof by cases:</strong> Break into exhaustive cases, prove each one.</li>
    <li><strong>Mathematical induction:</strong> Prove a base case, then prove the inductive step.</li>
</ol>

<p>Each technique is a different angle of attack. The art of proof is choosing the right one.</p>

<div class="env-block remark">
    <div class="env-title">A Word on Style</div>
    <div class="env-body">
        <p>A good proof is not just correct but <em>clear</em>. State what you are about to prove. Say which technique you are using. Label your assumptions. End with a clear conclusion. The reader should never wonder "where is this going?"</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-proof-flowchart',
                    title: 'Proof Type Flowchart',
                    description: 'Click on a proof type to see its logical structure as a flowchart. Each type shows the sequence of steps from assumption to conclusion.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var selected = 0;
                        var types = [
                            {
                                name: 'Direct Proof',
                                color: viz.colors.blue,
                                steps: ['Assume P is true', 'Apply definitions/theorems', 'Derive intermediate results', 'Conclude Q is true'],
                                summary: 'P => Q: start from P, arrive at Q'
                            },
                            {
                                name: 'Contrapositive',
                                color: viz.colors.teal,
                                steps: ['Assume ~Q is true', 'Apply definitions/theorems', 'Derive intermediate results', 'Conclude ~P is true'],
                                summary: '~Q => ~P is equivalent to P => Q'
                            },
                            {
                                name: 'Contradiction',
                                color: viz.colors.orange,
                                steps: ['Assume the negation', 'Reason logically from assumption', 'Derive a contradiction (R and ~R)', 'Original statement must be true'],
                                summary: 'Assume ~S, derive impossibility'
                            },
                            {
                                name: 'Cases',
                                color: viz.colors.purple,
                                steps: ['Identify exhaustive cases', 'Prove Case 1', 'Prove Case 2', '... Prove Case k', 'All cases covered => done'],
                                summary: 'Split into disjoint cases, prove each'
                            },
                            {
                                name: 'Induction',
                                color: viz.colors.green,
                                steps: ['Prove base case P(1)', 'Assume P(k) [inductive hypothesis]', 'Prove P(k) => P(k+1)', 'Conclude: P(n) for all n >= 1'],
                                summary: 'Base case + inductive step = all n'
                            }
                        ];

                        // Create buttons for each proof type
                        types.forEach(function(t, i) {
                            var btn = VizEngine.createButton(controls, t.name, function() {
                                selected = i;
                                draw();
                            });
                            btn.style.borderColor = t.color;
                            btn.style.color = t.color;
                            btn.style.marginRight = '6px';
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var t = types[selected];

                            // Title
                            viz.screenText(t.name, viz.width / 2, 28, t.color, 18);
                            viz.screenText(t.summary, viz.width / 2, 52, viz.colors.text, 12);

                            // Draw flowchart boxes
                            var boxW = 300;
                            var boxH = 40;
                            var gap = 18;
                            var startY = 80;
                            var cx = viz.width / 2;

                            for (var i = 0; i < t.steps.length; i++) {
                                var y = startY + i * (boxH + gap);

                                // Arrow from previous box
                                if (i > 0) {
                                    var arrowY = y - gap;
                                    ctx.strokeStyle = t.color + '88';
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(cx, arrowY - boxH + gap - 2);
                                    ctx.lineTo(cx, y - 2);
                                    ctx.stroke();
                                    // Arrowhead
                                    ctx.fillStyle = t.color + '88';
                                    ctx.beginPath();
                                    ctx.moveTo(cx, y);
                                    ctx.lineTo(cx - 6, y - 10);
                                    ctx.lineTo(cx + 6, y - 10);
                                    ctx.closePath();
                                    ctx.fill();
                                }

                                // Box
                                var isFirst = (i === 0);
                                var isLast = (i === t.steps.length - 1);
                                var radius = 8;

                                ctx.fillStyle = isFirst ? t.color + '33' : (isLast ? t.color + '44' : '#1a1a40');
                                ctx.strokeStyle = isFirst || isLast ? t.color : t.color + '88';
                                ctx.lineWidth = isFirst || isLast ? 2 : 1.5;

                                // Rounded rect
                                var rx = cx - boxW / 2;
                                ctx.beginPath();
                                ctx.moveTo(rx + radius, y);
                                ctx.lineTo(rx + boxW - radius, y);
                                ctx.quadraticCurveTo(rx + boxW, y, rx + boxW, y + radius);
                                ctx.lineTo(rx + boxW, y + boxH - radius);
                                ctx.quadraticCurveTo(rx + boxW, y + boxH, rx + boxW - radius, y + boxH);
                                ctx.lineTo(rx + radius, y + boxH);
                                ctx.quadraticCurveTo(rx, y + boxH, rx, y + boxH - radius);
                                ctx.lineTo(rx, y + radius);
                                ctx.quadraticCurveTo(rx, y, rx + radius, y);
                                ctx.closePath();
                                ctx.fill();
                                ctx.stroke();

                                // Step number + text
                                ctx.fillStyle = isFirst || isLast ? viz.colors.white : viz.colors.text;
                                ctx.font = (isFirst || isLast ? 'bold ' : '') + '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('Step ' + (i + 1) + ': ' + t.steps[i], cx, y + boxH / 2);
                            }

                            // Highlight label
                            var labelY = startY + t.steps.length * (boxH + gap) + 10;
                            if (selected === 0) {
                                viz.screenText('Logic: P is true, chain of implications, therefore Q', cx, labelY, viz.colors.text, 11);
                            } else if (selected === 1) {
                                viz.screenText('Equivalence: (P => Q) <=> (~Q => ~P) by contrapositive law', cx, labelY, viz.colors.text, 11);
                            } else if (selected === 2) {
                                viz.screenText('If assuming ~S leads to impossibility, then S must be true', cx, labelY, viz.colors.text, 11);
                            } else if (selected === 3) {
                                viz.screenText('The cases must be exhaustive and cover every possibility', cx, labelY, viz.colors.text, 11);
                            } else if (selected === 4) {
                                viz.screenText('Like climbing a ladder: if you can reach rung 1 and each rung leads to the next...', cx, labelY, viz.colors.text, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The formula \\(n^2 - n + 41\\) produces primes for \\(n = 0, 1, \\ldots, 40\\). Verify that it fails at \\(n = 41\\) and at \\(n = 42\\). What does this teach about the relationship between examples and proofs?',
                    hint: 'Compute \\(41^2 - 41 + 41\\) and \\(42^2 - 42 + 41\\). Factor each result.',
                    solution: 'At \\(n = 41\\): \\(41^2 - 41 + 41 = 41^2 = 1681\\), which has factor 41. At \\(n = 42\\): \\(42^2 - 42 + 41 = 1764 - 42 + 41 = 1763 = 41 \\times 43\\). No finite collection of examples constitutes a proof of a universal statement; a single counterexample suffices to disprove one.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Direct Proof
        // ================================================================
        {
            id: 'sec-direct',
            title: 'Direct Proof',
            content: `
<h2>Direct Proof</h2>

<div class="env-block intuition">
    <div class="env-title">The Most Natural Strategy</div>
    <div class="env-body">
        <p>To prove "if \\(P\\), then \\(Q\\)," the most straightforward approach is: <em>assume \\(P\\) is true, and through a chain of logical deductions, arrive at \\(Q\\).</em> Each step must follow from definitions, axioms, or previously proven results. This is the <strong>direct proof</strong>.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Even and Odd Integers)</div>
    <div class="env-body">
        <p>An integer \\(n\\) is <strong>even</strong> if \\(n = 2k\\) for some integer \\(k\\). An integer \\(n\\) is <strong>odd</strong> if \\(n = 2k + 1\\) for some integer \\(k\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.1</div>
    <div class="env-body">
        <p>If \\(n\\) is even, then \\(n^2\\) is even.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Direct)</div>
    <div class="env-body">
        <p>Assume \\(n\\) is even. Then \\(n = 2k\\) for some integer \\(k\\). Therefore:</p>
        \\[n^2 = (2k)^2 = 4k^2 = 2(2k^2).\\]
        <p>Since \\(2k^2\\) is an integer, \\(n^2 = 2m\\) where \\(m = 2k^2\\), so \\(n^2\\) is even.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>Notice the structure: we (1) assumed the hypothesis, (2) unpacked the definition, (3) performed algebra, and (4) matched the result to the definition of the conclusion. This is the template for most direct proofs.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.2</div>
    <div class="env-body">
        <p>The sum of two even integers is even.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Let \\(m\\) and \\(n\\) be even. Then \\(m = 2a\\) and \\(n = 2b\\) for integers \\(a\\) and \\(b\\). So \\(m + n = 2a + 2b = 2(a + b)\\). Since \\(a + b\\) is an integer, \\(m + n\\) is even.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.3</div>
    <div class="env-body">
        <p>The product of two odd integers is odd.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Let \\(m = 2a + 1\\) and \\(n = 2b + 1\\) be odd integers. Then:</p>
        \\[mn = (2a+1)(2b+1) = 4ab + 2a + 2b + 1 = 2(2ab + a + b) + 1.\\]
        <p>Since \\(2ab + a + b\\) is an integer, \\(mn\\) is odd.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Proving Divisibility Statements</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Divisibility)</div>
    <div class="env-body">
        <p>An integer \\(a\\) <strong>divides</strong> \\(b\\) (written \\(a \\mid b\\)) if \\(b = ak\\) for some integer \\(k\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.4 (Transitivity of Divisibility)</div>
    <div class="env-body">
        <p>If \\(a \\mid b\\) and \\(b \\mid c\\), then \\(a \\mid c\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Since \\(a \\mid b\\), we have \\(b = ak\\) for some integer \\(k\\). Since \\(b \\mid c\\), we have \\(c = bj\\) for some integer \\(j\\). Substituting: \\(c = bj = (ak)j = a(kj)\\). Since \\(kj\\) is an integer, \\(a \\mid c\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="viz-placeholder" data-viz="viz-direct-proof"></div>
`,
            visualizations: [
                {
                    id: 'viz-direct-proof',
                    title: 'Step-by-Step Direct Proof Animation',
                    description: 'Watch a direct proof unfold step by step: "If n is even, then n^2 is even." Click Next to advance through the logical chain.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var step = 0;
                        var maxStep = 5;
                        var steps = [
                            { label: 'Goal', text: 'Prove: If n is even, then n\u00B2 is even.', color: viz.colors.white },
                            { label: 'Assume', text: 'Assume n is even.', color: viz.colors.blue },
                            { label: 'Unpack', text: 'By definition, n = 2k for some integer k.', color: viz.colors.teal },
                            { label: 'Compute', text: 'n\u00B2 = (2k)\u00B2 = 4k\u00B2 = 2(2k\u00B2).', color: viz.colors.orange },
                            { label: 'Identify', text: 'Let m = 2k\u00B2. Then m is an integer and n\u00B2 = 2m.', color: viz.colors.purple },
                            { label: 'Conclude', text: 'By definition of even, n\u00B2 is even. QED', color: viz.colors.green }
                        ];

                        VizEngine.createButton(controls, 'Previous', function() {
                            if (step > 0) { step--; draw(); }
                        });
                        VizEngine.createButton(controls, 'Next', function() {
                            if (step < maxStep) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Direct Proof: "If n is even, then n\u00B2 is even"', viz.width / 2, 22, viz.colors.white, 15);

                            var boxW = 440;
                            var boxH = 44;
                            var gap = 12;
                            var startY = 55;
                            var cx = viz.width / 2;

                            for (var i = 0; i <= maxStep; i++) {
                                var y = startY + i * (boxH + gap);
                                var s = steps[i];
                                var active = (i <= step);
                                var current = (i === step);

                                // Arrow
                                if (i > 0 && active) {
                                    ctx.strokeStyle = s.color + '66';
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(cx, y - gap + 2);
                                    ctx.lineTo(cx, y - 2);
                                    ctx.stroke();
                                    ctx.fillStyle = s.color + '66';
                                    ctx.beginPath();
                                    ctx.moveTo(cx, y);
                                    ctx.lineTo(cx - 5, y - 8);
                                    ctx.lineTo(cx + 5, y - 8);
                                    ctx.closePath();
                                    ctx.fill();
                                }

                                // Box
                                var rx = cx - boxW / 2;
                                ctx.fillStyle = active ? (current ? s.color + '33' : '#1a1a3088') : '#0c0c20';
                                ctx.strokeStyle = active ? s.color : '#1a1a40';
                                ctx.lineWidth = current ? 2.5 : 1;
                                ctx.beginPath();
                                ctx.moveTo(rx + 6, y); ctx.lineTo(rx + boxW - 6, y);
                                ctx.quadraticCurveTo(rx + boxW, y, rx + boxW, y + 6);
                                ctx.lineTo(rx + boxW, y + boxH - 6);
                                ctx.quadraticCurveTo(rx + boxW, y + boxH, rx + boxW - 6, y + boxH);
                                ctx.lineTo(rx + 6, y + boxH);
                                ctx.quadraticCurveTo(rx, y + boxH, rx, y + boxH - 6);
                                ctx.lineTo(rx, y + 6);
                                ctx.quadraticCurveTo(rx, y, rx + 6, y);
                                ctx.closePath();
                                ctx.fill(); ctx.stroke();

                                // Label badge
                                if (active) {
                                    ctx.fillStyle = s.color;
                                    ctx.font = 'bold 10px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(s.label.toUpperCase(), rx + 12, y + boxH / 2 - 8);
                                }

                                // Text
                                ctx.fillStyle = active ? viz.colors.white : viz.colors.text + '44';
                                ctx.font = (current ? 'bold ' : '') + '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(active ? s.text : '...', cx, y + boxH / 2 + (active ? 6 : 0));
                            }

                            // Progress indicator
                            viz.screenText('Step ' + (step + 1) + ' of ' + (maxStep + 1), viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove directly: if \\(n\\) is odd, then \\(n^2\\) is odd.',
                    hint: 'Write \\(n = 2k + 1\\), compute \\(n^2\\), and show it has the form \\(2m + 1\\).',
                    solution: 'Let \\(n = 2k + 1\\). Then \\(n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\\). Since \\(2k^2 + 2k\\) is an integer, \\(n^2\\) is odd.'
                },
                {
                    question: 'Prove directly: if \\(a \\mid b\\) and \\(a \\mid c\\), then \\(a \\mid (b + c)\\).',
                    hint: 'Write \\(b = ak_1\\) and \\(c = ak_2\\), then add.',
                    solution: 'Since \\(a \\mid b\\), we have \\(b = ak_1\\). Since \\(a \\mid c\\), we have \\(c = ak_2\\). Then \\(b + c = ak_1 + ak_2 = a(k_1 + k_2)\\). Since \\(k_1 + k_2\\) is an integer, \\(a \\mid (b+c)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Proof by Contrapositive
        // ================================================================
        {
            id: 'sec-contrapositive',
            title: 'Proof by Contrapositive',
            content: `
<h2>Proof by Contrapositive</h2>

<div class="env-block intuition">
    <div class="env-title">Turning the Statement Around</div>
    <div class="env-body">
        <p>The statement "if it is raining, then the ground is wet" is logically equivalent to "if the ground is not wet, then it is not raining." Sometimes proving the second form is easier than proving the first. This is the <strong>contrapositive</strong> technique.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Logical Equivalence</div>
    <div class="env-body">
        <p>A conditional \\(P \\Rightarrow Q\\) is logically equivalent to its contrapositive \\(\\neg Q \\Rightarrow \\neg P\\).</p>
        <p>This can be verified by truth table: both are false only when \\(P\\) is true and \\(Q\\) is false.</p>
    </div>
</div>

<p>The contrapositive is especially useful when the conclusion \\(Q\\) is hard to work toward, but its negation \\(\\neg Q\\) gives a concrete starting assumption.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.5</div>
    <div class="env-body">
        <p>If \\(n^2\\) is even, then \\(n\\) is even.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Contrapositive)</div>
    <div class="env-body">
        <p>We prove the contrapositive: if \\(n\\) is not even (i.e., \\(n\\) is odd), then \\(n^2\\) is not even (i.e., \\(n^2\\) is odd).</p>
        <p>Let \\(n\\) be odd. Then \\(n = 2k + 1\\) for some integer \\(k\\). So:</p>
        \\[n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1.\\]
        <p>Since \\(2k^2 + 2k\\) is an integer, \\(n^2\\) is odd. This completes the contrapositive proof.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">Why Not Direct?</div>
    <div class="env-body">
        <p>A direct proof of Theorem 2.5 would assume \\(n^2\\) is even and try to show \\(n\\) is even. But \\(n^2 = 2m\\) does not immediately tell us anything about \\(n\\) itself (taking square roots of general integers is messy). The contrapositive gives us \\(n\\) is odd as a starting point, which is much more concrete to work with.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.6</div>
    <div class="env-body">
        <p>If \\(n^2\\) is divisible by 3, then \\(n\\) is divisible by 3.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Contrapositive)</div>
    <div class="env-body">
        <p>Contrapositive: if \\(3 \\nmid n\\), then \\(3 \\nmid n^2\\). If \\(n\\) is not divisible by 3, then \\(n = 3q + r\\) where \\(r \\in \\{1, 2\\}\\).</p>
        <ul>
            <li>If \\(r = 1\\): \\(n^2 = 9q^2 + 6q + 1 = 3(3q^2 + 2q) + 1\\), so \\(3 \\nmid n^2\\).</li>
            <li>If \\(r = 2\\): \\(n^2 = 9q^2 + 12q + 4 = 3(3q^2 + 4q + 1) + 1\\), so \\(3 \\nmid n^2\\).</li>
        </ul>
        <p>In both cases \\(n^2\\) leaves remainder 1 when divided by 3, hence \\(3 \\nmid n^2\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>When to Use Contrapositive</h3>

<p>Consider the contrapositive when:</p>
<ul>
    <li>The conclusion \\(Q\\) is an "existence" or "is" statement that is hard to decompose directly.</li>
    <li>The negation \\(\\neg Q\\) gives you a more concrete algebraic form to work with.</li>
    <li>The hypothesis \\(P\\) involves a condition on a composite expression (like \\(n^2\\)).</li>
</ul>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Prove by contrapositive: if \\(n^3\\) is odd, then \\(n\\) is odd.',
                    hint: 'The contrapositive is: if \\(n\\) is even, then \\(n^3\\) is even.',
                    solution: 'Contrapositive: if \\(n\\) is even, then \\(n^3\\) is even. Let \\(n = 2k\\). Then \\(n^3 = 8k^3 = 2(4k^3)\\). Since \\(4k^3\\) is an integer, \\(n^3\\) is even.'
                },
                {
                    question: 'Prove by contrapositive: for integers \\(a\\) and \\(b\\), if \\(ab\\) is even, then \\(a\\) is even or \\(b\\) is even.',
                    hint: 'The contrapositive is: if \\(a\\) is odd AND \\(b\\) is odd, then \\(ab\\) is odd. (The negation of "A or B" is "not A and not B.")',
                    solution: 'Contrapositive: if \\(a\\) is odd and \\(b\\) is odd, then \\(ab\\) is odd. Let \\(a = 2j+1\\) and \\(b = 2k+1\\). Then \\(ab = 4jk + 2j + 2k + 1 = 2(2jk + j + k) + 1\\), which is odd.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Proof by Contradiction
        // ================================================================
        {
            id: 'sec-contradiction',
            title: 'Proof by Contradiction',
            content: `
<h2>Proof by Contradiction</h2>

<div class="env-block intuition">
    <div class="env-title">Reductio ad Absurdum</div>
    <div class="env-body">
        <p>Suppose you want to prove a statement \\(S\\). Assume \\(S\\) is false, i.e., assume \\(\\neg S\\). If this assumption leads to a logical impossibility (a contradiction), then \\(\\neg S\\) cannot be true, so \\(S\\) must be true.</p>
        <p>This is one of the most powerful techniques in mathematics. It lets you prove statements that seem impossible to approach directly.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Principle of Proof by Contradiction</div>
    <div class="env-body">
        <p>To prove \\(S\\): assume \\(\\neg S\\), and derive a statement of the form \\(R \\wedge \\neg R\\) (a proposition that is both true and false). Since this is impossible, \\(\\neg S\\) must be false, so \\(S\\) is true.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.7</div>
    <div class="env-body">
        <p>\\(\\sqrt{2}\\) is irrational.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (by Contradiction)</div>
    <div class="env-body">
        <p>Assume for contradiction that \\(\\sqrt{2}\\) is rational. Then \\(\\sqrt{2} = p/q\\) for integers \\(p, q\\) with \\(q \\neq 0\\) and \\(\\gcd(p, q) = 1\\) (the fraction is in lowest terms).</p>
        <p>Squaring both sides: \\(2 = p^2/q^2\\), so \\(p^2 = 2q^2\\). This means \\(p^2\\) is even, so by Theorem 2.5, \\(p\\) is even. Write \\(p = 2m\\).</p>
        <p>Then \\((2m)^2 = 2q^2\\), giving \\(4m^2 = 2q^2\\), so \\(q^2 = 2m^2\\). This means \\(q^2\\) is even, so \\(q\\) is even.</p>
        <p>But now both \\(p\\) and \\(q\\) are even, contradicting \\(\\gcd(p, q) = 1\\). The assumption that \\(\\sqrt{2}\\) is rational must be false.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.8</div>
    <div class="env-body">
        <p>There are infinitely many prime numbers.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Euclid, by Contradiction)</div>
    <div class="env-body">
        <p>Assume for contradiction that there are only finitely many primes: \\(p_1, p_2, \\ldots, p_n\\). Consider the number</p>
        \\[N = p_1 \\cdot p_2 \\cdots p_n + 1.\\]
        <p>Since \\(N > 1\\), it has a prime factor \\(p\\). But for each \\(p_i\\), dividing \\(N\\) by \\(p_i\\) gives remainder 1, so \\(p \\neq p_i\\) for any \\(i\\). This contradicts the assumption that \\(p_1, \\ldots, p_n\\) are all the primes.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Contradiction vs. Contrapositive</h3>

<p>For a conditional \\(P \\Rightarrow Q\\), proof by contradiction assumes \\(P \\wedge \\neg Q\\) and derives a contradiction. The contrapositive assumes \\(\\neg Q\\) and derives \\(\\neg P\\). The difference is subtle: the contrapositive is more structured (you know what you're aiming for), while contradiction is more open-ended (any contradiction will do). Use the contrapositive when \\(\\neg P\\) is a natural target; use contradiction when no clear target exists.</p>

<div class="viz-placeholder" data-viz="viz-contradiction"></div>
`,
            visualizations: [
                {
                    id: 'viz-contradiction',
                    title: 'The Irrationality of sqrt(2): Animated Proof',
                    description: 'Watch the classic proof by contradiction unfold. At each step, the assumption that sqrt(2) is rational tightens into an impossible corner.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var step = 0;
                        var maxStep = 6;
                        var steps = [
                            { text: 'Assume: sqrt(2) = p/q in lowest terms (gcd(p,q) = 1)', color: viz.colors.blue, icon: 'ASSUME' },
                            { text: 'Square both sides: 2 = p\u00B2/q\u00B2, so p\u00B2 = 2q\u00B2', color: viz.colors.teal, icon: 'ALGEBRA' },
                            { text: 'p\u00B2 is even => p is even (Theorem 2.5)', color: viz.colors.orange, icon: 'DEDUCE' },
                            { text: 'Write p = 2m. Then 4m\u00B2 = 2q\u00B2, so q\u00B2 = 2m\u00B2', color: viz.colors.purple, icon: 'SUBSTITUTE' },
                            { text: 'q\u00B2 is even => q is even', color: viz.colors.orange, icon: 'DEDUCE' },
                            { text: 'Both p and q are even => gcd(p,q) >= 2', color: viz.colors.red, icon: 'OBSERVE' },
                            { text: 'CONTRADICTION: gcd(p,q) = 1 AND gcd(p,q) >= 2', color: viz.colors.red, icon: 'BOOM' }
                        ];

                        VizEngine.createButton(controls, 'Previous', function() {
                            if (step > 0) { step--; draw(); }
                        });
                        VizEngine.createButton(controls, 'Next', function() {
                            if (step < maxStep) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Proof: sqrt(2) is irrational', viz.width / 2, 22, viz.colors.white, 16);

                            var boxW = 470;
                            var boxH = 38;
                            var gap = 10;
                            var startY = 50;
                            var cx = viz.width / 2;

                            for (var i = 0; i <= maxStep; i++) {
                                var y = startY + i * (boxH + gap);
                                var s = steps[i];
                                var active = (i <= step);
                                var current = (i === step);
                                var isContradiction = (i === maxStep);

                                // Arrow
                                if (i > 0 && active) {
                                    ctx.strokeStyle = s.color + '55';
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.moveTo(cx, y - gap + 2);
                                    ctx.lineTo(cx, y - 2);
                                    ctx.stroke();
                                }

                                // Box
                                var rx = cx - boxW / 2;
                                ctx.fillStyle = active ? (isContradiction && current ? viz.colors.red + '22' : (current ? s.color + '22' : '#1a1a3066')) : '#0c0c20';
                                ctx.strokeStyle = active ? s.color : '#1a1a40';
                                ctx.lineWidth = current ? 2.5 : 1;

                                ctx.beginPath();
                                ctx.moveTo(rx + 6, y); ctx.lineTo(rx + boxW - 6, y);
                                ctx.quadraticCurveTo(rx + boxW, y, rx + boxW, y + 6);
                                ctx.lineTo(rx + boxW, y + boxH - 6);
                                ctx.quadraticCurveTo(rx + boxW, y + boxH, rx + boxW - 6, y + boxH);
                                ctx.lineTo(rx + 6, y + boxH);
                                ctx.quadraticCurveTo(rx, y + boxH, rx, y + boxH - 6);
                                ctx.lineTo(rx, y + 6);
                                ctx.quadraticCurveTo(rx, y, rx + 6, y);
                                ctx.closePath();
                                ctx.fill(); ctx.stroke();

                                // Icon badge
                                if (active) {
                                    ctx.fillStyle = s.color;
                                    ctx.font = 'bold 9px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(s.icon, rx + 10, y + 12);
                                }

                                // Text
                                ctx.fillStyle = active ? (isContradiction && current ? viz.colors.red : viz.colors.white) : viz.colors.text + '33';
                                ctx.font = (current ? 'bold ' : '') + '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(active ? s.text : '...', cx, y + boxH / 2 + 4);
                            }

                            // Conclusion
                            if (step === maxStep) {
                                var conY = startY + (maxStep + 1) * (boxH + gap) + 5;
                                viz.screenText('Therefore sqrt(2) is IRRATIONAL.', cx, conY, viz.colors.green, 14);
                            }

                            viz.screenText('Step ' + (step + 1) + ' of ' + (maxStep + 1), viz.width / 2, viz.height - 12, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove by contradiction that \\(\\sqrt{3}\\) is irrational.',
                    hint: 'Follow the same structure as the \\(\\sqrt{2}\\) proof. You will need Theorem 2.6 (if \\(3 \\mid n^2\\) then \\(3 \\mid n\\)).',
                    solution: 'Assume \\(\\sqrt{3} = p/q\\) with \\(\\gcd(p,q) = 1\\). Then \\(3q^2 = p^2\\), so \\(3 \\mid p^2\\), hence \\(3 \\mid p\\) (by Theorem 2.6). Write \\(p = 3m\\). Then \\(3q^2 = 9m^2\\), so \\(q^2 = 3m^2\\), hence \\(3 \\mid q\\). Both \\(p\\) and \\(q\\) are divisible by 3, contradicting \\(\\gcd(p,q) = 1\\).'
                },
                {
                    question: 'Prove by contradiction: there is no largest integer.',
                    hint: 'Assume there is a largest integer \\(N\\). Consider \\(N + 1\\).',
                    solution: 'Assume for contradiction that there exists a largest integer \\(N\\). Then \\(N + 1\\) is an integer (closure under addition) and \\(N + 1 > N\\), contradicting the assumption that \\(N\\) is the largest integer.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Proof by Cases
        // ================================================================
        {
            id: 'sec-cases',
            title: 'Proof by Cases',
            content: `
<h2>Proof by Cases</h2>

<div class="env-block intuition">
    <div class="env-title">Divide and Conquer</div>
    <div class="env-body">
        <p>Sometimes no single argument covers all instances of a statement, but you can partition the problem into a finite number of cases, prove the statement for each case, and combine. Since the cases are exhaustive (every instance falls into at least one case), the proof is complete.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Principle of Proof by Cases</div>
    <div class="env-body">
        <p>If the hypothesis \\(P\\) can be written as \\(P_1 \\vee P_2 \\vee \\cdots \\vee P_k\\) (a disjunction), and you can show \\(P_i \\Rightarrow Q\\) for each \\(i\\), then \\(P \\Rightarrow Q\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.9</div>
    <div class="env-body">
        <p>For every integer \\(n\\), \\(n^2 + n\\) is even.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (by Cases)</div>
    <div class="env-body">
        <p>Every integer is either even or odd.</p>
        <p><strong>Case 1:</strong> \\(n\\) is even. Then \\(n = 2k\\), so \\(n^2 + n = 4k^2 + 2k = 2(2k^2 + k)\\), which is even.</p>
        <p><strong>Case 2:</strong> \\(n\\) is odd. Then \\(n = 2k+1\\), so \\(n^2 + n = 4k^2 + 4k + 1 + 2k + 1 = 4k^2 + 6k + 2 = 2(2k^2 + 3k + 1)\\), which is even.</p>
        <p>In both cases, \\(n^2 + n\\) is even.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">A Slicker Proof</div>
    <div class="env-body">
        <p>Note that \\(n^2 + n = n(n+1)\\). Among any two consecutive integers, one is even. So the product \\(n(n+1)\\) is always even. This proof avoids cases entirely, but the case-based proof is instructive as a template.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.10</div>
    <div class="env-body">
        <p>For every integer \\(n\\), \\(n^3 - n\\) is divisible by 6.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (by Cases)</div>
    <div class="env-body">
        <p>Factor: \\(n^3 - n = (n-1)n(n+1)\\), the product of three consecutive integers. We need to show \\(6 \\mid (n-1)n(n+1)\\), i.e., both \\(2 \\mid (n-1)n(n+1)\\) and \\(3 \\mid (n-1)n(n+1)\\).</p>
        <p><strong>Divisible by 2:</strong> Among \\(n-1, n, n+1\\), at least one is even (consecutive integers alternate parity).</p>
        <p><strong>Divisible by 3:</strong> Among any three consecutive integers, exactly one is divisible by 3. (Consider \\(n \\bmod 3\\): cases 0, 1, 2 each give one multiple of 3.)</p>
        <p>Since \\(2 \\mid (n-1)n(n+1)\\) and \\(3 \\mid (n-1)n(n+1)\\) and \\(\\gcd(2,3) = 1\\), we have \\(6 \\mid (n-1)n(n+1)\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>The Triangle Inequality (A Case-Based Classic)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.11 (Triangle Inequality)</div>
    <div class="env-body">
        <p>For all real numbers \\(a\\) and \\(b\\): \\(|a + b| \\leq |a| + |b|\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (by Cases)</div>
    <div class="env-body">
        <p>Consider four cases based on the signs of \\(a\\) and \\(b\\).</p>
        <p><strong>Case 1:</strong> \\(a \\geq 0, b \\geq 0\\). Then \\(|a+b| = a + b = |a| + |b|\\).</p>
        <p><strong>Case 2:</strong> \\(a < 0, b < 0\\). Then \\(|a+b| = -(a+b) = (-a) + (-b) = |a| + |b|\\).</p>
        <p><strong>Case 3:</strong> \\(a \\geq 0, b < 0\\). Then \\(|a+b| \\leq \\max(a, -b) \\leq a + (-b) = |a| + |b|\\).</p>
        <p><strong>Case 4:</strong> \\(a < 0, b \\geq 0\\). Symmetric to Case 3.</p>
    </div>
    <div class="qed">&marker;</div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Prove by cases that for every integer \\(n\\), \\(n^2 + 3n + 7\\) is odd.',
                    hint: 'Consider cases \\(n\\) even and \\(n\\) odd separately.',
                    solution: '<strong>Case 1:</strong> \\(n = 2k\\). Then \\(n^2 + 3n + 7 = 4k^2 + 6k + 7 = 2(2k^2 + 3k + 3) + 1\\), odd. <strong>Case 2:</strong> \\(n = 2k+1\\). Then \\(n^2 + 3n + 7 = 4k^2 + 4k + 1 + 6k + 3 + 7 = 4k^2 + 10k + 11 = 2(2k^2 + 5k + 5) + 1\\), odd.'
                },
                {
                    question: 'Prove that \\(\\max(a, b) = \\frac{a + b + |a - b|}{2}\\) for all real numbers \\(a, b\\).',
                    hint: 'Consider two cases: \\(a \\geq b\\) and \\(a < b\\). In each case, compute \\(|a - b|\\) explicitly.',
                    solution: '<strong>Case 1 (\\(a \\geq b\\)):</strong> \\(|a-b| = a - b\\). RHS \\(= \\frac{a + b + a - b}{2} = a = \\max(a,b)\\). <strong>Case 2 (\\(a < b\\)):</strong> \\(|a-b| = b - a\\). RHS \\(= \\frac{a + b + b - a}{2} = b = \\max(a,b)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Mathematical Induction
        // ================================================================
        {
            id: 'sec-induction',
            title: 'Mathematical Induction',
            content: `
<h2>Mathematical Induction</h2>

<div class="env-block intuition">
    <div class="env-title">The Domino Principle</div>
    <div class="env-body">
        <p>Imagine an infinite line of dominoes. If you know two things: (1) the first domino falls, and (2) whenever any domino falls, the next one falls too, then you can conclude that <em>all</em> dominoes fall. Mathematical induction is exactly this principle, applied to the natural numbers.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Principle of Mathematical Induction</div>
    <div class="env-body">
        <p>Let \\(P(n)\\) be a statement depending on a natural number \\(n\\). If:</p>
        <ol>
            <li><strong>Base case:</strong> \\(P(n_0)\\) is true for some starting value \\(n_0\\), and</li>
            <li><strong>Inductive step:</strong> For every \\(k \\geq n_0\\), \\(P(k) \\Rightarrow P(k+1)\\),</li>
        </ol>
        <p>then \\(P(n)\\) is true for all \\(n \\geq n_0\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.12</div>
    <div class="env-body">
        <p>For all \\(n \\geq 1\\): \\(\\displaystyle \\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (by Induction)</div>
    <div class="env-body">
        <p><strong>Base case (\\(n = 1\\)):</strong> LHS \\(= 1\\). RHS \\(= \\frac{1 \\cdot 2}{2} = 1\\). \\(\\checkmark\\)</p>
        <p><strong>Inductive step:</strong> Assume \\(\\sum_{i=1}^{k} i = \\frac{k(k+1)}{2}\\) for some \\(k \\geq 1\\). We show it holds for \\(k + 1\\):</p>
        \\[\\sum_{i=1}^{k+1} i = \\left(\\sum_{i=1}^{k} i\\right) + (k+1) = \\frac{k(k+1)}{2} + (k+1) = \\frac{k(k+1) + 2(k+1)}{2} = \\frac{(k+1)(k+2)}{2}.\\]
        <p>This is exactly the formula with \\(n = k+1\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.13</div>
    <div class="env-body">
        <p>For all \\(n \\geq 1\\): \\(\\displaystyle \\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (by Induction)</div>
    <div class="env-body">
        <p><strong>Base case (\\(n = 1\\)):</strong> LHS \\(= 1\\). RHS \\(= \\frac{1 \\cdot 2 \\cdot 3}{6} = 1\\). \\(\\checkmark\\)</p>
        <p><strong>Inductive step:</strong> Assume \\(\\sum_{i=1}^{k} i^2 = \\frac{k(k+1)(2k+1)}{6}\\). Then:</p>
        \\[\\sum_{i=1}^{k+1} i^2 = \\frac{k(k+1)(2k+1)}{6} + (k+1)^2 = \\frac{k(k+1)(2k+1) + 6(k+1)^2}{6}\\]
        \\[= \\frac{(k+1)[k(2k+1) + 6(k+1)]}{6} = \\frac{(k+1)(2k^2 + 7k + 6)}{6} = \\frac{(k+1)(k+2)(2k+3)}{6}.\\]
        <p>This is the formula with \\(n = k + 1\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.14</div>
    <div class="env-body">
        <p>For all \\(n \\geq 4\\): \\(2^n > n^2\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (by Induction)</div>
    <div class="env-body">
        <p><strong>Base case (\\(n = 4\\)):</strong> \\(2^4 = 16 > 16 = 4^2\\)... Actually, \\(16 = 16\\), so we check \\(n = 5\\): \\(2^5 = 32 > 25 = 5^2\\). \\(\\checkmark\\)</p>
        <p>(We can verify \\(n = 4\\) is borderline: \\(2^4 = 4^2 = 16\\), but the strict inequality \\(2^n > n^2\\) holds for \\(n \\geq 5\\). Including \\(n = 4\\) requires \\(\\geq\\).)</p>
        <p><strong>Inductive step (\\(n \\geq 5\\)):</strong> Assume \\(2^k > k^2\\) for some \\(k \\geq 5\\). Then:</p>
        \\[2^{k+1} = 2 \\cdot 2^k > 2k^2.\\]
        <p>We need \\(2k^2 > (k+1)^2 = k^2 + 2k + 1\\), which simplifies to \\(k^2 - 2k - 1 > 0\\), i.e., \\(k^2 > 2k + 1\\). For \\(k \\geq 5\\): \\(25 > 11\\). \\(\\checkmark\\)</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Common Mistakes with Induction</h3>

<div class="env-block remark">
    <div class="env-title">Pitfalls</div>
    <div class="env-body">
        <ol>
            <li><strong>Forgetting the base case.</strong> Without it, the inductive step proves nothing. Example: "All horses are the same color" (the inductive step is valid for \\(n \\geq 2\\), but the base case \\(n = 1\\) does not connect to the step for \\(n = 2\\)).</li>
            <li><strong>Assuming what you want to prove.</strong> In the inductive step, you assume \\(P(k)\\) (the inductive hypothesis) and must prove \\(P(k+1)\\). You may <em>not</em> assume \\(P(k+1)\\).</li>
            <li><strong>Wrong base case.</strong> Make sure the base case matches the starting value in the statement.</li>
        </ol>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-induction-dominos"></div>
<div class="viz-placeholder" data-viz="viz-strong-induction"></div>
`,
            visualizations: [
                {
                    id: 'viz-induction-dominos',
                    title: 'Induction as Falling Dominoes',
                    description: 'The base case tips the first domino, and the inductive step ensures each domino knocks down the next. Press Play to watch the chain reaction.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var numDom = 12;
                        var fallen = 0;
                        var animating = false;
                        var angles = [];

                        function resetAngles() {
                            angles = [];
                            for (var i = 0; i < numDom; i++) angles.push(0);
                            fallen = 0;
                        }
                        resetAngles();

                        VizEngine.createButton(controls, 'Play', function() {
                            if (animating) return;
                            resetAngles();
                            animating = true;
                            fallen = 0;
                            var startTime = performance.now();

                            function anim(t) {
                                var elapsed = (t - startTime) / 1000;

                                // Each domino starts falling 0.2s after the previous
                                for (var i = 0; i < numDom; i++) {
                                    var dStart = i * 0.2;
                                    if (elapsed > dStart) {
                                        var dt = elapsed - dStart;
                                        angles[i] = Math.min(Math.PI / 2, dt * 4); // fall speed
                                    }
                                }

                                fallen = 0;
                                for (var j = 0; j < numDom; j++) {
                                    if (angles[j] >= Math.PI / 2 - 0.01) fallen++;
                                }

                                draw();

                                if (fallen < numDom) {
                                    requestAnimationFrame(anim);
                                } else {
                                    animating = false;
                                }
                            }
                            requestAnimationFrame(anim);
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            animating = false;
                            resetAngles();
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Mathematical Induction: The Domino Effect', viz.width / 2, 22, viz.colors.white, 15);

                            var groundY = 260;
                            var domW = 12;
                            var domH = 70;
                            var spacing = 42;
                            var startX = 40;

                            // Ground line
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(20, groundY);
                            ctx.lineTo(viz.width - 20, groundY);
                            ctx.stroke();

                            for (var i = 0; i < numDom; i++) {
                                var bx = startX + i * spacing;
                                var angle = angles[i];

                                ctx.save();
                                ctx.translate(bx, groundY);
                                ctx.rotate(angle);

                                // Domino rectangle
                                var isFallen = angle >= Math.PI / 2 - 0.01;
                                var isFalling = angle > 0 && !isFallen;

                                if (i === 0 && angle === 0) {
                                    ctx.fillStyle = viz.colors.green + '88';
                                    ctx.strokeStyle = viz.colors.green;
                                } else if (isFallen) {
                                    ctx.fillStyle = viz.colors.blue + '44';
                                    ctx.strokeStyle = viz.colors.blue;
                                } else if (isFalling) {
                                    ctx.fillStyle = viz.colors.orange + '66';
                                    ctx.strokeStyle = viz.colors.orange;
                                } else {
                                    ctx.fillStyle = '#1a1a40';
                                    ctx.strokeStyle = viz.colors.text + '88';
                                }

                                ctx.lineWidth = 1.5;
                                ctx.fillRect(-domW / 2, -domH, domW, domH);
                                ctx.strokeRect(-domW / 2, -domH, domW, domH);

                                // Label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(i === 0 ? 'n\u2080' : 'n\u2080+' + i, 0, -domH / 2);

                                ctx.restore();
                            }

                            // Labels
                            var labelY = groundY + 30;
                            if (fallen === 0) {
                                viz.screenText('Base case: tip the first domino (n = n\u2080)', viz.width / 2, labelY, viz.colors.green, 12);
                            } else if (fallen < numDom) {
                                viz.screenText('Inductive step: P(k) => P(k+1) ... domino ' + fallen + ' tips domino ' + (fallen + 1), viz.width / 2, labelY, viz.colors.orange, 12);
                            } else {
                                viz.screenText('All dominoes have fallen: P(n) holds for all n >= n\u2080', viz.width / 2, labelY, viz.colors.teal, 12);
                            }

                            viz.screenText('Fallen: ' + fallen + ' / ' + numDom, viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-strong-induction',
                    title: 'Strong Induction: Access All Previous Cases',
                    description: 'In strong induction, the inductive step assumes P(n\u2080), P(n\u2080+1), ..., P(k) are ALL true, not just P(k). Visualized as a tower of blocks where each new block rests on ALL blocks below it.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nBlocks = 8;
                        var activeBlock = 0;

                        VizEngine.createSlider(controls, 'Building block', 0, nBlocks - 1, 0, 1, function(v) {
                            activeBlock = Math.round(v);
                            draw();
                        });

                        var blockColors = [
                            viz.colors.green, viz.colors.blue, viz.colors.teal,
                            viz.colors.orange, viz.colors.purple, viz.colors.yellow,
                            viz.colors.pink, viz.colors.red
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Title
                            viz.screenText('Strong Induction', viz.width / 2, 22, viz.colors.white, 16);

                            // Draw comparison: weak vs strong
                            var leftX = 150;
                            var rightX = 430;
                            var baseY = 350;
                            var blockH = 32;
                            var blockW = 100;

                            // Weak induction (left)
                            viz.screenText('Weak Induction', leftX, 50, viz.colors.blue, 13);
                            viz.screenText('P(k) => P(k+1)', leftX, 68, viz.colors.text, 10);

                            for (var i = 0; i < nBlocks; i++) {
                                var y = baseY - i * blockH;
                                var active = (i <= activeBlock);
                                var isCurrent = (i === activeBlock);

                                ctx.fillStyle = active ? blockColors[i] + '66' : '#1a1a4044';
                                ctx.strokeStyle = active ? blockColors[i] : '#1a1a40';
                                ctx.lineWidth = isCurrent ? 2.5 : 1;
                                ctx.fillRect(leftX - blockW / 2, y - blockH, blockW, blockH - 2);
                                ctx.strokeRect(leftX - blockW / 2, y - blockH, blockW, blockH - 2);

                                ctx.fillStyle = active ? viz.colors.white : viz.colors.text + '44';
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('P(' + i + ')', leftX, y - blockH / 2);

                                // Arrow from previous only
                                if (i > 0 && isCurrent && active) {
                                    ctx.strokeStyle = blockColors[i - 1];
                                    ctx.lineWidth = 2;
                                    ctx.setLineDash([4, 3]);
                                    ctx.beginPath();
                                    ctx.moveTo(leftX + blockW / 2 + 5, y - 2);
                                    ctx.lineTo(leftX + blockW / 2 + 20, y - 2);
                                    ctx.lineTo(leftX + blockW / 2 + 20, y - blockH + 2);
                                    ctx.lineTo(leftX + blockW / 2 + 5, y - blockH + 2);
                                    ctx.stroke();
                                    ctx.setLineDash([]);
                                    ctx.fillStyle = blockColors[i - 1];
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.fillText('uses', leftX + blockW / 2 + 28, y - blockH / 2);
                                    ctx.fillText('P(' + (i-1) + ')', leftX + blockW / 2 + 28, y - blockH / 2 + 12);
                                }
                            }

                            // Strong induction (right)
                            viz.screenText('Strong Induction', rightX, 50, viz.colors.teal, 13);
                            viz.screenText('P(n\u2080)...P(k) => P(k+1)', rightX, 68, viz.colors.text, 10);

                            for (var j = 0; j < nBlocks; j++) {
                                var y2 = baseY - j * blockH;
                                var active2 = (j <= activeBlock);
                                var isCurrent2 = (j === activeBlock);

                                ctx.fillStyle = active2 ? blockColors[j] + '66' : '#1a1a4044';
                                ctx.strokeStyle = active2 ? blockColors[j] : '#1a1a40';
                                ctx.lineWidth = isCurrent2 ? 2.5 : 1;
                                ctx.fillRect(rightX - blockW / 2, y2 - blockH, blockW, blockH - 2);
                                ctx.strokeRect(rightX - blockW / 2, y2 - blockH, blockW, blockH - 2);

                                ctx.fillStyle = active2 ? viz.colors.white : viz.colors.text + '44';
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('P(' + j + ')', rightX, y2 - blockH / 2);

                                // Arrows from ALL previous
                                if (isCurrent2 && j > 0) {
                                    for (var k = 0; k < j; k++) {
                                        var y3 = baseY - k * blockH;
                                        ctx.strokeStyle = blockColors[k] + '88';
                                        ctx.lineWidth = 1.5;
                                        ctx.setLineDash([3, 3]);
                                        ctx.beginPath();
                                        ctx.moveTo(rightX + blockW / 2 + 2, y3 - blockH / 2);
                                        ctx.lineTo(rightX + blockW / 2 + 15 + k * 4, y3 - blockH / 2);
                                        ctx.lineTo(rightX + blockW / 2 + 15 + k * 4, y2 - blockH / 2);
                                        ctx.lineTo(rightX + blockW / 2 + 2, y2 - blockH / 2);
                                        ctx.stroke();
                                        ctx.setLineDash([]);
                                    }
                                }
                            }

                            // Caption
                            if (activeBlock === 0) {
                                viz.screenText('Base case: P(0) is established directly', viz.width / 2, viz.height - 15, viz.colors.green, 11);
                            } else {
                                viz.screenText('To prove P(' + activeBlock + '): weak uses only P(' + (activeBlock - 1) + '); strong uses P(0)...P(' + (activeBlock - 1) + ')', viz.width / 2, viz.height - 15, viz.colors.text, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove by induction that \\(\\sum_{i=0}^{n} 2^i = 2^{n+1} - 1\\) for all \\(n \\geq 0\\).',
                    hint: 'Base case: \\(n = 0\\). Inductive step: add \\(2^{k+1}\\) to both sides of the inductive hypothesis.',
                    solution: '<strong>Base (\\(n=0\\)):</strong> \\(2^0 = 1 = 2^1 - 1\\). <strong>Step:</strong> Assume \\(\\sum_{i=0}^{k} 2^i = 2^{k+1} - 1\\). Then \\(\\sum_{i=0}^{k+1} 2^i = (2^{k+1} - 1) + 2^{k+1} = 2 \\cdot 2^{k+1} - 1 = 2^{k+2} - 1\\).'
                },
                {
                    question: 'Prove by induction that \\(n! > 2^n\\) for all \\(n \\geq 4\\).',
                    hint: 'Base: \\(4! = 24 > 16 = 2^4\\). Inductive step: \\((k+1)! = (k+1) \\cdot k! > (k+1) \\cdot 2^k\\).',
                    solution: '<strong>Base (\\(n=4\\)):</strong> \\(24 > 16\\). <strong>Step:</strong> Assume \\(k! > 2^k\\) for \\(k \\geq 4\\). Then \\((k+1)! = (k+1) \\cdot k! > (k+1) \\cdot 2^k \\geq 2 \\cdot 2^k = 2^{k+1}\\) (since \\(k+1 \\geq 5 > 2\\)).'
                },
                {
                    question: 'Use strong induction to prove that every integer \\(n \\geq 2\\) can be written as a product of primes.',
                    hint: 'Base: \\(n = 2\\) is prime (a product of one prime). Inductive step: either \\(n\\) is prime, or \\(n = ab\\) with \\(2 \\leq a, b < n\\), and apply the strong inductive hypothesis to both \\(a\\) and \\(b\\).',
                    solution: '<strong>Base (\\(n=2\\)):</strong> 2 is prime, so it is a product of primes (just itself). <strong>Step:</strong> Assume every integer \\(2 \\leq m \\leq k\\) is a product of primes. Consider \\(k+1\\). If \\(k+1\\) is prime, done. If not, \\(k+1 = ab\\) with \\(2 \\leq a, b \\leq k\\). By strong induction, \\(a\\) and \\(b\\) are each products of primes, so \\(k+1 = ab\\) is also a product of primes.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Choosing Your Proof Strategy',
            content: `
<h2>Choosing Your Proof Strategy</h2>

<p>With several proof techniques now available, the natural question is: <em>which one should I use?</em> There is no algorithm for this, but there are useful heuristics.</p>

<div class="env-block intuition">
    <div class="env-title">A Decision Framework</div>
    <div class="env-body">
        <p>When faced with a statement to prove, ask yourself:</p>
        <ol>
            <li><strong>What is the logical form?</strong> Is it \\(P \\Rightarrow Q\\)? An existence statement? A "for all \\(n\\)" statement?</li>
            <li><strong>Can I start from the hypothesis and reach the conclusion?</strong> If yes, try a <em>direct proof</em>.</li>
            <li><strong>Is the conclusion hard to work toward, but its negation gives a useful starting point?</strong> Try the <em>contrapositive</em>.</li>
            <li><strong>Does the statement claim something doesn't exist, or that something is impossible?</strong> Try <em>contradiction</em>.</li>
            <li><strong>Are there natural subcases?</strong> Try <em>proof by cases</em>.</li>
            <li><strong>Does the statement involve "for all \\(n \\geq n_0\\)" with a recursive structure?</strong> Try <em>induction</em>.</li>
        </ol>
    </div>
</div>

<h3>Summary Table</h3>

<table class="proof-strategy-table">
<thead>
<tr><th>Technique</th><th>Structure</th><th>When to Use</th></tr>
</thead>
<tbody>
<tr><td>Direct</td><td>Assume \\(P\\), derive \\(Q\\)</td><td>Default. Hypothesis naturally leads to conclusion.</td></tr>
<tr><td>Contrapositive</td><td>Assume \\(\\neg Q\\), derive \\(\\neg P\\)</td><td>Conclusion is hard to work with directly; negation is more concrete.</td></tr>
<tr><td>Contradiction</td><td>Assume \\(\\neg S\\), derive impossibility</td><td>Existence/uniqueness claims; irrationality; infinitude.</td></tr>
<tr><td>Cases</td><td>Split into cases, prove each</td><td>Statement depends on discrete classification (parity, sign, mod).</td></tr>
<tr><td>Induction</td><td>Base + inductive step</td><td>Statements indexed by natural numbers with recursive structure.</td></tr>
</tbody>
</table>

<h3>Combining Techniques</h3>

<p>Real proofs often mix techniques. An induction proof might use cases within the inductive step, or contradiction for a lemma. The techniques are tools in a toolbox, not rigid templates.</p>

<div class="env-block example">
    <div class="env-title">Example: A Hybrid Proof</div>
    <div class="env-body">
        <p><strong>Claim:</strong> For all \\(n \\geq 1\\), \\(n^3 - n\\) is divisible by 6.</p>
        <p><strong>Proof:</strong> By induction on \\(n\\).</p>
        <p><strong>Base (\\(n = 1\\)):</strong> \\(1 - 1 = 0 = 6 \\cdot 0\\). \\(\\checkmark\\)</p>
        <p><strong>Inductive step:</strong> Assume \\(6 \\mid (k^3 - k)\\). Then:</p>
        \\[(k+1)^3 - (k+1) = k^3 + 3k^2 + 3k + 1 - k - 1 = (k^3 - k) + 3k(k+1).\\]
        <p>By the inductive hypothesis, \\(6 \\mid (k^3 - k)\\). The term \\(3k(k+1)\\) is divisible by 6 because \\(k(k+1)\\) is even (product of consecutive integers), so \\(3 \\cdot (\\text{even}) = 6m\\). Therefore \\(6 \\mid [(k+1)^3 - (k+1)]\\).</p>
    </div>
</div>

<h3>Looking Ahead</h3>

<p>These proof techniques will be used throughout discrete mathematics:</p>
<ul>
    <li><strong>Sets and relations</strong> (Chapters 3-5): Direct and contrapositive proofs for set identities, properties of relations.</li>
    <li><strong>Counting</strong> (Chapters 6-9): Induction for recurrence relations and combinatorial identities.</li>
    <li><strong>Graph theory</strong> (Chapters 10-13): Induction on the number of vertices or edges, contradiction for impossibility results.</li>
    <li><strong>Number theory</strong> (Chapters 14-16): All techniques, especially contradiction and induction.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-proof-strategy"></div>
`,
            visualizations: [
                {
                    id: 'viz-proof-strategy',
                    title: 'Proof Strategy Decision Tree',
                    description: 'Answer questions about the statement you want to prove, and the decision tree suggests the most appropriate proof technique.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var path = [];

                        var tree = {
                            q: 'What form is the statement?',
                            choices: [
                                {
                                    label: 'P => Q (conditional)',
                                    q: 'Can you unpack the hypothesis to reach the conclusion?',
                                    choices: [
                                        { label: 'Yes', result: 'Direct Proof', color: viz.colors.blue, tip: 'Assume P, derive Q step by step.' },
                                        {
                                            label: 'No / Hard',
                                            q: 'Does ~Q give a concrete starting point?',
                                            choices: [
                                                { label: 'Yes', result: 'Contrapositive', color: viz.colors.teal, tip: 'Assume ~Q, derive ~P.' },
                                                { label: 'No', result: 'Contradiction', color: viz.colors.orange, tip: 'Assume P and ~Q, derive impossibility.' }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    label: 'For all n >= n0',
                                    q: 'Does P(k+1) follow from P(k) or earlier?',
                                    choices: [
                                        { label: 'From P(k)', result: 'Weak Induction', color: viz.colors.green, tip: 'Base case + P(k)=>P(k+1).' },
                                        { label: 'From P(1)...P(k)', result: 'Strong Induction', color: viz.colors.purple, tip: 'Base case(s) + assume all up to k.' },
                                        { label: 'No recursion', result: 'Direct or Cases', color: viz.colors.blue, tip: 'May not need induction at all.' }
                                    ]
                                },
                                {
                                    label: 'Impossibility / nonexistence',
                                    result: 'Contradiction', color: viz.colors.orange,
                                    tip: 'Assume it exists or is possible, derive impossibility.'
                                },
                                {
                                    label: 'Cases by parity/sign/mod',
                                    result: 'Proof by Cases', color: viz.colors.yellow,
                                    tip: 'Split into exhaustive cases, prove each.'
                                }
                            ]
                        };

                        function getNode() {
                            var node = tree;
                            for (var i = 0; i < path.length; i++) {
                                node = node.choices[path[i]];
                            }
                            return node;
                        }

                        VizEngine.createButton(controls, 'Back', function() {
                            if (path.length > 0) { path.pop(); draw(); }
                        });
                        VizEngine.createButton(controls, 'Start Over', function() {
                            path = []; draw();
                        });

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var node = getNode();
                            if (node.result) return; // leaf

                            var choices = node.choices;
                            var startY = 130;
                            var btnH = 42;
                            var btnGap = 12;
                            var btnW = 360;
                            var cx = viz.width / 2;

                            for (var i = 0; i < choices.length; i++) {
                                var by = startY + i * (btnH + btnGap);
                                var bx = cx - btnW / 2;
                                if (mx >= bx && mx <= bx + btnW && my >= by && my <= by + btnH) {
                                    path.push(i);
                                    draw();
                                    return;
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var node = getNode();

                            viz.screenText('Proof Strategy Advisor', viz.width / 2, 22, viz.colors.white, 15);

                            // Breadcrumb
                            var crumb = 'Start';
                            var n = tree;
                            for (var i = 0; i < path.length; i++) {
                                crumb += ' > ' + n.choices[path[i]].label;
                                n = n.choices[path[i]];
                            }
                            viz.screenText(crumb, viz.width / 2, 46, viz.colors.text, 10);

                            if (node.result) {
                                // Leaf: show recommendation
                                var rcx = viz.width / 2;
                                var rcy = 180;

                                // Big circle
                                ctx.fillStyle = node.color + '22';
                                ctx.beginPath();
                                ctx.arc(rcx, rcy, 80, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = node.color;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.arc(rcx, rcy, 80, 0, Math.PI * 2);
                                ctx.stroke();

                                viz.screenText(node.result, rcx, rcy - 10, node.color, 18);
                                viz.screenText(node.tip, rcx, rcy + 20, viz.colors.text, 12);

                                viz.screenText('Click "Start Over" to try another statement.', rcx, 310, viz.colors.text, 11);
                            } else {
                                // Question + choices
                                viz.screenText(node.q, viz.width / 2, 85, viz.colors.white, 14);

                                var choices = node.choices;
                                var startY = 130;
                                var btnH = 42;
                                var btnGap = 12;
                                var btnW = 360;
                                var cxBtn = viz.width / 2;

                                for (var j = 0; j < choices.length; j++) {
                                    var by = startY + j * (btnH + btnGap);
                                    var bx = cxBtn - btnW / 2;

                                    var choiceColor = choices[j].color || viz.colors.blue;

                                    ctx.fillStyle = '#1a1a40';
                                    ctx.strokeStyle = choiceColor + '88';
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.moveTo(bx + 6, by); ctx.lineTo(bx + btnW - 6, by);
                                    ctx.quadraticCurveTo(bx + btnW, by, bx + btnW, by + 6);
                                    ctx.lineTo(bx + btnW, by + btnH - 6);
                                    ctx.quadraticCurveTo(bx + btnW, by + btnH, bx + btnW - 6, by + btnH);
                                    ctx.lineTo(bx + 6, by + btnH);
                                    ctx.quadraticCurveTo(bx, by + btnH, bx, by + btnH - 6);
                                    ctx.lineTo(bx, by + 6);
                                    ctx.quadraticCurveTo(bx, by, bx + 6, by);
                                    ctx.closePath();
                                    ctx.fill(); ctx.stroke();

                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(choices[j].label, cxBtn, by + btnH / 2);
                                }

                                viz.screenText('Click a choice to navigate the decision tree', viz.width / 2, viz.height - 15, viz.colors.text, 10);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For each statement below, identify the best proof technique and briefly explain why: (a) If \\(3n + 2\\) is odd, then \\(n\\) is odd. (b) The sum \\(1 + 3 + 5 + \\cdots + (2n-1) = n^2\\) for all \\(n \\geq 1\\). (c) There is no rational number \\(r\\) with \\(r^2 = 6\\).',
                    hint: 'Match the structure of each statement to the proof templates.',
                    solution: '(a) <strong>Contrapositive:</strong> The direct approach starting from "3n + 2 is odd" is awkward. The contrapositive is: if \\(n\\) is even, then \\(3n + 2\\) is even. Let \\(n = 2k\\), then \\(3(2k) + 2 = 6k + 2 = 2(3k+1)\\), which is even. (b) <strong>Induction:</strong> The statement is indexed by \\(n\\) with a sum that adds one term when going from \\(n\\) to \\(n+1\\). (c) <strong>Contradiction:</strong> Assume \\(r = p/q\\) in lowest terms with \\(r^2 = 6\\), and derive that both \\(p\\) and \\(q\\) must share common factors.'
                },
                {
                    question: 'Prove that for all \\(n \\geq 1\\), \\(1^3 + 2^3 + \\cdots + n^3 = \\left(\\frac{n(n+1)}{2}\\right)^2\\).',
                    hint: 'Use induction. In the inductive step, show that \\(\\left(\\frac{k(k+1)}{2}\\right)^2 + (k+1)^3 = \\left(\\frac{(k+1)(k+2)}{2}\\right)^2\\).',
                    solution: '<strong>Base (\\(n=1\\)):</strong> \\(1 = (1 \\cdot 2/2)^2 = 1\\). <strong>Step:</strong> Assume the formula holds for \\(k\\). Then \\(\\sum_{i=1}^{k+1} i^3 = \\left(\\frac{k(k+1)}{2}\\right)^2 + (k+1)^3 = (k+1)^2\\left(\\frac{k^2}{4} + (k+1)\\right) = (k+1)^2 \\cdot \\frac{k^2 + 4k + 4}{4} = (k+1)^2 \\cdot \\frac{(k+2)^2}{4} = \\left(\\frac{(k+1)(k+2)}{2}\\right)^2\\).'
                }
            ]
        }
    ]
});
