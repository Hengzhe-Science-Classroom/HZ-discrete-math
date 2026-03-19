window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch14',
    number: 14,
    title: 'Divisibility & Primes',
    subtitle: 'The building blocks of integers',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Number Theory?</h2>

<div class="env-block intuition">
    <div class="env-title">An Ancient Subject with Modern Power</div>
    <div class="env-body">
        <p>Number theory was once considered the purest, most useless branch of mathematics. Gauss called it "the queen of mathematics." Hardy boasted that nothing he had ever done in number theory could be applied to warfare or commerce. Yet today, every time you make an online purchase, your credit card number is protected by algorithms rooted in the very theorems Hardy studied: the difficulty of factoring large integers and the arithmetic of primes.</p>
    </div>
</div>

<p>This chapter develops the core of elementary number theory: divisibility, the Euclidean algorithm, prime factorization, and the Chinese Remainder Theorem. These ideas are the foundation for modular arithmetic (Chapter 15) and RSA cryptography (Chapter 16).</p>

<h3>What We Will Cover</h3>

<ol>
    <li><strong>Divisibility</strong>: what it means for one integer to divide another, and the Division Algorithm.</li>
    <li><strong>GCD and LCM</strong>: the Euclidean algorithm and Bezout's identity.</li>
    <li><strong>Prime numbers</strong>: the Fundamental Theorem of Arithmetic, the infinitude of primes, and the Sieve of Eratosthenes.</li>
    <li><strong>The Extended Euclidean Algorithm</strong>: finding integer solutions to \\(ax + by = \\gcd(a, b)\\).</li>
    <li><strong>The Chinese Remainder Theorem</strong>: solving systems of simultaneous congruences.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Euclid's <em>Elements</em> (c. 300 BCE) contains the first known proof that there are infinitely many primes, along with the algorithm for computing greatest common divisors that still bears his name. The Chinese Remainder Theorem appears in Sun Tzu's <em>Sunzi Suanjing</em> (3rd century CE). These results are among the oldest in all of mathematics, yet they remain central to modern computer science and cryptography.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Divisibility
        // ================================================================
        {
            id: 'sec-divisibility',
            title: 'Divisibility',
            content: `
<h2>Divisibility</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Divides)</div>
    <div class="env-body">
        <p>Let \\(a\\) and \\(b\\) be integers with \\(a \\neq 0\\). We say that \\(a\\) <strong>divides</strong> \\(b\\), written \\(a \\mid b\\), if there exists an integer \\(k\\) such that \\(b = ak\\). We also say \\(a\\) is a <strong>divisor</strong> or <strong>factor</strong> of \\(b\\), and \\(b\\) is a <strong>multiple</strong> of \\(a\\).</p>
        <p>If \\(a\\) does not divide \\(b\\), we write \\(a \\nmid b\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>\\(3 \\mid 12\\) because \\(12 = 3 \\cdot 4\\). But \\(5 \\nmid 12\\) because no integer \\(k\\) satisfies \\(12 = 5k\\).</p>
        <p>Note: every nonzero integer divides 0, since \\(0 = a \\cdot 0\\). Also, \\(1 \\mid b\\) for every integer \\(b\\).</p>
    </div>
</div>

<h3>Basic Properties</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.1 (Divisibility Properties)</div>
    <div class="env-body">
        <p>Let \\(a, b, c\\) be integers with \\(a \\neq 0\\). Then:</p>
        <ol>
            <li><strong>Transitivity:</strong> If \\(a \\mid b\\) and \\(b \\mid c\\), then \\(a \\mid c\\).</li>
            <li><strong>Linear combination:</strong> If \\(a \\mid b\\) and \\(a \\mid c\\), then \\(a \\mid (mb + nc)\\) for all integers \\(m, n\\).</li>
            <li><strong>Comparison:</strong> If \\(a \\mid b\\) and \\(b \\neq 0\\), then \\(|a| \\leq |b|\\).</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>(1) If \\(b = ak_1\\) and \\(c = bk_2\\), then \\(c = a(k_1 k_2)\\), so \\(a \\mid c\\).</p>
        <p>(2) If \\(b = ak_1\\) and \\(c = ak_2\\), then \\(mb + nc = a(mk_1 + nk_2)\\), so \\(a \\mid (mb + nc)\\).</p>
        <p>(3) If \\(b = ak\\) and \\(b \\neq 0\\), then \\(k \\neq 0\\), so \\(|k| \\geq 1\\), giving \\(|b| = |a| \\cdot |k| \\geq |a|\\).</p>
    </div>
    <div class="qed"></div>
</div>

<h3>The Division Algorithm</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.2 (Division Algorithm)</div>
    <div class="env-body">
        <p>Let \\(a\\) be an integer and \\(d\\) a positive integer. Then there exist <strong>unique</strong> integers \\(q\\) (the <strong>quotient</strong>) and \\(r\\) (the <strong>remainder</strong>) such that</p>
        \\[a = dq + r, \\quad 0 \\leq r < d.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Existence)</div>
    <div class="env-body">
        <p>Consider the set \\(S = \\{a - dk : k \\in \\mathbb{Z},\\; a - dk \\geq 0\\}\\). This set is nonempty (take \\(k\\) sufficiently negative). By the well-ordering principle, \\(S\\) has a smallest element \\(r = a - dq\\) for some integer \\(q\\). Then \\(r \\geq 0\\) by construction. If \\(r \\geq d\\), then \\(r - d = a - d(q+1) \\geq 0\\), contradicting the minimality of \\(r\\). So \\(0 \\leq r < d\\).</p>
    </div>
    <div class="qed"></div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Dividing \\(a = 37\\) by \\(d = 5\\): \\(37 = 5 \\cdot 7 + 2\\), so \\(q = 7\\) and \\(r = 2\\).</p>
        <p>Dividing \\(a = -14\\) by \\(d = 3\\): \\(-14 = 3 \\cdot (-5) + 1\\), so \\(q = -5\\) and \\(r = 1\\). Note that the remainder is always non-negative.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-divisibility-table"></div>
`,
            visualizations: [
                {
                    id: 'viz-divisibility-table',
                    title: 'Divisibility Table',
                    description: 'A color-coded table showing which numbers from 1 to N are divisible by which divisors. Each cell is colored if the column number divides the row number. Patterns of multiples become immediately visible.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 460,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 30;
                        var highlightDiv = 0;

                        VizEngine.createSlider(controls, 'N', 10, 40, N, 1, function(v) {
                            N = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Highlight divisor', 0, 12, 0, 1, function(v) {
                            highlightDiv = Math.round(v);
                            draw();
                        });

                        var palette = [
                            viz.colors.blue, viz.colors.teal, viz.colors.green,
                            viz.colors.orange, viz.colors.purple, viz.colors.red,
                            viz.colors.yellow, viz.colors.pink
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Divisibility Table (1 to ' + N + ')', viz.width / 2, 16, viz.colors.white, 14);

                            var cols = Math.min(N, 15);
                            var rows = Math.ceil(N / cols);
                            var cellSize = Math.min(
                                Math.floor((viz.width - 60) / cols),
                                Math.floor((viz.height - 50) / rows),
                                36
                            );
                            var startX = (viz.width - cols * cellSize) / 2;
                            var startY = 36;

                            for (var i = 1; i <= N; i++) {
                                var row = Math.floor((i - 1) / cols);
                                var col = (i - 1) % cols;
                                var x = startX + col * cellSize;
                                var y = startY + row * cellSize;

                                // Count divisors of i
                                var divCount = 0;
                                for (var d = 1; d <= i; d++) {
                                    if (i % d === 0) divCount++;
                                }

                                // Determine color
                                var isPrime = (i > 1 && divCount === 2);
                                var bgColor;

                                if (highlightDiv > 0) {
                                    if (i % highlightDiv === 0) {
                                        bgColor = palette[(highlightDiv - 1) % palette.length] + 'cc';
                                    } else {
                                        bgColor = viz.colors.grid;
                                    }
                                } else if (isPrime) {
                                    bgColor = viz.colors.blue + 'aa';
                                } else if (i === 1) {
                                    bgColor = viz.colors.purple + '66';
                                } else {
                                    // Shade by number of divisors
                                    var t = Math.min(divCount / 8, 1);
                                    var r = Math.round(26 + t * 50);
                                    var g = Math.round(26 + t * 30);
                                    var b = Math.round(64 + t * 40);
                                    bgColor = 'rgb(' + r + ',' + g + ',' + b + ')';
                                }

                                ctx.fillStyle = bgColor;
                                ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

                                // Number label
                                ctx.fillStyle = isPrime && highlightDiv === 0 ? viz.colors.white : viz.colors.text;
                                ctx.font = (cellSize > 24 ? '12' : '9') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), x + cellSize / 2, y + cellSize / 2);
                            }

                            // Legend
                            var legY = startY + rows * cellSize + 12;
                            if (highlightDiv > 0) {
                                viz.screenText(
                                    'Multiples of ' + highlightDiv + ' highlighted (' + Math.floor(N / highlightDiv) + ' multiples)',
                                    viz.width / 2, legY, viz.colors.white, 12
                                );
                            } else {
                                ctx.fillStyle = viz.colors.blue + 'aa';
                                ctx.fillRect(viz.width / 2 - 120, legY - 6, 12, 12);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('Prime', viz.width / 2 - 104, legY);
                                ctx.fillStyle = viz.colors.purple + '66';
                                ctx.fillRect(viz.width / 2 + 10, legY - 6, 12, 12);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('1 (unit)', viz.width / 2 + 26, legY);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('Darker = more divisors', viz.width / 2 - 60, legY + 18);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that if \\(a \\mid b\\) and \\(b \\mid a\\), then \\(a = \\pm b\\).',
                    hint: 'Write \\(b = ak_1\\) and \\(a = bk_2\\), then substitute.',
                    solution: 'If \\(b = ak_1\\) and \\(a = bk_2\\), then \\(a = ak_1 k_2\\), so \\(k_1 k_2 = 1\\). Since \\(k_1, k_2\\) are integers, \\(k_1 = k_2 = 1\\) or \\(k_1 = k_2 = -1\\). Thus \\(a = b\\) or \\(a = -b\\).'
                },
                {
                    question: 'Use the Division Algorithm to find the quotient and remainder when \\(a = -101\\) is divided by \\(d = 7\\).',
                    hint: 'Remember the remainder must satisfy \\(0 \\leq r < 7\\).',
                    solution: '\\(-101 = 7 \\cdot (-15) + 4\\), since \\(7 \\times (-15) = -105\\) and \\(-101 - (-105) = 4\\). So \\(q = -15\\) and \\(r = 4\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: GCD & LCM
        // ================================================================
        {
            id: 'sec-gcd',
            title: 'GCD & LCM',
            content: `
<h2>GCD & LCM</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Greatest Common Divisor)</div>
    <div class="env-body">
        <p>The <strong>greatest common divisor</strong> of integers \\(a\\) and \\(b\\), not both zero, is the largest positive integer \\(d\\) that divides both \\(a\\) and \\(b\\). We write \\(d = \\gcd(a, b)\\).</p>
        <p>If \\(\\gcd(a, b) = 1\\), we say \\(a\\) and \\(b\\) are <strong>coprime</strong> (or <strong>relatively prime</strong>).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Least Common Multiple)</div>
    <div class="env-body">
        <p>The <strong>least common multiple</strong> of positive integers \\(a\\) and \\(b\\) is the smallest positive integer \\(m\\) that is divisible by both \\(a\\) and \\(b\\). We write \\(m = \\operatorname{lcm}(a, b)\\).</p>
    </div>
</div>

<h3>The Euclidean Algorithm</h3>

<div class="env-block intuition">
    <div class="env-title">Key Insight</div>
    <div class="env-body">
        <p>The Euclidean algorithm rests on one fact: \\(\\gcd(a, b) = \\gcd(b, a \\bmod b)\\). Each step reduces the problem to smaller numbers, and the process terminates when the remainder is 0. The last nonzero remainder is the GCD.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.3 (Euclidean Algorithm)</div>
    <div class="env-body">
        <p>For positive integers \\(a\\) and \\(b\\) with \\(a > b\\), apply the Division Algorithm repeatedly:</p>
        \\[\\begin{aligned}
        a &= bq_1 + r_1, \\quad 0 \\leq r_1 < b, \\\\
        b &= r_1 q_2 + r_2, \\quad 0 \\leq r_2 < r_1, \\\\
        r_1 &= r_2 q_3 + r_3, \\quad 0 \\leq r_3 < r_2, \\\\
        &\\;\\vdots \\\\
        r_{n-1} &= r_n q_{n+1} + 0.
        \\end{aligned}\\]
        <p>The last nonzero remainder \\(r_n = \\gcd(a, b)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: \\(\\gcd(252, 198)\\)</div>
    <div class="env-body">
        \\[\\begin{aligned}
        252 &= 198 \\cdot 1 + 54, \\\\
        198 &= 54 \\cdot 3 + 36, \\\\
        54 &= 36 \\cdot 1 + 18, \\\\
        36 &= 18 \\cdot 2 + 0.
        \\end{aligned}\\]
        <p>So \\(\\gcd(252, 198) = 18\\).</p>
    </div>
</div>

<h3>The GCD-LCM Relationship</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.4</div>
    <div class="env-body">
        <p>For positive integers \\(a\\) and \\(b\\):</p>
        \\[\\gcd(a, b) \\cdot \\operatorname{lcm}(a, b) = a \\cdot b.\\]
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.5 (Bezout's Identity)</div>
    <div class="env-body">
        <p>For any integers \\(a\\) and \\(b\\), not both zero, there exist integers \\(x\\) and \\(y\\) such that</p>
        \\[ax + by = \\gcd(a, b).\\]
        <p>Moreover, \\(\\gcd(a, b)\\) is the smallest positive integer that can be expressed as a linear combination \\(ax + by\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euclidean-algorithm"></div>
<div class="viz-placeholder" data-viz="viz-gcd-lcm-venn"></div>
`,
            visualizations: [
                {
                    id: 'viz-euclidean-algorithm',
                    title: 'Euclidean Algorithm Step-by-Step',
                    description: 'Enter two positive integers and watch the Euclidean algorithm compute their GCD step by step. Each row shows one application of the Division Algorithm.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 600, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 252, b = 198;
                        var steps = [];
                        var animStep = -1;
                        var animating = false;

                        VizEngine.createSlider(controls, 'a', 2, 500, a, 1, function(v) {
                            a = Math.round(v);
                            compute();
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 2, 500, b, 1, function(v) {
                            b = Math.round(v);
                            compute();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animStep = 0;
                            draw();
                            var timer = setInterval(function() {
                                animStep++;
                                draw();
                                if (animStep >= steps.length) {
                                    clearInterval(timer);
                                    animating = false;
                                }
                            }, 800);
                        });

                        function compute() {
                            steps = [];
                            animStep = -1;
                            var x = Math.max(a, b);
                            var y = Math.min(a, b);
                            if (y === 0) { steps.push({ a: x, b: 0, q: 0, r: 0 }); return; }
                            while (y > 0) {
                                var q = Math.floor(x / y);
                                var r = x - q * y;
                                steps.push({ a: x, b: y, q: q, r: r });
                                x = y;
                                y = r;
                            }
                        }
                        compute();

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var gcdVal = steps.length > 0 ? steps[steps.length - 1].b || steps[steps.length - 1].a : 1;
                            if (steps.length > 0 && steps[steps.length - 1].r === 0 && steps.length > 1) {
                                gcdVal = steps[steps.length - 1].b;
                            } else if (steps.length === 1) {
                                gcdVal = steps[0].b > 0 ? steps[0].b : steps[0].a;
                            }
                            // Recompute gcd properly
                            var ga = Math.max(a, b), gb = Math.min(a, b);
                            while (gb > 0) { var tmp = gb; gb = ga % gb; ga = tmp; }
                            gcdVal = ga;

                            viz.screenText('Euclidean Algorithm: gcd(' + a + ', ' + b + ')', viz.width / 2, 18, viz.colors.white, 15);

                            var showCount = animStep >= 0 ? Math.min(animStep + 1, steps.length) : steps.length;
                            var rowH = Math.min(36, (viz.height - 80) / Math.max(steps.length, 1));
                            var startY = 48;

                            // Header
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Step', 40, startY);
                            ctx.fillText('Equation', viz.width / 2, startY);

                            for (var i = 0; i < showCount; i++) {
                                var s = steps[i];
                                var y = startY + (i + 1) * rowH;
                                var isLast = (i === steps.length - 1);
                                var isCurrent = (animStep >= 0 && i === animStep);

                                if (isCurrent) {
                                    ctx.fillStyle = viz.colors.teal + '22';
                                    ctx.fillRect(10, y - rowH / 2 + 2, viz.width - 20, rowH - 4);
                                }

                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = isCurrent ? viz.colors.teal : viz.colors.text;
                                ctx.fillText((i + 1).toString(), 40, y);

                                var eq = s.a + ' = ' + s.b + ' \u00D7 ' + s.q + ' + ' + s.r;
                                ctx.font = (isCurrent ? 'bold ' : '') + '13px -apple-system,sans-serif';
                                ctx.fillStyle = isCurrent ? viz.colors.white : viz.colors.text;
                                ctx.fillText(eq, viz.width / 2, y);

                                if (isLast && s.r === 0) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.fillText('\u2190 remainder is 0, done!', viz.width / 2 + 180, y);
                                }
                            }

                            // Result
                            if (showCount >= steps.length) {
                                var resultY = startY + (steps.length + 1.5) * rowH;
                                viz.screenText(
                                    'gcd(' + a + ', ' + b + ') = ' + gcdVal,
                                    viz.width / 2, resultY, viz.colors.green, 16
                                );
                                viz.screenText(
                                    'lcm(' + a + ', ' + b + ') = ' + (a * b / gcdVal),
                                    viz.width / 2, resultY + 24, viz.colors.teal, 13
                                );
                                viz.screenText(
                                    'since gcd \u00D7 lcm = ' + a + ' \u00D7 ' + b + ' = ' + (a * b),
                                    viz.width / 2, resultY + 44, viz.colors.text, 11
                                );
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-gcd-lcm-venn',
                    title: 'GCD & LCM via Prime Factorization',
                    description: 'Visualize gcd and lcm as the intersection and union of prime factorizations. The Venn diagram shows shared and unshared prime factors between two numbers.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 600, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 60, b = 84;

                        VizEngine.createSlider(controls, 'a', 2, 200, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 2, 200, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function factorize(n) {
                            var factors = {};
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) {
                                    factors[d] = (factors[d] || 0) + 1;
                                    n = Math.floor(n / d);
                                }
                                d++;
                            }
                            if (n > 1) factors[n] = (factors[n] || 0) + 1;
                            return factors;
                        }

                        function factorStr(factors) {
                            var parts = [];
                            var primes = Object.keys(factors).map(Number).sort(function(x, y) { return x - y; });
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (factors[p] === 1) parts.push(p.toString());
                                else parts.push(p + '^' + factors[p]);
                            }
                            return parts.join(' \u00D7 ') || '1';
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var fa = factorize(a);
                            var fb = factorize(b);
                            var allPrimes = {};
                            for (var p in fa) allPrimes[p] = true;
                            for (var p in fb) allPrimes[p] = true;
                            var primes = Object.keys(allPrimes).map(Number).sort(function(x, y) { return x - y; });

                            // Compute gcd and lcm factor maps
                            var gcdFactors = {};
                            var lcmFactors = {};
                            var onlyA = {};
                            var onlyB = {};
                            var shared = {};

                            for (var i = 0; i < primes.length; i++) {
                                var pr = primes[i];
                                var ea = fa[pr] || 0;
                                var eb = fb[pr] || 0;
                                gcdFactors[pr] = Math.min(ea, eb);
                                lcmFactors[pr] = Math.max(ea, eb);
                                if (Math.min(ea, eb) > 0) shared[pr] = Math.min(ea, eb);
                                if (ea > Math.min(ea, eb)) onlyA[pr] = ea - Math.min(ea, eb);
                                if (eb > Math.min(ea, eb)) onlyB[pr] = eb - Math.min(ea, eb);
                            }

                            // Title
                            viz.screenText('Prime Factorization Venn Diagram', viz.width / 2, 18, viz.colors.white, 14);

                            // Factorization lines
                            viz.screenText(a + ' = ' + factorStr(fa), viz.width / 2, 42, viz.colors.blue, 12);
                            viz.screenText(b + ' = ' + factorStr(fb), viz.width / 2, 60, viz.colors.orange, 12);

                            // Draw Venn circles
                            var cx1 = viz.width / 2 - 90;
                            var cx2 = viz.width / 2 + 90;
                            var cy = 190;
                            var rad = 120;

                            ctx.globalAlpha = 0.15;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(cx1, cy, rad, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(cx2, cy, rad, 0, Math.PI * 2); ctx.fill();
                            ctx.globalAlpha = 1;

                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(cx1, cy, rad, 0, Math.PI * 2); ctx.stroke();
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(cx2, cy, rad, 0, Math.PI * 2); ctx.stroke();

                            // Labels
                            viz.screenText(a.toString(), cx1 - 60, cy - rad + 20, viz.colors.blue, 14);
                            viz.screenText(b.toString(), cx2 + 60, cy - rad + 20, viz.colors.orange, 14);

                            // List factors in each region
                            function factorList(fmap) {
                                var items = [];
                                var ps = Object.keys(fmap).map(Number).sort(function(x, y) { return x - y; });
                                for (var i = 0; i < ps.length; i++) {
                                    var pr = ps[i];
                                    if (fmap[pr] <= 0) continue;
                                    for (var j = 0; j < fmap[pr]; j++) items.push(pr.toString());
                                }
                                return items;
                            }

                            var onlyAList = factorList(onlyA);
                            var onlyBList = factorList(onlyB);
                            var sharedList = factorList(shared);

                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';

                            // Only A (left region)
                            ctx.fillStyle = viz.colors.blue;
                            for (var i = 0; i < onlyAList.length; i++) {
                                ctx.fillText(onlyAList[i], cx1 - 60, cy - 20 + i * 22);
                            }
                            if (onlyAList.length === 0) {
                                ctx.fillStyle = viz.colors.text + '66';
                                ctx.fillText('(none)', cx1 - 60, cy);
                            }

                            // Shared (middle)
                            ctx.fillStyle = viz.colors.green;
                            for (var i = 0; i < sharedList.length; i++) {
                                ctx.fillText(sharedList[i], viz.width / 2, cy - 20 + i * 22);
                            }
                            if (sharedList.length === 0) {
                                ctx.fillStyle = viz.colors.text + '66';
                                ctx.fillText('(none)', viz.width / 2, cy);
                            }

                            // Only B (right region)
                            ctx.fillStyle = viz.colors.orange;
                            for (var i = 0; i < onlyBList.length; i++) {
                                ctx.fillText(onlyBList[i], cx2 + 60, cy - 20 + i * 22);
                            }
                            if (onlyBList.length === 0) {
                                ctx.fillStyle = viz.colors.text + '66';
                                ctx.fillText('(none)', cx2 + 60, cy);
                            }

                            // GCD and LCM results
                            var gcdVal = 1, lcmVal = 1;
                            for (var i = 0; i < primes.length; i++) {
                                var pr = primes[i];
                                gcdVal *= Math.pow(pr, gcdFactors[pr] || 0);
                                lcmVal *= Math.pow(pr, lcmFactors[pr] || 0);
                            }

                            var resY = cy + rad + 24;
                            viz.screenText('gcd(' + a + ', ' + b + ') = ' + gcdVal + '  (intersection: min of exponents)', viz.width / 2, resY, viz.colors.green, 13);
                            viz.screenText('lcm(' + a + ', ' + b + ') = ' + lcmVal + '  (union: max of exponents)', viz.width / 2, resY + 22, viz.colors.teal, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the Euclidean algorithm to compute \\(\\gcd(1071, 462)\\).',
                    hint: 'Apply the Division Algorithm repeatedly: \\(1071 = 462 \\cdot q + r\\), then replace the larger number with the smaller and repeat.',
                    solution: '\\(1071 = 462 \\cdot 2 + 147\\), \\(462 = 147 \\cdot 3 + 21\\), \\(147 = 21 \\cdot 7 + 0\\). So \\(\\gcd(1071, 462) = 21\\).'
                },
                {
                    question: 'Prove that if \\(a\\) and \\(b\\) are coprime and \\(a \\mid bc\\), then \\(a \\mid c\\).',
                    hint: 'Use Bezout\'s identity: since \\(\\gcd(a, b) = 1\\), there exist \\(x, y\\) with \\(ax + by = 1\\). Multiply both sides by \\(c\\).',
                    solution: 'By Bezout, \\(ax + by = 1\\) for some integers \\(x, y\\). Multiplying by \\(c\\): \\(acx + bcy = c\\). Since \\(a \\mid acx\\) (trivially) and \\(a \\mid bcy\\) (because \\(a \\mid bc\\)), we get \\(a \\mid c\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Prime Numbers
        // ================================================================
        {
            id: 'sec-primes',
            title: 'Prime Numbers',
            content: `
<h2>Prime Numbers</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Prime and Composite)</div>
    <div class="env-body">
        <p>An integer \\(p > 1\\) is <strong>prime</strong> if its only positive divisors are 1 and \\(p\\) itself. An integer \\(n > 1\\) that is not prime is called <strong>composite</strong>.</p>
        <p>By convention, 1 is neither prime nor composite.</p>
    </div>
</div>

<h3>The Fundamental Theorem of Arithmetic</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.6 (Fundamental Theorem of Arithmetic)</div>
    <div class="env-body">
        <p>Every integer \\(n > 1\\) can be written as a product of primes</p>
        \\[n = p_1^{e_1} p_2^{e_2} \\cdots p_k^{e_k}\\]
        <p>where \\(p_1 < p_2 < \\cdots < p_k\\) are primes and \\(e_i \\geq 1\\). This representation is <strong>unique</strong> up to the order of the factors.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p><strong>Existence</strong> (by strong induction): If \\(n\\) is prime, we are done. Otherwise, \\(n = ab\\) with \\(1 < a, b < n\\). By the inductive hypothesis, both \\(a\\) and \\(b\\) have prime factorizations, so \\(n\\) does too.</p>
        <p><strong>Uniqueness</strong>: Suppose \\(n = p_1 p_2 \\cdots p_r = q_1 q_2 \\cdots q_s\\). Since \\(p_1 \\mid q_1 q_2 \\cdots q_s\\) and \\(p_1\\) is prime, \\(p_1 \\mid q_j\\) for some \\(j\\). Since \\(q_j\\) is also prime, \\(p_1 = q_j\\). Cancel and repeat by induction.</p>
    </div>
    <div class="qed"></div>
</div>

<h3>Infinitude of Primes</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.7 (Euclid)</div>
    <div class="env-body">
        <p>There are infinitely many prime numbers.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Suppose for contradiction that there are only finitely many primes: \\(p_1, p_2, \\ldots, p_n\\). Consider \\(N = p_1 p_2 \\cdots p_n + 1\\). For each \\(i\\), dividing \\(N\\) by \\(p_i\\) leaves remainder 1, so no \\(p_i\\) divides \\(N\\). But by the Fundamental Theorem, \\(N\\) has a prime factor, which must be a prime not in our list. Contradiction.</p>
    </div>
    <div class="qed"></div>
</div>

<h3>The Sieve of Eratosthenes</h3>

<p>To find all primes up to \\(N\\), start with a list of integers from 2 to \\(N\\). The smallest unmarked number is prime; cross out all its multiples. Repeat. We only need to sieve up to \\(\\sqrt{N}\\), because any composite \\(n \\leq N\\) has a prime factor \\(\\leq \\sqrt{N}\\).</p>

<div class="viz-placeholder" data-viz="viz-sieve-eratosthenes"></div>
<div class="viz-placeholder" data-viz="viz-factor-tree"></div>
`,
            visualizations: [
                {
                    id: 'viz-sieve-eratosthenes',
                    title: 'Sieve of Eratosthenes',
                    description: 'Watch the sieve progressively eliminate composite numbers. Primes survive the sieve and are highlighted. Click "Step" to advance one prime at a time, or "Run" to animate the full sieve.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 100;
                        var sieved = [];  // 0 = unmarked, 1 = prime, 2 = crossed out
                        var currentPrime = 0;
                        var sieveComplete = false;
                        var animTimer = null;

                        VizEngine.createSlider(controls, 'N', 30, 200, N, 10, function(v) {
                            N = Math.round(v);
                            reset();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Step', function() {
                            stepSieve();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Run', function() {
                            if (animTimer) return;
                            animTimer = setInterval(function() {
                                if (sieveComplete) {
                                    clearInterval(animTimer);
                                    animTimer = null;
                                    return;
                                }
                                stepSieve();
                                draw();
                            }, 400);
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            reset();
                            draw();
                        });

                        function reset() {
                            sieved = new Array(N + 1).fill(0);
                            sieved[0] = 2; sieved[1] = 2;
                            currentPrime = 0;
                            sieveComplete = false;
                        }
                        reset();

                        function stepSieve() {
                            if (sieveComplete) return;
                            // Find next unmarked number >= 2
                            var p = currentPrime === 0 ? 2 : currentPrime + 1;
                            while (p <= N && sieved[p] !== 0) p++;
                            if (p > N || p * p > N) {
                                // Mark all remaining unmarked as prime
                                for (var i = 2; i <= N; i++) {
                                    if (sieved[i] === 0) sieved[i] = 1;
                                }
                                sieveComplete = true;
                                return;
                            }
                            sieved[p] = 1; // mark as prime
                            currentPrime = p;
                            // Cross out multiples
                            for (var m = p * p; m <= N; m += p) {
                                if (sieved[m] === 0) sieved[m] = 2;
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Sieve of Eratosthenes (2 to ' + N + ')', viz.width / 2, 16, viz.colors.white, 14);

                            var cols = Math.ceil(Math.sqrt(N * 1.5));
                            if (cols > 20) cols = 20;
                            var rows = Math.ceil(N / cols);
                            var cellSize = Math.min(
                                Math.floor((viz.width - 40) / cols),
                                Math.floor((viz.height - 70) / rows),
                                30
                            );
                            var startX = (viz.width - cols * cellSize) / 2;
                            var startY = 36;

                            for (var i = 2; i <= N; i++) {
                                var row = Math.floor((i - 2) / cols);
                                var col = (i - 2) % cols;
                                var x = startX + col * cellSize;
                                var y = startY + row * cellSize;

                                var state = sieved[i];
                                if (state === 1) {
                                    // Prime
                                    ctx.fillStyle = viz.colors.blue + 'cc';
                                    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                    ctx.fillStyle = viz.colors.white;
                                } else if (state === 2) {
                                    // Crossed out
                                    ctx.fillStyle = '#1a1a2e';
                                    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                    ctx.fillStyle = viz.colors.text + '44';
                                } else {
                                    // Unmarked
                                    ctx.fillStyle = viz.colors.grid;
                                    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                    ctx.fillStyle = viz.colors.text;
                                }

                                ctx.font = (cellSize > 22 ? '11' : '8') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), x + cellSize / 2, y + cellSize / 2);

                                // Strike-through for crossed out
                                if (state === 2) {
                                    ctx.strokeStyle = viz.colors.red + '44';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(x + 3, y + cellSize / 2);
                                    ctx.lineTo(x + cellSize - 3, y + cellSize / 2);
                                    ctx.stroke();
                                }
                            }

                            // Status
                            var primeCount = 0;
                            for (var i = 2; i <= N; i++) {
                                if (sieved[i] === 1) primeCount++;
                            }
                            var statusY = startY + rows * cellSize + 14;
                            if (sieveComplete) {
                                viz.screenText(primeCount + ' primes found up to ' + N, viz.width / 2, statusY, viz.colors.green, 13);
                            } else if (currentPrime > 0) {
                                viz.screenText('Sieving multiples of ' + currentPrime + '...  (' + primeCount + ' primes so far)', viz.width / 2, statusY, viz.colors.teal, 12);
                            } else {
                                viz.screenText('Click Step or Run to begin', viz.width / 2, statusY, viz.colors.muted, 12);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-factor-tree',
                    title: 'Prime Factorization Tree',
                    description: 'Enter any number and see its prime factorization displayed as a tree. Each internal node splits into two factors until all leaves are prime.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 600, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var num = 360;
                        VizEngine.createSlider(controls, 'Number', 2, 1000, num, 1, function(v) {
                            num = Math.round(v);
                            draw();
                        });

                        function isPrime(n) {
                            if (n < 2) return false;
                            if (n < 4) return true;
                            if (n % 2 === 0 || n % 3 === 0) return false;
                            for (var i = 5; i * i <= n; i += 6) {
                                if (n % i === 0 || n % (i + 2) === 0) return false;
                            }
                            return true;
                        }

                        function smallestFactor(n) {
                            if (n % 2 === 0) return 2;
                            for (var i = 3; i * i <= n; i += 2) {
                                if (n % i === 0) return i;
                            }
                            return n;
                        }

                        function buildTree(n) {
                            if (isPrime(n) || n <= 1) return { val: n, left: null, right: null };
                            var f = smallestFactor(n);
                            return { val: n, left: buildTree(f), right: buildTree(n / f) };
                        }

                        function treeDepth(node) {
                            if (!node || (!node.left && !node.right)) return 0;
                            return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
                        }

                        function treeLeaves(node) {
                            if (!node) return 0;
                            if (!node.left && !node.right) return 1;
                            return treeLeaves(node.left) + treeLeaves(node.right);
                        }

                        function drawNode(ctx, node, x, y, xSpan, level, maxDepth) {
                            if (!node) return;
                            var isLeaf = !node.left && !node.right;
                            var r = 16;

                            // Draw connections to children
                            var childY = y + 60;
                            if (node.left) {
                                var lx = x - xSpan / 2;
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(x, y + r);
                                ctx.lineTo(lx, childY - r);
                                ctx.stroke();
                                drawNode(ctx, node.left, lx, childY, xSpan / 2, level + 1, maxDepth);
                            }
                            if (node.right) {
                                var rx = x + xSpan / 2;
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(x, y + r);
                                ctx.lineTo(rx, childY - r);
                                ctx.stroke();
                                drawNode(ctx, node.right, rx, childY, xSpan / 2, level + 1, maxDepth);
                            }

                            // Draw node
                            ctx.fillStyle = isLeaf ? viz.colors.blue + 'cc' : viz.colors.grid;
                            ctx.beginPath();
                            ctx.arc(x, y, r, 0, Math.PI * 2);
                            ctx.fill();
                            if (isLeaf) {
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(x, y, r, 0, Math.PI * 2);
                                ctx.stroke();
                            }

                            ctx.fillStyle = isLeaf ? viz.colors.white : viz.colors.text;
                            ctx.font = (node.val > 999 ? '9' : (node.val > 99 ? '10' : '12')) + 'px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(node.val.toString(), x, y);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            if (num < 2) {
                                viz.screenText('Enter a number >= 2', viz.width / 2, viz.height / 2, viz.colors.muted, 14);
                                return;
                            }

                            var tree = buildTree(num);
                            var depth = treeDepth(tree);
                            var leaves = treeLeaves(tree);

                            viz.screenText('Factor Tree of ' + num, viz.width / 2, 18, viz.colors.white, 15);

                            var startY = 55;
                            var xSpan = Math.min(240, (viz.width - 80) / 2);
                            drawNode(ctx, tree, viz.width / 2, startY, xSpan, 0, depth);

                            // Show factorization at bottom
                            var factors = {};
                            var temp = num;
                            var d = 2;
                            while (d * d <= temp) {
                                while (temp % d === 0) {
                                    factors[d] = (factors[d] || 0) + 1;
                                    temp = Math.floor(temp / d);
                                }
                                d++;
                            }
                            if (temp > 1) factors[temp] = (factors[temp] || 0) + 1;

                            var parts = [];
                            var primes = Object.keys(factors).map(Number).sort(function(a, b) { return a - b; });
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (factors[p] === 1) parts.push(p.toString());
                                else parts.push(p + '^' + factors[p]);
                            }

                            viz.screenText(
                                num + ' = ' + parts.join(' \u00D7 '),
                                viz.width / 2, viz.height - 20, viz.colors.green, 14
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the prime factorization of 2520.',
                    hint: 'Start dividing by 2 repeatedly, then 3, then 5, then 7...',
                    solution: '\\(2520 = 2^3 \\cdot 3^2 \\cdot 5 \\cdot 7\\). Check: \\(8 \\cdot 9 \\cdot 5 \\cdot 7 = 8 \\cdot 9 \\cdot 35 = 8 \\cdot 315 = 2520\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Prove that \\(\\sqrt{2}\\) is irrational using the Fundamental Theorem of Arithmetic.',
                    hint: 'Assume \\(\\sqrt{2} = p/q\\) in lowest terms. Square both sides and consider the prime factorization of each side.',
                    solution: 'Suppose \\(\\sqrt{2} = p/q\\) with \\(\\gcd(p, q) = 1\\). Then \\(2q^2 = p^2\\). The left side has an odd number of factors of 2, while the right side has an even number. This contradicts uniqueness of prime factorization.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Extended Euclidean Algorithm
        // ================================================================
        {
            id: 'sec-euclidean',
            title: 'Extended Euclidean Algorithm',
            content: `
<h2>The Extended Euclidean Algorithm</h2>

<div class="env-block intuition">
    <div class="env-title">From GCD to Bezout Coefficients</div>
    <div class="env-body">
        <p>The Euclidean algorithm computes \\(\\gcd(a, b)\\). The <em>extended</em> version additionally finds integers \\(x\\) and \\(y\\) satisfying \\(ax + by = \\gcd(a, b)\\). The idea is to track the coefficients through the back-substitution of each step.</p>
    </div>
</div>

<h3>The Algorithm</h3>

<p>At each step of the Euclidean algorithm, we have \\(r_i = r_{i-2} - q_i \\cdot r_{i-1}\\). If we also track how each remainder is expressed as a linear combination of \\(a\\) and \\(b\\), we can back-substitute to find \\(x\\) and \\(y\\).</p>

<div class="env-block example">
    <div class="env-title">Example: \\(\\gcd(252, 198)\\) with Bezout coefficients</div>
    <div class="env-body">
        <p>From the Euclidean algorithm:</p>
        \\[\\begin{aligned}
        252 &= 198 \\cdot 1 + 54 &\\implies 54 &= 252 - 198 \\cdot 1, \\\\
        198 &= 54 \\cdot 3 + 36 &\\implies 36 &= 198 - 54 \\cdot 3, \\\\
        54 &= 36 \\cdot 1 + 18 &\\implies 18 &= 54 - 36 \\cdot 1.
        \\end{aligned}\\]
        <p>Back-substituting:</p>
        \\[\\begin{aligned}
        18 &= 54 - 36 \\cdot 1 \\\\
        &= 54 - (198 - 54 \\cdot 3) \\cdot 1 = 54 \\cdot 4 - 198 \\cdot 1 \\\\
        &= (252 - 198 \\cdot 1) \\cdot 4 - 198 \\cdot 1 = 252 \\cdot 4 - 198 \\cdot 5.
        \\end{aligned}\\]
        <p>So \\(252 \\cdot 4 + 198 \\cdot (-5) = 18 = \\gcd(252, 198)\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why This Matters</div>
    <div class="env-body">
        <p>The extended Euclidean algorithm is the computational backbone of modular inverses. If \\(\\gcd(a, m) = 1\\), then the \\(x\\) from \\(ax + my = 1\\) gives \\(ax \\equiv 1 \\pmod{m}\\), meaning \\(x\\) is the multiplicative inverse of \\(a\\) modulo \\(m\\). This is essential for RSA (Chapter 16).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-bezout"></div>
`,
            visualizations: [
                {
                    id: 'viz-bezout',
                    title: 'Extended Euclidean: Bezout Coefficients',
                    description: 'Enter two positive integers and see the extended Euclidean algorithm find x and y such that ax + by = gcd(a,b). Each step shows the back-substitution process.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 252, b = 198;

                        VizEngine.createSlider(controls, 'a', 2, 500, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 2, 500, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function extgcd(a, b) {
                            var steps = [];
                            var x0 = 1, x1 = 0, y0 = 0, y1 = 1;
                            var origA = a, origB = b;
                            while (b > 0) {
                                var q = Math.floor(a / b);
                                var r = a - q * b;
                                steps.push({ a: a, b: b, q: q, r: r, x: x0, y: y0 });
                                var tempX = x0 - q * x1;
                                var tempY = y0 - q * y1;
                                a = b; b = r;
                                x0 = x1; x1 = tempX;
                                y0 = y1; y1 = tempY;
                            }
                            return { gcd: a, x: x0, y: y0, steps: steps };
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var A = Math.max(a, b), B = Math.min(a, b);
                            var result = extgcd(A, B);

                            viz.screenText('Extended Euclidean Algorithm', viz.width / 2, 18, viz.colors.white, 15);

                            // Table header
                            var startY = 48;
                            var rowH = Math.min(32, (viz.height - 120) / Math.max(result.steps.length + 1, 2));
                            var colX = [50, 140, 240, 340, 440, 540];
                            var headers = ['Step', 'a', 'b', 'q', 'r', 'ax+by'];

                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.text;
                            for (var h = 0; h < headers.length; h++) {
                                ctx.fillText(headers[h], colX[h], startY);
                            }

                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(20, startY + 8);
                            ctx.lineTo(viz.width - 20, startY + 8);
                            ctx.stroke();

                            for (var i = 0; i < result.steps.length; i++) {
                                var s = result.steps[i];
                                var y = startY + (i + 1) * rowH;
                                var isLast = (i === result.steps.length - 1);

                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = isLast ? viz.colors.teal : viz.colors.text;

                                ctx.fillText((i + 1).toString(), colX[0], y);
                                ctx.fillText(s.a.toString(), colX[1], y);
                                ctx.fillText(s.b.toString(), colX[2], y);
                                ctx.fillText(s.q.toString(), colX[3], y);
                                ctx.fillText(s.r.toString(), colX[4], y);

                                // Show current linear combination
                                var lc = s.x + '\u00B7' + A + ' + ' + s.y + '\u00B7' + B;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(lc, colX[5], y);
                            }

                            // Result
                            var resY = startY + (result.steps.length + 1.5) * rowH;
                            var xCoeff = a >= b ? result.x : result.y;
                            var yCoeff = a >= b ? result.y : result.x;

                            viz.screenText(
                                'gcd(' + a + ', ' + b + ') = ' + result.gcd,
                                viz.width / 2, resY, viz.colors.green, 15
                            );
                            viz.screenText(
                                'Bezout: ' + a + '\u00B7(' + xCoeff + ') + ' + b + '\u00B7(' + yCoeff + ') = ' + result.gcd,
                                viz.width / 2, resY + 24, viz.colors.teal, 13
                            );

                            // Verify
                            var verify = a * xCoeff + b * yCoeff;
                            viz.screenText(
                                'Check: ' + (a * xCoeff) + ' + ' + (b * yCoeff) + ' = ' + verify,
                                viz.width / 2, resY + 46, viz.colors.text, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the extended Euclidean algorithm to find integers \\(x\\) and \\(y\\) such that \\(35x + 15y = \\gcd(35, 15)\\).',
                    hint: 'First run the Euclidean algorithm: \\(35 = 15 \\cdot 2 + 5\\), \\(15 = 5 \\cdot 3 + 0\\). Then back-substitute.',
                    solution: 'The Euclidean algorithm gives \\(\\gcd(35, 15) = 5\\). Back-substituting: \\(5 = 35 - 15 \\cdot 2\\). So \\(x = 1, y = -2\\). Check: \\(35(1) + 15(-2) = 35 - 30 = 5\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Find the multiplicative inverse of 17 modulo 43 (i.e., find \\(x\\) such that \\(17x \\equiv 1 \\pmod{43}\\)).',
                    hint: 'Since \\(\\gcd(17, 43) = 1\\), use the extended Euclidean algorithm to find \\(x\\) with \\(17x + 43y = 1\\).',
                    solution: '\\(43 = 17 \\cdot 2 + 9\\), \\(17 = 9 \\cdot 1 + 8\\), \\(9 = 8 \\cdot 1 + 1\\). Back-substituting: \\(1 = 9 - 8 = 9 - (17 - 9) = 2 \\cdot 9 - 17 = 2(43 - 2 \\cdot 17) - 17 = 2 \\cdot 43 - 5 \\cdot 17\\). So \\(17 \\cdot (-5) + 43 \\cdot 2 = 1\\), giving \\(x = -5 \\equiv 38 \\pmod{43}\\). Check: \\(17 \\cdot 38 = 646 = 15 \\cdot 43 + 1\\). \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Chinese Remainder Theorem
        // ================================================================
        {
            id: 'sec-crt',
            title: 'Chinese Remainder Theorem',
            content: `
<h2>The Chinese Remainder Theorem</h2>

<div class="env-block intuition">
    <div class="env-title">The Puzzle</div>
    <div class="env-body">
        <p>A number leaves remainder 2 when divided by 3, remainder 3 when divided by 5, and remainder 2 when divided by 7. What is the number? The Chinese Remainder Theorem (CRT) guarantees that such a system has a unique solution modulo \\(3 \\times 5 \\times 7 = 105\\), and provides a method to find it.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.8 (Chinese Remainder Theorem)</div>
    <div class="env-body">
        <p>Let \\(m_1, m_2, \\ldots, m_k\\) be pairwise coprime positive integers, and let \\(a_1, a_2, \\ldots, a_k\\) be any integers. Then the system of congruences</p>
        \\[\\begin{cases}
        x \\equiv a_1 \\pmod{m_1} \\\\
        x \\equiv a_2 \\pmod{m_2} \\\\
        \\quad\\vdots \\\\
        x \\equiv a_k \\pmod{m_k}
        \\end{cases}\\]
        <p>has a unique solution modulo \\(M = m_1 m_2 \\cdots m_k\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Constructive Proof</div>
    <div class="env-body">
        <p>Let \\(M_i = M / m_i\\) for each \\(i\\). Since \\(\\gcd(M_i, m_i) = 1\\), there exists \\(y_i\\) with \\(M_i y_i \\equiv 1 \\pmod{m_i}\\) (by Bezout). Then</p>
        \\[x = \\sum_{i=1}^{k} a_i M_i y_i\\]
        <p>satisfies all congruences: for each \\(j\\), \\(M_i \\equiv 0 \\pmod{m_j}\\) when \\(i \\neq j\\), so \\(x \\equiv a_j M_j y_j \\equiv a_j \\pmod{m_j}\\).</p>
        <p><strong>Uniqueness:</strong> If \\(x_1\\) and \\(x_2\\) are both solutions, then \\(m_i \\mid (x_1 - x_2)\\) for all \\(i\\). Since the \\(m_i\\) are pairwise coprime, \\(M \\mid (x_1 - x_2)\\), so \\(x_1 \\equiv x_2 \\pmod{M}\\).</p>
    </div>
    <div class="qed"></div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Solve: \\(x \\equiv 2 \\pmod{3}\\), \\(x \\equiv 3 \\pmod{5}\\), \\(x \\equiv 2 \\pmod{7}\\).</p>
        <p>\\(M = 105\\). \\(M_1 = 35\\), \\(M_2 = 21\\), \\(M_3 = 15\\).</p>
        <p>Find inverses: \\(35 y_1 \\equiv 1 \\pmod{3}\\) gives \\(y_1 = 2\\). \\(21 y_2 \\equiv 1 \\pmod{5}\\) gives \\(y_2 = 1\\). \\(15 y_3 \\equiv 1 \\pmod{7}\\) gives \\(y_3 = 1\\).</p>
        <p>\\(x = 2 \\cdot 35 \\cdot 2 + 3 \\cdot 21 \\cdot 1 + 2 \\cdot 15 \\cdot 1 = 140 + 63 + 30 = 233 \\equiv 23 \\pmod{105}\\).</p>
        <p>Check: \\(23 = 3 \\cdot 7 + 2\\), \\(23 = 5 \\cdot 4 + 3\\), \\(23 = 7 \\cdot 3 + 2\\). \\(\\checkmark\\)</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-crt"></div>
`,
            visualizations: [
                {
                    id: 'viz-crt',
                    title: 'Chinese Remainder Theorem Solver',
                    description: 'Enter congruences \\(x \\equiv a_i \\pmod{m_i}\\) and watch the CRT construction find the unique solution. The moduli must be pairwise coprime.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var mods = [3, 5, 7];
                        var rems = [2, 3, 2];

                        VizEngine.createSlider(controls, 'm1', 2, 13, mods[0], 1, function(v) { mods[0] = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'a1', 0, 12, rems[0], 1, function(v) { rems[0] = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'm2', 2, 13, mods[1], 1, function(v) { mods[1] = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'a2', 0, 12, rems[1], 1, function(v) { rems[1] = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'm3', 2, 13, mods[2], 1, function(v) { mods[2] = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'a3', 0, 12, rems[2], 1, function(v) { rems[2] = Math.round(v); draw(); });

                        function gcd(a, b) {
                            while (b > 0) { var t = b; b = a % b; a = t; }
                            return a;
                        }

                        function modInverse(a, m) {
                            // Extended Euclidean
                            var m0 = m, x0 = 0, x1 = 1;
                            if (m === 1) return 0;
                            while (a > 1) {
                                var q = Math.floor(a / m);
                                var t = m;
                                m = a % m; a = t; t = x0;
                                x0 = x1 - q * x0; x1 = t;
                            }
                            if (x1 < 0) x1 += m0;
                            return x1;
                        }

                        function arePairwiseCoprime(ms) {
                            for (var i = 0; i < ms.length; i++) {
                                for (var j = i + 1; j < ms.length; j++) {
                                    if (gcd(ms[i], ms[j]) > 1) return false;
                                }
                            }
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Chinese Remainder Theorem', viz.width / 2, 18, viz.colors.white, 15);

                            // Clamp remainders to valid range
                            for (var i = 0; i < 3; i++) {
                                rems[i] = rems[i] % mods[i];
                            }

                            // Display the system
                            var sysY = 48;
                            for (var i = 0; i < 3; i++) {
                                viz.screenText(
                                    'x \u2261 ' + rems[i] + ' (mod ' + mods[i] + ')',
                                    viz.width / 2, sysY + i * 22, viz.colors.text, 13
                                );
                            }

                            if (!arePairwiseCoprime(mods)) {
                                viz.screenText(
                                    'Moduli are not pairwise coprime! CRT does not apply.',
                                    viz.width / 2, sysY + 90, viz.colors.red, 14
                                );
                                return;
                            }

                            var M = mods[0] * mods[1] * mods[2];
                            var Ms = [M / mods[0], M / mods[1], M / mods[2]];
                            var ys = [];
                            for (var i = 0; i < 3; i++) {
                                ys.push(modInverse(Ms[i] % mods[i], mods[i]));
                            }

                            // Construction table
                            var tableY = sysY + 80;
                            var colX = [60, 160, 260, 360, 500];
                            var headers = ['i', 'M_i', 'y_i', 'a_i * M_i * y_i', 'Contribution'];

                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.text;
                            for (var h = 0; h < headers.length; h++) {
                                ctx.fillText(headers[h], colX[h], tableY);
                            }

                            var sum = 0;
                            for (var i = 0; i < 3; i++) {
                                var y = tableY + (i + 1) * 28;
                                var contrib = rems[i] * Ms[i] * ys[i];
                                sum += contrib;

                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text;
                                ctx.textAlign = 'center';
                                ctx.fillText((i + 1).toString(), colX[0], y);
                                ctx.fillText(Ms[i].toString(), colX[1], y);
                                ctx.fillText(ys[i].toString(), colX[2], y);
                                ctx.fillText(rems[i] + '\u00D7' + Ms[i] + '\u00D7' + ys[i], colX[3], y);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText(contrib.toString(), colX[4], y);
                            }

                            // Sum and result
                            var resY = tableY + 4 * 28 + 10;
                            var solution = ((sum % M) + M) % M;

                            viz.screenText('Sum = ' + sum, viz.width / 2, resY, viz.colors.text, 12);
                            viz.screenText(
                                'x \u2261 ' + sum + ' \u2261 ' + solution + ' (mod ' + M + ')',
                                viz.width / 2, resY + 24, viz.colors.green, 15
                            );

                            // Verification
                            var verY = resY + 56;
                            viz.screenText('Verification:', viz.width / 2, verY, viz.colors.muted, 11);
                            for (var i = 0; i < 3; i++) {
                                var check = solution % mods[i];
                                var ok = (check === rems[i]);
                                viz.screenText(
                                    solution + ' mod ' + mods[i] + ' = ' + check + (ok ? ' \u2713' : ' \u2717'),
                                    viz.width / 2, verY + (i + 1) * 18,
                                    ok ? viz.colors.green : viz.colors.red, 11
                                );
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Solve the system: \\(x \\equiv 1 \\pmod{2}\\), \\(x \\equiv 2 \\pmod{3}\\), \\(x \\equiv 3 \\pmod{5}\\).',
                    hint: 'Apply the CRT construction with \\(M = 30\\), \\(M_1 = 15\\), \\(M_2 = 10\\), \\(M_3 = 6\\). Find the modular inverses.',
                    solution: '\\(M = 30\\). \\(M_1 = 15\\), \\(15 \\cdot y_1 \\equiv 1 \\pmod{2}\\) gives \\(y_1 = 1\\). \\(M_2 = 10\\), \\(10 \\cdot y_2 \\equiv 1 \\pmod{3}\\) gives \\(y_2 = 1\\). \\(M_3 = 6\\), \\(6 \\cdot y_3 \\equiv 1 \\pmod{5}\\) gives \\(y_3 = 1\\). So \\(x = 1 \\cdot 15 \\cdot 1 + 2 \\cdot 10 \\cdot 1 + 3 \\cdot 6 \\cdot 1 = 15 + 20 + 18 = 53 \\equiv 23 \\pmod{30}\\). Check: \\(23\\) is odd, \\(23 = 3 \\cdot 7 + 2\\), \\(23 = 5 \\cdot 4 + 3\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Why does the CRT require the moduli to be pairwise coprime? Give an example where the system has no solution when this condition fails.',
                    hint: 'Consider \\(x \\equiv 1 \\pmod{4}\\) and \\(x \\equiv 2 \\pmod{6}\\). Check if any \\(x\\) works.',
                    solution: 'The system \\(x \\equiv 1 \\pmod{4}\\), \\(x \\equiv 2 \\pmod{6}\\) has no solution. From the first: \\(x\\) is odd. From the second: \\(x\\) is even. Contradiction. The pairwise coprimality ensures that the "constraints" from different moduli never conflict: no prime divides two different moduli, so information from one congruence cannot contradict another.'
                },
                {
                    question: 'Find the smallest positive integer that leaves remainder 1 when divided by 2, 3, 4, 5, and 6.',
                    hint: 'This is not directly a CRT problem (the moduli are not pairwise coprime). Instead, think: what does "remainder 1 when divided by 2, 3, 4, 5, and 6" mean?',
                    solution: 'We need \\(x \\equiv 1 \\pmod{\\operatorname{lcm}(2,3,4,5,6)}\\). Since \\(\\operatorname{lcm}(2,3,4,5,6) = 60\\), the answer is \\(x = 61\\). Check: \\(61 = 2 \\cdot 30 + 1 = 3 \\cdot 20 + 1 = 4 \\cdot 15 + 1 = 5 \\cdot 12 + 1 = 6 \\cdot 10 + 1\\). \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Summary & Bridge',
            content: `
<h2>Summary</h2>

<p>This chapter developed the core machinery of elementary number theory:</p>

<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:0.9em;">
    <tr style="border-bottom:2px solid var(--border-default);">
        <th style="padding:8px; text-align:left;">Concept</th>
        <th style="padding:8px; text-align:center;">Key Result</th>
        <th style="padding:8px; text-align:left;">Significance</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Divisibility</td>
        <td style="padding:8px; text-align:center;">\\(a = dq + r\\), \\(0 \\leq r < d\\)</td>
        <td style="padding:8px;">Division Algorithm: foundation for all that follows</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">GCD</td>
        <td style="padding:8px; text-align:center;">\\(\\gcd(a,b) = \\gcd(b, a \\bmod b)\\)</td>
        <td style="padding:8px;">Euclidean algorithm: efficient computation of GCD</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Bezout</td>
        <td style="padding:8px; text-align:center;">\\(ax + by = \\gcd(a,b)\\)</td>
        <td style="padding:8px;">Existence of linear combinations; modular inverses</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">FTA</td>
        <td style="padding:8px; text-align:center;">\\(n = p_1^{e_1} \\cdots p_k^{e_k}\\)</td>
        <td style="padding:8px;">Unique prime factorization: primes are the atoms</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Infinitude</td>
        <td style="padding:8px; text-align:center;">\\(|\\{\\text{primes}\\}| = \\infty\\)</td>
        <td style="padding:8px;">Euclid's proof: a masterpiece of contradiction</td>
    </tr>
    <tr>
        <td style="padding:8px;">CRT</td>
        <td style="padding:8px; text-align:center;">\\(x \\equiv a_i \\pmod{m_i}\\) has a unique solution mod \\(\\prod m_i\\)</td>
        <td style="padding:8px;">Reduces problems modulo composites to problems modulo primes</td>
    </tr>
</table>

<div class="env-block remark">
    <div class="env-title">What Comes Next</div>
    <div class="env-body">
        <p>In <strong>Chapter 15: Modular Arithmetic</strong>, we build a full algebraic structure on top of the division algorithm. Congruences become an equivalence relation, and the integers modulo \\(n\\) form a ring (and sometimes a field). Fermat's little theorem and Euler's theorem give us powerful tools for computing with exponents modulo \\(n\\).</p>
        <p>In <strong>Chapter 16: RSA Cryptography</strong>, we combine everything: the difficulty of factoring, Euler's theorem, and the extended Euclidean algorithm come together to build the RSA public-key cryptosystem.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        }
    ]
});
