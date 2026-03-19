window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch01',
    number: 1,
    title: 'Predicate Logic & Quantifiers',
    subtitle: 'For all and there exists',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Predicate Logic?',
            content: `
<h2>Why Predicate Logic?</h2>

<div class="env-block intuition">
    <div class="env-title">The Limits of Propositional Logic</div>
    <div class="env-body">
        <p>Propositional logic lets us combine statements with AND, OR, NOT, and IF-THEN. But consider: "Every even number greater than 2 is the sum of two primes." This single sentence talks about <em>infinitely many</em> numbers. No finite list of propositions can capture it. We need a way to make statements <em>about</em> objects, and to say "for all" or "there exists."</p>
    </div>
</div>

<p>Propositional logic treats each statement as an indivisible atom: \\(p\\), \\(q\\), \\(r\\). It cannot look <em>inside</em> a statement to see its structure. Consider these two arguments:</p>

<ol>
    <li>"All humans are mortal. Socrates is human. Therefore Socrates is mortal."</li>
    <li>"All primes greater than 2 are odd. 7 is a prime greater than 2. Therefore 7 is odd."</li>
</ol>

<p>Both arguments have identical logical structure, but propositional logic cannot see it. To capture patterns like these, we need <strong>predicate logic</strong> (also called first-order logic), which adds two powerful ingredients:</p>

<ul>
    <li><strong>Predicates</strong>: statements that depend on variables, like \\(P(x)\\) meaning "\\(x\\) is prime."</li>
    <li><strong>Quantifiers</strong>: the universal quantifier \\(\\forall\\) ("for all") and the existential quantifier \\(\\exists\\) ("there exists").</li>
</ul>

<p>Together, these let us express and reason about properties of entire collections of objects, not just fixed truths.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Predicate logic was developed by Gottlob Frege in his 1879 <em>Begriffsschrift</em>, one of the most important works in the history of logic. It extended Aristotelian syllogisms and Boole's algebra of logic into a system powerful enough to formalize all of mathematics.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Predicates & Variables
        // ================================================================
        {
            id: 'sec-predicates',
            title: 'Predicates & Variables',
            content: `
<h2>Predicates & Variables</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Predicate)</div>
    <div class="env-body">
        <p>A <strong>predicate</strong> is a statement that contains one or more variables, becoming a proposition once every variable is assigned a value. We write \\(P(x)\\), \\(Q(x, y)\\), etc.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Let \\(P(x)\\) denote "\\(x^2 > 10\\)."</p>
        <ul>
            <li>\\(P(2)\\): "\\(4 > 10\\)" is <strong>false</strong>.</li>
            <li>\\(P(4)\\): "\\(16 > 10\\)" is <strong>true</strong>.</li>
            <li>\\(P(x)\\) by itself is neither true nor false; it is a <em>predicate</em>, not a proposition.</li>
        </ul>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Domain of Discourse)</div>
    <div class="env-body">
        <p>The <strong>domain of discourse</strong> (or simply <em>domain</em>) is the set of all possible values that a variable can take. The truth value of a predicate can change entirely depending on the domain.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Domain Matters</div>
    <div class="env-body">
        <p>Let \\(P(x)\\) be "\\(x^2 \\geq 0\\)."</p>
        <ul>
            <li>If the domain is \\(\\mathbb{R}\\) (all real numbers), \\(P(x)\\) is true for every \\(x\\).</li>
            <li>If the domain is \\(\\mathbb{C}\\) (all complex numbers), \\(P(x)\\) is not even well-defined as a truth statement in the usual sense, because complex numbers do not have a standard ordering.</li>
        </ul>
        <p>The domain must always be specified (or clear from context) before we evaluate predicates.</p>
    </div>
</div>

<p>Predicates can have multiple variables. \\(Q(x, y)\\) meaning "\\(x < y\\)" is a two-variable predicate. It becomes a proposition once <em>both</em> \\(x\\) and \\(y\\) are specified (e.g., \\(Q(3, 5)\\) is true, \\(Q(7, 2)\\) is false).</p>

<div class="viz-placeholder" data-viz="viz-predicate-evaluator"></div>
<div class="viz-placeholder" data-viz="viz-domain-matters"></div>
`,
            visualizations: [
                {
                    id: 'viz-predicate-evaluator',
                    title: 'Predicate Evaluator',
                    description: 'Choose a predicate P(x) and a finite domain. The visualization evaluates P(x) for each element and colors it green (true) or red (false).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var predicates = [
                            { label: 'x > 5', fn: function(x) { return x > 5; } },
                            { label: 'x is even', fn: function(x) { return x % 2 === 0; } },
                            { label: 'x^2 < 30', fn: function(x) { return x * x < 30; } },
                            { label: 'x is prime', fn: function(x) {
                                if (x < 2) return false;
                                for (var i = 2; i * i <= x; i++) { if (x % i === 0) return false; }
                                return true;
                            }},
                            { label: 'x mod 3 = 0', fn: function(x) { return x % 3 === 0; } }
                        ];

                        var domains = [
                            { label: '{1, 2, ..., 10}', values: [1,2,3,4,5,6,7,8,9,10] },
                            { label: '{1, 2, ..., 15}', values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] },
                            { label: '{-5, ..., 5}', values: [-5,-4,-3,-2,-1,0,1,2,3,4,5] },
                            { label: '{2, 4, 6, 8, 10}', values: [2,4,6,8,10] }
                        ];

                        var predIdx = 0;
                        var domIdx = 0;

                        // Predicate selector
                        var pSel = document.createElement('select');
                        pSel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        for (var i = 0; i < predicates.length; i++) {
                            var o = document.createElement('option');
                            o.value = i; o.textContent = 'P(x): ' + predicates[i].label;
                            pSel.appendChild(o);
                        }
                        pSel.addEventListener('change', function() { predIdx = parseInt(pSel.value); draw(); });
                        controls.appendChild(pSel);

                        // Domain selector
                        var dSel = document.createElement('select');
                        dSel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;';
                        for (var j = 0; j < domains.length; j++) {
                            var o2 = document.createElement('option');
                            o2.value = j; o2.textContent = 'Domain: ' + domains[j].label;
                            dSel.appendChild(o2);
                        }
                        dSel.addEventListener('change', function() { domIdx = parseInt(dSel.value); draw(); });
                        controls.appendChild(dSel);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pred = predicates[predIdx];
                            var dom = domains[domIdx];
                            var vals = dom.values;
                            var n = vals.length;

                            viz.screenText('P(x): "' + pred.label + '"', viz.width / 2, 24, viz.colors.white, 15);
                            viz.screenText('Domain: ' + dom.label, viz.width / 2, 48, viz.colors.text, 12);

                            // Layout elements in a row or grid
                            var cols = Math.min(n, 8);
                            var rows = Math.ceil(n / cols);
                            var cellW = Math.min(60, (viz.width - 60) / cols);
                            var cellH = Math.min(50, (viz.height - 120) / rows);
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 80;

                            var trueCount = 0;
                            var falseCount = 0;

                            for (var i = 0; i < n; i++) {
                                var row = Math.floor(i / cols);
                                var col = i % cols;
                                var cx = startX + col * cellW + cellW / 2;
                                var cy = startY + row * cellH + cellH / 2;
                                var val = vals[i];
                                var result = pred.fn(val);

                                if (result) trueCount++; else falseCount++;

                                // Circle
                                var r = Math.min(cellW, cellH) * 0.35;
                                ctx.fillStyle = result ? viz.colors.green + '33' : viz.colors.red + '33';
                                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = result ? viz.colors.green : viz.colors.red;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

                                // Value
                                ctx.fillStyle = result ? viz.colors.green : viz.colors.red;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(val.toString(), cx, cy);
                            }

                            // Summary
                            var sumY = startY + rows * cellH + 30;
                            viz.screenText('True: ' + trueCount + '   False: ' + falseCount, viz.width / 2, sumY, viz.colors.white, 13);

                            // forall / exists summary
                            var forallTrue = (falseCount === 0);
                            var existsTrue = (trueCount > 0);
                            viz.screenText(
                                (forallTrue ? '\u2200x P(x) is TRUE' : '\u2200x P(x) is FALSE') +
                                '     ' +
                                (existsTrue ? '\u2203x P(x) is TRUE' : '\u2203x P(x) is FALSE'),
                                viz.width / 2, sumY + 24, viz.colors.teal, 12
                            );
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-domain-matters',
                    title: 'Domain Matters',
                    description: 'The same predicate can be universally true on one domain and false on another. Toggle between domains to see how truth values change.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 320,
                            originX: 0, originY: 0, scale: 1
                        });

                        var scenarios = [
                            {
                                pred: 'x^2 >= x',
                                fn: function(x) { return x * x >= x; },
                                domains: [
                                    { label: '{1,2,3,4,5}', values: [1,2,3,4,5] },
                                    { label: '{0, 0.5, 1}', values: [0, 0.5, 1] },
                                    { label: '{-2,-1,0,1,2}', values: [-2,-1,0,1,2] }
                                ]
                            },
                            {
                                pred: 'x > 0',
                                fn: function(x) { return x > 0; },
                                domains: [
                                    { label: '{1,2,3}', values: [1,2,3] },
                                    { label: '{-1,0,1}', values: [-1,0,1] },
                                    { label: '{-3,-2,-1}', values: [-3,-2,-1] }
                                ]
                            },
                            {
                                pred: 'x is prime',
                                fn: function(x) {
                                    if (x < 2) return false;
                                    for (var i = 2; i * i <= x; i++) { if (x % i === 0) return false; }
                                    return true;
                                },
                                domains: [
                                    { label: '{2,3,5,7}', values: [2,3,5,7] },
                                    { label: '{4,6,8,9}', values: [4,6,8,9] },
                                    { label: '{1,2,3,4,5,6}', values: [1,2,3,4,5,6] }
                                ]
                            }
                        ];

                        var scenIdx = 0;

                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;';
                        for (var i = 0; i < scenarios.length; i++) {
                            var o = document.createElement('option');
                            o.value = i; o.textContent = 'P(x): ' + scenarios[i].pred;
                            sel.appendChild(o);
                        }
                        sel.addEventListener('change', function() { scenIdx = parseInt(sel.value); draw(); });
                        controls.appendChild(sel);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var sc = scenarios[scenIdx];

                            viz.screenText('P(x): "' + sc.pred + '"', viz.width / 2, 22, viz.colors.white, 15);
                            viz.screenText('Same predicate, three different domains:', viz.width / 2, 44, viz.colors.text, 11);

                            var colW = (viz.width - 40) / 3;

                            for (var d = 0; d < 3; d++) {
                                var dom = sc.domains[d];
                                var vals = dom.values;
                                var cx = 20 + d * colW + colW / 2;
                                var topY = 70;

                                // Domain label
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText('Domain: ' + dom.label, cx, topY);

                                // Elements
                                var trueCount = 0;
                                for (var i = 0; i < vals.length; i++) {
                                    var v = vals[i];
                                    var result = sc.fn(v);
                                    if (result) trueCount++;
                                    var ey = topY + 30 + i * 28;
                                    var r = 10;

                                    ctx.fillStyle = result ? viz.colors.green + '33' : viz.colors.red + '33';
                                    ctx.beginPath(); ctx.arc(cx - 20, ey, r, 0, Math.PI * 2); ctx.fill();
                                    ctx.strokeStyle = result ? viz.colors.green : viz.colors.red;
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath(); ctx.arc(cx - 20, ey, r, 0, Math.PI * 2); ctx.stroke();

                                    ctx.fillStyle = result ? viz.colors.green : viz.colors.red;
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                    ctx.fillText(v + ' \u2192 ' + (result ? 'T' : 'F'), cx - 5, ey);
                                }

                                // Verdict
                                var forall = (trueCount === vals.length);
                                var exists = (trueCount > 0);
                                var verdictY = topY + 30 + vals.length * 28 + 10;

                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillStyle = forall ? viz.colors.green : viz.colors.red;
                                ctx.fillText('\u2200x: ' + (forall ? 'TRUE' : 'FALSE'), cx, verdictY);
                                ctx.fillStyle = exists ? viz.colors.green : viz.colors.red;
                                ctx.fillText('\u2203x: ' + (exists ? 'TRUE' : 'FALSE'), cx, verdictY + 18);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(P(x)\\) be "\\(x^2 - 5x + 6 = 0\\)." Find the truth set of \\(P(x)\\) when the domain is \\(\\mathbb{Z}\\) (the integers).',
                    hint: 'Factor the quadratic: \\(x^2 - 5x + 6 = (x-2)(x-3)\\).',
                    solution: 'The equation \\(x^2 - 5x + 6 = 0\\) factors as \\((x-2)(x-3) = 0\\), so the truth set is \\(\\{2, 3\\}\\). For any integer \\(x\\), \\(P(x)\\) is true if and only if \\(x \\in \\{2, 3\\}\\).'
                },
                {
                    question: 'Let \\(Q(x,y)\\) be "\\(x + y = 0\\)." Is \\(Q\\) a predicate with one variable, two variables, or a proposition? What is the truth set when the domain for both variables is \\(\\{-2, -1, 0, 1, 2\\}\\)?',
                    hint: 'Q depends on two variables, so it is a two-variable predicate. List all pairs \\((x,y)\\) from the domain such that \\(x + y = 0\\).',
                    solution: '\\(Q(x,y)\\) is a two-variable predicate. The truth set is \\(\\{(-2,2), (-1,1), (0,0), (1,-1), (2,-2)\\}\\), all pairs \\((x,y)\\) with \\(y = -x\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Universal & Existential Quantifiers
        // ================================================================
        {
            id: 'sec-quantifiers',
            title: 'Universal & Existential Quantifiers',
            content: `
<h2>Universal & Existential Quantifiers</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Universal Quantifier)</div>
    <div class="env-body">
        <p>The <strong>universal quantification</strong> of \\(P(x)\\) over a domain \\(D\\) is the statement</p>
        \\[\\forall x \\, P(x),\\]
        <p>read "for all \\(x\\), \\(P(x)\\)." It is true when \\(P(a)\\) is true for <em>every</em> element \\(a \\in D\\), and false if there is even one \\(a \\in D\\) with \\(P(a)\\) false.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Existential Quantifier)</div>
    <div class="env-body">
        <p>The <strong>existential quantification</strong> of \\(P(x)\\) over a domain \\(D\\) is the statement</p>
        \\[\\exists x \\, P(x),\\]
        <p>read "there exists an \\(x\\) such that \\(P(x)\\)." It is true when \\(P(a)\\) is true for <em>at least one</em> element \\(a \\in D\\), and false only if \\(P(a)\\) is false for every \\(a \\in D\\).</p>
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">The AND/OR Connection</div>
    <div class="env-body">
        <p>Over a finite domain \\(D = \\{a_1, a_2, \\ldots, a_n\\}\\):</p>
        <ul>
            <li>\\(\\forall x \\, P(x)\\) is equivalent to \\(P(a_1) \\wedge P(a_2) \\wedge \\cdots \\wedge P(a_n)\\). It is a big AND.</li>
            <li>\\(\\exists x \\, P(x)\\) is equivalent to \\(P(a_1) \\vee P(a_2) \\vee \\cdots \\vee P(a_n)\\). It is a big OR.</li>
        </ul>
        <p>\\(\\forall\\) demands <em>every single element</em> satisfy the predicate. \\(\\exists\\) is satisfied by <em>at least one</em>.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Let the domain be \\(\\{1, 2, 3, 4, 5\\}\\) and \\(P(x)\\) be "\\(x < 10\\)."</p>
        <ul>
            <li>\\(\\forall x \\, P(x)\\): True, because every element is less than 10.</li>
            <li>Now let \\(Q(x)\\) be "\\(x\\) is even." \\(\\forall x \\, Q(x)\\) is false (1 is not even), but \\(\\exists x \\, Q(x)\\) is true (2 is even).</li>
        </ul>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Remark: The Empty Domain</div>
    <div class="env-body">
        <p>If the domain is empty, then \\(\\forall x \\, P(x)\\) is <strong>vacuously true</strong> (there is no counterexample), and \\(\\exists x \\, P(x)\\) is <strong>false</strong> (there is no witness). This is a convention, but a useful one: it makes many theorems cleaner.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-forall-exists"></div>
`,
            visualizations: [
                {
                    id: 'viz-forall-exists',
                    title: 'Forall vs. Exists',
                    description: 'Visual comparison: "for all" requires every element to be green; "there exists" requires at least one green. Toggle predicates and watch the verdicts change.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var domain = [1,2,3,4,5,6,7,8,9,10];
                        var predicates = [
                            { label: 'x < 10', fn: function(x) { return x < 10; } },
                            { label: 'x is even', fn: function(x) { return x % 2 === 0; } },
                            { label: 'x > 0', fn: function(x) { return x > 0; } },
                            { label: 'x > 5', fn: function(x) { return x > 5; } },
                            { label: 'x > 100', fn: function(x) { return x > 100; } },
                            { label: 'x is prime', fn: function(x) {
                                if (x < 2) return false;
                                for (var i = 2; i * i <= x; i++) { if (x % i === 0) return false; }
                                return true;
                            }}
                        ];
                        var predIdx = 0;

                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;';
                        for (var i = 0; i < predicates.length; i++) {
                            var o = document.createElement('option');
                            o.value = i; o.textContent = 'P(x): ' + predicates[i].label;
                            sel.appendChild(o);
                        }
                        sel.addEventListener('change', function() { predIdx = parseInt(sel.value); draw(); });
                        controls.appendChild(sel);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pred = predicates[predIdx];

                            viz.screenText('Domain: {1, 2, ..., 10}    P(x): "' + pred.label + '"', viz.width / 2, 22, viz.colors.white, 13);

                            // Evaluate
                            var results = [];
                            var trueCount = 0;
                            for (var i = 0; i < domain.length; i++) {
                                var r = pred.fn(domain[i]);
                                results.push(r);
                                if (r) trueCount++;
                            }

                            // Draw elements as circles
                            var n = domain.length;
                            var circR = 22;
                            var gap = 10;
                            var totalW = n * (circR * 2 + gap) - gap;
                            var startX = (viz.width - totalW) / 2 + circR;
                            var elemY = 100;

                            for (var j = 0; j < n; j++) {
                                var cx = startX + j * (circR * 2 + gap);
                                var isTrue = results[j];

                                // Glow
                                ctx.fillStyle = isTrue ? viz.colors.green + '22' : viz.colors.red + '22';
                                ctx.beginPath(); ctx.arc(cx, elemY, circR + 4, 0, Math.PI * 2); ctx.fill();

                                // Circle
                                ctx.fillStyle = isTrue ? viz.colors.green + '44' : viz.colors.red + '44';
                                ctx.beginPath(); ctx.arc(cx, elemY, circR, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = isTrue ? viz.colors.green : viz.colors.red;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(cx, elemY, circR, 0, Math.PI * 2); ctx.stroke();

                                // Number
                                ctx.fillStyle = isTrue ? viz.colors.green : viz.colors.red;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(domain[j].toString(), cx, elemY);
                            }

                            // For-all section
                            var forallY = 180;
                            var forallTrue = (trueCount === n);

                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.fillRect(20, forallY, viz.width - 40, 70);
                            ctx.strokeStyle = viz.colors.blue + '66';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(20, forallY, viz.width - 40, 70);

                            viz.screenText('\u2200x P(x)  "For ALL x, P(x)"', viz.width / 2, forallY + 18, viz.colors.blue, 14);
                            viz.screenText(
                                'Requires EVERY element green. ' + trueCount + '/' + n + ' are true.',
                                viz.width / 2, forallY + 38, viz.colors.text, 11
                            );
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = forallTrue ? viz.colors.green : viz.colors.red;
                            ctx.fillText('Verdict: ' + (forallTrue ? 'TRUE' : 'FALSE'), viz.width / 2, forallY + 58);

                            // Exists section
                            var existsY = 265;
                            var existsTrue = (trueCount > 0);

                            ctx.fillStyle = viz.colors.teal + '22';
                            ctx.fillRect(20, existsY, viz.width - 40, 70);
                            ctx.strokeStyle = viz.colors.teal + '66';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(20, existsY, viz.width - 40, 70);

                            viz.screenText('\u2203x P(x)  "There EXISTS an x with P(x)"', viz.width / 2, existsY + 18, viz.colors.teal, 14);
                            viz.screenText(
                                'Requires AT LEAST ONE element green. ' + trueCount + '/' + n + ' are true.',
                                viz.width / 2, existsY + 38, viz.colors.text, 11
                            );
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = existsTrue ? viz.colors.green : viz.colors.red;
                            ctx.fillText('Verdict: ' + (existsTrue ? 'TRUE' : 'FALSE'), viz.width / 2, existsY + 58);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let the domain be \\(\\{1,2,3,4,5\\}\\). Determine the truth value of: (a) \\(\\forall x\\,(x^2 \\leq 25)\\), (b) \\(\\exists x\\,(x^2 = 9)\\), (c) \\(\\forall x\\,(x < 3)\\).',
                    hint: 'Evaluate the predicate at each domain element. For (a), check whether every square is at most 25.',
                    solution: '(a) \\(1^2=1, 2^2=4, 3^2=9, 4^2=16, 5^2=25\\), all \\(\\leq 25\\). TRUE. (b) \\(3^2=9\\), so \\(x=3\\) is a witness. TRUE. (c) \\(x=3\\) gives \\(3 < 3\\), which is false. FALSE.'
                },
                {
                    question: 'Explain why \\(\\forall x \\, P(x)\\) is vacuously true when the domain is empty. Is \\(\\exists x \\, P(x)\\) also vacuously true on the empty domain?',
                    hint: 'Think about the AND/OR connection. What is an AND over zero terms? What is an OR over zero terms?',
                    solution: '\\(\\forall x\\, P(x)\\) is an AND over all domain elements. An AND over zero terms is true by convention (there are no counterexamples). \\(\\exists x\\, P(x)\\) is an OR over zero terms, which is false by convention (there is no witness). So \\(\\forall x\\, P(x)\\) is vacuously true, and \\(\\exists x\\, P(x)\\) is false on the empty domain.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Negating Quantified Statements
        // ================================================================
        {
            id: 'sec-negation',
            title: 'Negating Quantified Statements',
            content: `
<h2>Negating Quantified Statements</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Idea</div>
    <div class="env-body">
        <p>To deny "everyone passed the exam," you do not need to show that <em>no one</em> passed. You only need <em>one</em> person who failed. Conversely, to deny "someone solved the puzzle," you must show that <em>nobody</em> solved it. This gives us De Morgan's laws for quantifiers.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 1.1 (De Morgan's Laws for Quantifiers)</div>
    <div class="env-body">
        <p>For any predicate \\(P(x)\\) over a domain \\(D\\):</p>
        \\[\\neg \\forall x \\, P(x) \\equiv \\exists x \\, \\neg P(x)\\]
        \\[\\neg \\exists x \\, P(x) \\equiv \\forall x \\, \\neg P(x)\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>For the first law: \\(\\neg \\forall x \\, P(x)\\) is false when \\(\\forall x \\, P(x)\\) is true, i.e., when every element satisfies \\(P\\). So \\(\\neg \\forall x \\, P(x)\\) is true exactly when some element fails \\(P\\), which is \\(\\exists x \\, \\neg P(x)\\). The second law is analogous.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>These are the quantifier analogues of the propositional De Morgan's laws \\(\\neg(p \\wedge q) \\equiv \\neg p \\vee \\neg q\\) and \\(\\neg(p \\vee q) \\equiv \\neg p \\wedge \\neg q\\). This makes sense: \\(\\forall\\) is a big AND and \\(\\exists\\) is a big OR.</p>

<div class="env-block example">
    <div class="env-title">Example: Negating Nested Quantifiers</div>
    <div class="env-body">
        <p>Negate the statement "For every \\(\\epsilon > 0\\), there exists \\(\\delta > 0\\) such that \\(|f(x) - L| < \\epsilon\\) whenever \\(0 < |x - a| < \\delta\\)."</p>
        <p>Push the negation through each quantifier, flipping \\(\\forall\\) to \\(\\exists\\) and vice versa:</p>
        \\[\\exists \\epsilon > 0 \\, \\forall \\delta > 0 \\, \\exists x \\, \\bigl(0 < |x - a| < \\delta \\text{ and } |f(x) - L| \\geq \\epsilon\\bigr).\\]
        <p>In English: "There is some \\(\\epsilon > 0\\) such that no matter how small \\(\\delta\\) is, some \\(x\\) within \\(\\delta\\) of \\(a\\) has \\(f(x)\\) at least \\(\\epsilon\\) away from \\(L\\)." This is the negation of the limit definition from calculus.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-negation-demo"></div>
`,
            visualizations: [
                {
                    id: 'viz-negation-demo',
                    title: 'Negation of Quantified Statements',
                    description: 'See how negating a quantified statement flips the quantifier and negates the predicate. Elements change from green/red to red/green, and the quantifier switches between for-all and there-exists.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var domain = [1,2,3,4,5,6,7,8];
                        var predicates = [
                            { label: 'x is even', fn: function(x) { return x % 2 === 0; } },
                            { label: 'x > 3', fn: function(x) { return x > 3; } },
                            { label: 'x < 10', fn: function(x) { return x < 10; } },
                            { label: 'x is prime', fn: function(x) {
                                if (x < 2) return false;
                                for (var i = 2; i * i <= x; i++) { if (x % i === 0) return false; }
                                return true;
                            }}
                        ];
                        var predIdx = 0;
                        var showNegation = false;

                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        for (var i = 0; i < predicates.length; i++) {
                            var o = document.createElement('option');
                            o.value = i; o.textContent = 'P(x): ' + predicates[i].label;
                            sel.appendChild(o);
                        }
                        sel.addEventListener('change', function() { predIdx = parseInt(sel.value); draw(); });
                        controls.appendChild(sel);

                        var negBtn = VizEngine.createButton(controls, 'Toggle Negation', function() {
                            showNegation = !showNegation;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pred = predicates[predIdx];

                            // Title
                            if (!showNegation) {
                                viz.screenText('\u2200x P(x)   where P(x): "' + pred.label + '"', viz.width / 2, 22, viz.colors.blue, 14);
                                viz.screenText('(For all x, P(x))', viz.width / 2, 42, viz.colors.text, 11);
                            } else {
                                viz.screenText('\u00AC\u2200x P(x)  \u2261  \u2203x \u00ACP(x)', viz.width / 2, 22, viz.colors.orange, 14);
                                viz.screenText('Negated: there exists x such that NOT P(x)', viz.width / 2, 42, viz.colors.text, 11);
                            }

                            // Draw elements
                            var n = domain.length;
                            var circR = 22;
                            var gap = 8;
                            var totalW = n * (circR * 2 + gap) - gap;
                            var startX = (viz.width - totalW) / 2 + circR;

                            // Original row
                            var y1 = 110;
                            viz.screenText('P(x):', 40, y1, viz.colors.text, 11);
                            var trueCount = 0;
                            for (var j = 0; j < n; j++) {
                                var cx = startX + j * (circR * 2 + gap);
                                var isTrue = pred.fn(domain[j]);
                                if (isTrue) trueCount++;

                                ctx.fillStyle = isTrue ? viz.colors.green + '44' : viz.colors.red + '44';
                                ctx.beginPath(); ctx.arc(cx, y1, circR, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = isTrue ? viz.colors.green : viz.colors.red;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(cx, y1, circR, 0, Math.PI * 2); ctx.stroke();

                                ctx.fillStyle = isTrue ? viz.colors.green : viz.colors.red;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(domain[j].toString(), cx, y1);
                            }

                            // Negated row
                            var y2 = 190;
                            viz.screenText('\u00ACP(x):', 40, y2, viz.colors.text, 11);
                            for (var k = 0; k < n; k++) {
                                var cx2 = startX + k * (circR * 2 + gap);
                                var isNegTrue = !pred.fn(domain[k]);

                                ctx.fillStyle = isNegTrue ? viz.colors.green + '44' : viz.colors.red + '44';
                                ctx.beginPath(); ctx.arc(cx2, y2, circR, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = isNegTrue ? viz.colors.green : viz.colors.red;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(cx2, y2, circR, 0, Math.PI * 2); ctx.stroke();

                                ctx.fillStyle = isNegTrue ? viz.colors.green : viz.colors.red;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(domain[k].toString(), cx2, y2);
                            }

                            // Arrow between rows
                            ctx.strokeStyle = viz.colors.purple;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4,3]);
                            ctx.beginPath(); ctx.moveTo(viz.width / 2, y1 + circR + 5); ctx.lineTo(viz.width / 2, y2 - circR - 5); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('negate each element', viz.width / 2 + 80, (y1 + y2) / 2, viz.colors.purple, 10);

                            // Verdicts
                            var forallOrig = (trueCount === n);
                            var existsNeg = (trueCount < n);

                            var vY = 260;
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.fillRect(20, vY, (viz.width - 50) / 2, 90);
                            ctx.strokeStyle = viz.colors.blue + '44';
                            ctx.strokeRect(20, vY, (viz.width - 50) / 2, 90);

                            viz.screenText('\u2200x P(x)', 20 + (viz.width - 50) / 4, vY + 18, viz.colors.blue, 13);
                            ctx.fillStyle = forallOrig ? viz.colors.green : viz.colors.red;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(forallOrig ? 'TRUE' : 'FALSE', 20 + (viz.width - 50) / 4, vY + 45);
                            viz.screenText(trueCount + '/' + n + ' elements satisfy P', 20 + (viz.width - 50) / 4, vY + 70, viz.colors.text, 10);

                            var rX = 30 + (viz.width - 50) / 2;
                            ctx.fillStyle = viz.colors.orange + '22';
                            ctx.fillRect(rX, vY, (viz.width - 50) / 2, 90);
                            ctx.strokeStyle = viz.colors.orange + '44';
                            ctx.strokeRect(rX, vY, (viz.width - 50) / 2, 90);

                            viz.screenText('\u2203x \u00ACP(x)', rX + (viz.width - 50) / 4, vY + 18, viz.colors.orange, 13);
                            ctx.fillStyle = existsNeg ? viz.colors.green : viz.colors.red;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(existsNeg ? 'TRUE' : 'FALSE', rX + (viz.width - 50) / 4, vY + 45);
                            viz.screenText((n - trueCount) + '/' + n + ' elements satisfy \u00ACP', rX + (viz.width - 50) / 4, vY + 70, viz.colors.text, 10);

                            // Equivalence note
                            if (showNegation) {
                                viz.screenText('\u00AC\u2200x P(x)  \u2261  \u2203x \u00ACP(x)    Both are ' + (existsNeg ? 'TRUE' : 'FALSE'), viz.width / 2, vY + 105, viz.colors.white, 12);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Negate the statement "Every student in this class has taken a course in calculus." Express the negation in plain English.',
                    hint: 'Apply \\(\\neg \\forall x \\, P(x) \\equiv \\exists x \\, \\neg P(x)\\).',
                    solution: 'Formal negation: \\(\\exists x\\, \\neg P(x)\\). In English: "There is a student in this class who has not taken a course in calculus." Note: this does NOT mean no students have taken calculus, just that at least one has not.'
                },
                {
                    question: 'Negate: "There exists a real number \\(x\\) such that \\(x^2 + 1 = 0\\)."',
                    hint: 'Apply \\(\\neg \\exists x \\, P(x) \\equiv \\forall x \\, \\neg P(x)\\).',
                    solution: 'Negation: "For every real number \\(x\\), \\(x^2 + 1 \\neq 0\\)." This is in fact true over \\(\\mathbb{R}\\), because \\(x^2 \\geq 0\\) implies \\(x^2 + 1 \\geq 1 > 0\\).'
                },
                {
                    question: 'Negate: \\(\\forall x \\, \\exists y \\, (x + y = 0)\\). Write the negation in symbols and in English (domain: all real numbers).',
                    hint: 'Push the negation through both quantifiers, flipping each one.',
                    solution: 'Negation: \\(\\exists x \\, \\forall y \\, (x + y \\neq 0)\\). In English: "There is a real number \\(x\\) such that for every real number \\(y\\), \\(x + y \\neq 0\\)." The original statement is true (given \\(x\\), take \\(y = -x\\)), so this negation is false.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Multiple Quantifiers
        // ================================================================
        {
            id: 'sec-multiple',
            title: 'Multiple Quantifiers',
            content: `
<h2>Multiple Quantifiers</h2>

<div class="env-block intuition">
    <div class="env-title">Order Matters!</div>
    <div class="env-body">
        <p>Consider two sentences about real numbers:</p>
        <ul>
            <li>\\(\\forall x \\, \\exists y \\, (x + y = 0)\\): "For every number, there is a number that sums to zero with it." <strong>True</strong> (take \\(y = -x\\)).</li>
            <li>\\(\\exists y \\, \\forall x \\, (x + y = 0)\\): "There is a single number \\(y\\) that sums to zero with <em>every</em> number." <strong>False</strong> (no single \\(y\\) works for all \\(x\\)).</li>
        </ul>
        <p>Swapping \\(\\forall\\) and \\(\\exists\\) changes the meaning dramatically. The order of quantifiers is critical.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 1.2 (Quantifier Order)</div>
    <div class="env-body">
        <p>For any predicate \\(P(x, y)\\):</p>
        <ol>
            <li>\\(\\forall x \\, \\forall y \\, P(x,y) \\equiv \\forall y \\, \\forall x \\, P(x,y)\\). (Two universal quantifiers commute.)</li>
            <li>\\(\\exists x \\, \\exists y \\, P(x,y) \\equiv \\exists y \\, \\exists x \\, P(x,y)\\). (Two existential quantifiers commute.)</li>
            <li>\\(\\exists x \\, \\forall y \\, P(x,y) \\Rightarrow \\forall y \\, \\exists x \\, P(x,y)\\). (This implication is strict; the converse fails in general.)</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of (3)</div>
    <div class="env-body">
        <p>Assume \\(\\exists x \\, \\forall y \\, P(x,y)\\). Then there is some \\(x_0\\) with \\(P(x_0, y)\\) true for all \\(y\\). Given any \\(y\\), the witness \\(x_0\\) satisfies \\(P(x_0, y)\\), so \\(\\exists x \\, P(x, y)\\). Since \\(y\\) was arbitrary, \\(\\forall y \\, \\exists x \\, P(x,y)\\).</p>
        <p>The converse fails: \\(\\forall y \\, \\exists x \\, P(x,y)\\) allows a <em>different</em> \\(x\\) for each \\(y\\), while \\(\\exists x \\, \\forall y \\, P(x,y)\\) demands a <em>single</em> \\(x\\) that works for all \\(y\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example: The Critical Distinction</div>
    <div class="env-body">
        <p>Let \\(P(x, y)\\) be "\\(x \\cdot y = 1\\)" over the domain of nonzero reals.</p>
        <ul>
            <li>\\(\\forall x \\, \\exists y \\, (xy = 1)\\): True. Every nonzero real has a multiplicative inverse.</li>
            <li>\\(\\exists y \\, \\forall x \\, (xy = 1)\\): False. No single \\(y\\) is the inverse of every \\(x\\).</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-quantifier-order"></div>
<div class="viz-placeholder" data-viz="viz-nested-quantifiers"></div>
`,
            visualizations: [
                {
                    id: 'viz-quantifier-order',
                    title: 'Quantifier Order: Forall-Exists vs. Exists-Forall',
                    description: 'An animated grid showing how the order of quantifiers changes the meaning. In "forall x exists y," each row needs at least one green cell. In "exists y forall x," some column must be entirely green.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var scenarios = [
                            {
                                label: 'x + y = 0',
                                domain: [-3,-2,-1,0,1,2,3],
                                fn: function(x, y) { return x + y === 0; }
                            },
                            {
                                label: 'x * y = 1  (domain: nonzero)',
                                domain: [-2,-1,1,2],
                                fn: function(x, y) { return Math.abs(x * y - 1) < 0.01; }
                            },
                            {
                                label: 'x <= y',
                                domain: [1,2,3,4,5],
                                fn: function(x, y) { return x <= y; }
                            },
                            {
                                label: 'x + y > 4',
                                domain: [1,2,3,4,5],
                                fn: function(x, y) { return x + y > 4; }
                            }
                        ];

                        var scenIdx = 0;
                        var animFrame = 0;
                        var animMode = null; // 'forall-exists' or 'exists-forall'
                        var animTimer = null;

                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        for (var i = 0; i < scenarios.length; i++) {
                            var o = document.createElement('option');
                            o.value = i; o.textContent = 'P(x,y): ' + scenarios[i].label;
                            sel.appendChild(o);
                        }
                        sel.addEventListener('change', function() {
                            scenIdx = parseInt(sel.value);
                            stopAnim();
                            draw();
                        });
                        controls.appendChild(sel);

                        VizEngine.createButton(controls, 'Animate \u2200x\u2203y', function() {
                            stopAnim();
                            animMode = 'forall-exists';
                            animFrame = 0;
                            runAnim();
                        });
                        VizEngine.createButton(controls, 'Animate \u2203y\u2200x', function() {
                            stopAnim();
                            animMode = 'exists-forall';
                            animFrame = 0;
                            runAnim();
                        });

                        function stopAnim() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            animMode = null; animFrame = 0;
                        }

                        function runAnim() {
                            var sc = scenarios[scenIdx];
                            var n = sc.domain.length;
                            var maxFrames = n + 1;
                            draw();
                            animTimer = setInterval(function() {
                                animFrame++;
                                if (animFrame >= maxFrames) { stopAnim(); }
                                draw();
                            }, 700);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var sc = scenarios[scenIdx];
                            var dom = sc.domain;
                            var n = dom.length;

                            viz.screenText('P(x, y): "' + sc.label + '"', viz.width / 2, 20, viz.colors.white, 14);

                            // Grid layout
                            var gridL = 80;
                            var gridT = 55;
                            var cellSize = Math.min(40, Math.min((viz.width - 160) / n, (viz.height - 140) / n));
                            var gridW = n * cellSize;
                            var gridH = n * cellSize;

                            // Axis labels
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('y \u2192', gridL + gridW / 2, gridT - 15);
                            ctx.save();
                            ctx.translate(gridL - 20, gridT + gridH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('x \u2192', 0, 0);
                            ctx.restore();

                            // Column headers (y)
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            for (var c = 0; c < n; c++) {
                                ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                ctx.fillText(dom[c].toString(), gridL + c * cellSize + cellSize / 2, gridT - 2);
                            }

                            // Row headers (x) and cells
                            for (var r = 0; r < n; r++) {
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(dom[r].toString(), gridL - 5, gridT + r * cellSize + cellSize / 2);

                                var rowHasTrue = false;
                                for (var c2 = 0; c2 < n; c2++) {
                                    var val = sc.fn(dom[r], dom[c2]);
                                    if (val) rowHasTrue = true;

                                    var cx = gridL + c2 * cellSize;
                                    var cy = gridT + r * cellSize;

                                    // Cell color
                                    ctx.fillStyle = val ? viz.colors.green + '55' : viz.colors.red + '22';
                                    ctx.fillRect(cx + 1, cy + 1, cellSize - 2, cellSize - 2);

                                    // Highlight for animation
                                    if (animMode === 'forall-exists' && r < animFrame) {
                                        ctx.strokeStyle = viz.colors.blue + '88';
                                        ctx.lineWidth = 2;
                                        ctx.strokeRect(cx + 1, cy + 1, cellSize - 2, cellSize - 2);
                                    }
                                    if (animMode === 'exists-forall' && c2 < animFrame) {
                                        ctx.strokeStyle = viz.colors.orange + '88';
                                        ctx.lineWidth = 2;
                                        ctx.strokeRect(cx + 1, cy + 1, cellSize - 2, cellSize - 2);
                                    }

                                    // T/F label
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillStyle = val ? viz.colors.green : viz.colors.red + '88';
                                    ctx.fillText(val ? 'T' : 'F', cx + cellSize / 2, cy + cellSize / 2);
                                }
                            }

                            // Grid border
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(gridL, gridT, gridW, gridH);

                            // Evaluate both quantifier orderings
                            // forall x exists y: every row has at least one T
                            var forallExists = true;
                            for (var rx = 0; rx < n; rx++) {
                                var found = false;
                                for (var cy2 = 0; cy2 < n; cy2++) {
                                    if (sc.fn(dom[rx], dom[cy2])) { found = true; break; }
                                }
                                if (!found) { forallExists = false; break; }
                            }

                            // exists y forall x: some column is all T
                            var existsForall = false;
                            for (var cy3 = 0; cy3 < n; cy3++) {
                                var allTrue = true;
                                for (var rx2 = 0; rx2 < n; rx2++) {
                                    if (!sc.fn(dom[rx2], dom[cy3])) { allTrue = false; break; }
                                }
                                if (allTrue) { existsForall = true; break; }
                            }

                            // Verdicts
                            var vY = gridT + gridH + 20;
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.fillRect(20, vY, (viz.width - 50) / 2, 55);
                            viz.screenText('\u2200x \u2203y P(x,y)', 20 + (viz.width - 50) / 4, vY + 14, viz.colors.blue, 12);
                            viz.screenText('Every row has a green cell?', 20 + (viz.width - 50) / 4, vY + 30, viz.colors.text, 10);
                            ctx.fillStyle = forallExists ? viz.colors.green : viz.colors.red;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(forallExists ? 'TRUE' : 'FALSE', 20 + (viz.width - 50) / 4, vY + 46);

                            var rX = 30 + (viz.width - 50) / 2;
                            ctx.fillStyle = viz.colors.orange + '22';
                            ctx.fillRect(rX, vY, (viz.width - 50) / 2, 55);
                            viz.screenText('\u2203y \u2200x P(x,y)', rX + (viz.width - 50) / 4, vY + 14, viz.colors.orange, 12);
                            viz.screenText('Some column is all green?', rX + (viz.width - 50) / 4, vY + 30, viz.colors.text, 10);
                            ctx.fillStyle = existsForall ? viz.colors.green : viz.colors.red;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(existsForall ? 'TRUE' : 'FALSE', rX + (viz.width - 50) / 4, vY + 46);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-nested-quantifiers',
                    title: 'Nested Quantifier Grid',
                    description: 'A 2D grid showing which (x,y) pairs satisfy P(x,y). Rows are x, columns are y. Green = true, red = false. Examine the grid to determine truth of various quantified statements.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var predicates = [
                            { label: 'x divides y', fn: function(x, y) { return y % x === 0; } },
                            { label: '|x - y| <= 1', fn: function(x, y) { return Math.abs(x - y) <= 1; } },
                            { label: 'x + y is even', fn: function(x, y) { return (x + y) % 2 === 0; } },
                            { label: 'gcd(x,y) = 1', fn: function(x, y) {
                                var a = Math.abs(x), b = Math.abs(y);
                                while (b) { var t = b; b = a % b; a = t; }
                                return a === 1;
                            }},
                            { label: 'x^2 + y^2 <= 20', fn: function(x, y) { return x*x + y*y <= 20; } }
                        ];

                        var domain = [1,2,3,4,5,6];
                        var predIdx = 0;
                        var highlightMode = 'none'; // 'none', 'row', 'col'
                        var highlightIdx = -1;

                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;';
                        for (var i = 0; i < predicates.length; i++) {
                            var o = document.createElement('option');
                            o.value = i; o.textContent = 'P(x,y): ' + predicates[i].label;
                            sel.appendChild(o);
                        }
                        sel.addEventListener('change', function() {
                            predIdx = parseInt(sel.value);
                            highlightMode = 'none'; highlightIdx = -1;
                            draw();
                        });
                        controls.appendChild(sel);

                        // Click handler: clicking on row label highlights row, col label highlights col
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var n = domain.length;
                            var cellSize = Math.min(42, Math.min((viz.width - 160) / n, (viz.height - 150) / n));
                            var gridL = 80;
                            var gridT = 60;

                            // Check row labels
                            for (var r = 0; r < n; r++) {
                                var ry = gridT + r * cellSize + cellSize / 2;
                                if (mx < gridL && Math.abs(my - ry) < cellSize / 2) {
                                    if (highlightMode === 'row' && highlightIdx === r) {
                                        highlightMode = 'none'; highlightIdx = -1;
                                    } else {
                                        highlightMode = 'row'; highlightIdx = r;
                                    }
                                    draw(); return;
                                }
                            }
                            // Check col labels
                            for (var c = 0; c < n; c++) {
                                var colx = gridL + c * cellSize + cellSize / 2;
                                if (my < gridT && Math.abs(mx - colx) < cellSize / 2) {
                                    if (highlightMode === 'col' && highlightIdx === c) {
                                        highlightMode = 'none'; highlightIdx = -1;
                                    } else {
                                        highlightMode = 'col'; highlightIdx = c;
                                    }
                                    draw(); return;
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pred = predicates[predIdx];
                            var n = domain.length;

                            viz.screenText('P(x, y): "' + pred.label + '"     Domain: {1,...,6}', viz.width / 2, 20, viz.colors.white, 13);
                            viz.screenText('Click row/column headers to highlight', viz.width / 2, 38, viz.colors.text, 10);

                            var cellSize = Math.min(42, Math.min((viz.width - 160) / n, (viz.height - 150) / n));
                            var gridL = 80;
                            var gridT = 60;
                            var gridW = n * cellSize;
                            var gridH = n * cellSize;

                            // Headers
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('y \u2192', gridL + gridW / 2, gridT - 18);

                            ctx.save();
                            ctx.translate(gridL - 25, gridT + gridH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('x \u2192', 0, 0);
                            ctx.restore();

                            // Col headers
                            for (var c = 0; c < n; c++) {
                                var isHL = (highlightMode === 'col' && highlightIdx === c);
                                ctx.font = (isHL ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                ctx.fillStyle = isHL ? viz.colors.blue : viz.colors.text;
                                ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                ctx.fillText(domain[c].toString(), gridL + c * cellSize + cellSize / 2, gridT - 3);
                            }

                            // Row headers and cells
                            var totalTrue = 0;
                            for (var r = 0; r < n; r++) {
                                var isRHL = (highlightMode === 'row' && highlightIdx === r);
                                ctx.font = (isRHL ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                ctx.fillStyle = isRHL ? viz.colors.teal : viz.colors.text;
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(domain[r].toString(), gridL - 6, gridT + r * cellSize + cellSize / 2);

                                for (var c2 = 0; c2 < n; c2++) {
                                    var val = pred.fn(domain[r], domain[c2]);
                                    if (val) totalTrue++;

                                    var cx = gridL + c2 * cellSize;
                                    var cy = gridT + r * cellSize;

                                    var highlighted = (highlightMode === 'row' && highlightIdx === r) ||
                                                      (highlightMode === 'col' && highlightIdx === c2);

                                    ctx.fillStyle = val ? (highlighted ? viz.colors.green + '88' : viz.colors.green + '44')
                                                        : (highlighted ? viz.colors.red + '55' : viz.colors.red + '15');
                                    ctx.fillRect(cx + 1, cy + 1, cellSize - 2, cellSize - 2);

                                    if (highlighted) {
                                        ctx.strokeStyle = viz.colors.white + '44';
                                        ctx.lineWidth = 1;
                                        ctx.strokeRect(cx + 1, cy + 1, cellSize - 2, cellSize - 2);
                                    }

                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillStyle = val ? viz.colors.green : viz.colors.red + '66';
                                    ctx.fillText(val ? 'T' : 'F', cx + cellSize / 2, cy + cellSize / 2);
                                }
                            }

                            // Summary on the right
                            var sumX = gridL + gridW + 15;
                            var sumY = gridT;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Summary:', sumX, sumY);

                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(totalTrue + '/' + (n*n) + ' pairs true', sumX, sumY + 18);

                            // Quantifier verdicts
                            var forallForall = true;
                            var existsExists = false;
                            var forallExists = true;
                            var existsForall = false;

                            for (var rx = 0; rx < n; rx++) {
                                var rowTrue = false;
                                for (var cy2 = 0; cy2 < n; cy2++) {
                                    var v = pred.fn(domain[rx], domain[cy2]);
                                    if (v) { rowTrue = true; existsExists = true; }
                                    else { forallForall = false; }
                                }
                                if (!rowTrue) forallExists = false;
                            }
                            for (var cy3 = 0; cy3 < n; cy3++) {
                                var colAll = true;
                                for (var rx2 = 0; rx2 < n; rx2++) {
                                    if (!pred.fn(domain[rx2], domain[cy3])) colAll = false;
                                }
                                if (colAll) existsForall = true;
                            }

                            var qY = sumY + 42;
                            var qs = [
                                { sym: '\u2200x\u2200y', val: forallForall },
                                { sym: '\u2200x\u2203y', val: forallExists },
                                { sym: '\u2203y\u2200x', val: existsForall },
                                { sym: '\u2203x\u2203y', val: existsExists }
                            ];
                            for (var qi = 0; qi < qs.length; qi++) {
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                ctx.fillStyle = qs[qi].val ? viz.colors.green : viz.colors.red;
                                ctx.fillText(qs[qi].sym + ': ' + (qs[qi].val ? 'T' : 'F'), sumX, qY + qi * 18);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let the domain be the positive integers. Determine the truth value of: (a) \\(\\forall x \\, \\exists y \\, (y > x)\\), (b) \\(\\exists y \\, \\forall x \\, (y > x)\\).',
                    hint: 'For (a), given any \\(x\\), can you find a \\(y > x\\)? For (b), is there a single integer larger than all others?',
                    solution: '(a) True. Given any positive integer \\(x\\), take \\(y = x + 1\\). (b) False. There is no largest positive integer. This illustrates that \\(\\forall x \\, \\exists y\\) and \\(\\exists y \\, \\forall x\\) are not equivalent.'
                },
                {
                    question: 'Express in predicate logic: "Between any two distinct real numbers, there is a rational number." Use \\(Q(z)\\) for "\\(z\\) is rational."',
                    hint: 'You need: for all real \\(x\\), for all real \\(y\\) with \\(x < y\\), there exists \\(z\\) with \\(x < z < y\\) and \\(Q(z)\\).',
                    solution: '\\(\\forall x \\, \\forall y \\, (x < y \\to \\exists z\\,(x < z < y \\wedge Q(z)))\\). This is the density of the rationals in the reals. The quantifier structure is \\(\\forall\\forall\\exists\\), not \\(\\exists\\forall\\forall\\), because the rational \\(z\\) depends on which \\(x, y\\) we pick.'
                },
                {
                    question: 'Show by example that \\(\\forall y \\, \\exists x \\, P(x,y)\\) does not imply \\(\\exists x \\, \\forall y \\, P(x,y)\\).',
                    hint: 'Find a predicate where, for each \\(y\\), a different \\(x\\) works, but no single \\(x\\) works for all \\(y\\).',
                    solution: 'Let \\(P(x,y)\\) be "\\(x = y\\)" over \\(\\{1,2,3\\}\\). Then \\(\\forall y \\, \\exists x \\, (x = y)\\) is true (take \\(x = y\\)). But \\(\\exists x \\, \\forall y \\, (x = y)\\) is false (no single \\(x\\) equals 1, 2, and 3 simultaneously).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead</h2>

<p>Predicate logic gives us the language to state and reason about mathematical claims with precision. Every theorem in this course will ultimately be a quantified statement. Here are some of the ways the tools from this chapter will appear:</p>

<ul>
    <li><strong>Proofs by contradiction</strong>: To prove \\(\\forall x \\, P(x)\\), assume \\(\\exists x \\, \\neg P(x)\\) and derive a contradiction. This is the negation of the universal quantifier at work.</li>
    <li><strong>Definitions</strong>: The formal definition of a function being one-to-one is \\(\\forall x_1 \\, \\forall x_2 \\, (f(x_1) = f(x_2) \\to x_1 = x_2)\\). The definition of onto is \\(\\forall y \\, \\exists x \\, (f(x) = y)\\). Both are quantified predicates.</li>
    <li><strong>Graph theory</strong>: "Every vertex has degree at least 2" is \\(\\forall v \\, (\\deg(v) \\geq 2)\\). "There exists a Hamiltonian cycle" is \\(\\exists C \\, (\\text{C is a cycle visiting every vertex})\\).</li>
    <li><strong>Number theory</strong>: "\\(n\\) is prime" means \\(n > 1 \\wedge \\forall d\\,(1 < d < n \\to d \\nmid n)\\). Goldbach's conjecture is \\(\\forall n\\,(n > 2 \\wedge n \\text{ even} \\to \\exists p \\, \\exists q\\,(p,q \\text{ prime} \\wedge p + q = n))\\).</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Remark: Beyond First-Order Logic</div>
    <div class="env-body">
        <p>First-order logic quantifies over <em>elements</em> of the domain. Second-order logic allows quantification over <em>sets</em> or <em>predicates</em> themselves (e.g., "for every property \\(P\\)..."). Most of discrete mathematics stays within first-order logic, which is both expressively powerful and has nice metalogical properties (completeness, compactness). We will not need second-order logic in this course, but it is good to know the boundary exists.</p>
    </div>
</div>

<p>With the language of predicates and quantifiers established, we now have the precision to state theorems and construct proofs. The next chapter introduces the methods of proof that will carry us through the rest of the course.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Express the following in predicate logic with quantifiers: "No student in this class has been to every country in the world." Let \\(S(x)\\) mean "\\(x\\) is a student in this class" and \\(V(x,c)\\) mean "\\(x\\) has visited country \\(c\\)."',
                    hint: 'First write "some student has visited every country," then negate it.',
                    solution: 'The claim "some student has visited every country" is \\(\\exists x \\, (S(x) \\wedge \\forall c \\, V(x,c))\\). Its negation is \\(\\neg \\exists x \\, (S(x) \\wedge \\forall c \\, V(x,c)) \\equiv \\forall x \\, (S(x) \\to \\exists c \\, \\neg V(x,c))\\). In English: "For every student in this class, there is some country they have not visited."'
                },
                {
                    question: 'Translate to English and determine the truth value (domain: all real numbers): \\(\\forall x \\, \\exists y \\, (x = y^2)\\).',
                    hint: 'Can every real number be expressed as a perfect square of some real number? What about negative numbers?',
                    solution: 'English: "For every real number \\(x\\), there is a real number \\(y\\) such that \\(x = y^2\\)." This is FALSE: if \\(x = -1\\), then \\(y^2 = -1\\) has no real solution. The statement would be true over \\(\\{x \\in \\mathbb{R} : x \\geq 0\\}\\).'
                },
                {
                    question: 'Write the formal definition of a function \\(f: A \\to B\\) being a bijection using quantifiers, combining the conditions for injective and surjective.',
                    hint: 'Injective: \\(\\forall a_1, a_2 \\in A\\), \\(f(a_1) = f(a_2) \\to a_1 = a_2\\). Surjective: \\(\\forall b \\in B\\), \\(\\exists a \\in A\\), \\(f(a) = b\\).',
                    solution: '\\(f\\) is a bijection iff: \\[\\bigl(\\forall a_1 \\, \\forall a_2 \\, (f(a_1) = f(a_2) \\to a_1 = a_2)\\bigr) \\wedge \\bigl(\\forall b \\, \\exists a \\, (f(a) = b)\\bigr).\\] Equivalently: \\(\\forall b \\, \\exists! a \\, (f(a) = b)\\), where \\(\\exists!\\) means "there exists a unique." Each element of \\(B\\) has exactly one preimage.'
                }
            ]
        }
    ]
});
