window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch08',
    number: 8,
    title: 'Recurrence Relations',
    subtitle: 'Defining sequences by looking back',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Recurrence Relations?</h2>

<div class="env-block intuition">
    <div class="env-title">The Tower of Hanoi</div>
    <div class="env-body">
        <p>You have three pegs and \\(n\\) disks of different sizes stacked on one peg, smallest on top. The goal is to move all disks to another peg, one at a time, never placing a larger disk on a smaller one. How many moves does this take?</p>
        <p>Call the answer \\(T_n\\). To move \\(n\\) disks, you first move the top \\(n-1\\) disks out of the way (\\(T_{n-1}\\) moves), then move the largest disk (1 move), then move the \\(n-1\\) disks back on top (\\(T_{n-1}\\) moves again). So:</p>
        \\[T_n = 2T_{n-1} + 1, \\quad T_1 = 1.\\]
        <p>This is a <strong>recurrence relation</strong>: a formula that defines each term of a sequence in terms of earlier terms. Solving it gives \\(T_n = 2^n - 1\\).</p>
    </div>
</div>

<p>Recurrence relations appear throughout discrete mathematics and computer science. Every time an algorithm breaks a problem into smaller subproblems, the running time satisfies a recurrence. Every time a counting problem can be decomposed into cases based on the last element chosen, the count satisfies a recurrence.</p>

<h3>Where Recurrences Arise</h3>

<ul>
    <li><strong>Counting:</strong> The number of binary strings of length \\(n\\) with no two consecutive 1s satisfies \\(a_n = a_{n-1} + a_{n-2}\\) (a Fibonacci recurrence).</li>
    <li><strong>Algorithm analysis:</strong> Merge sort's running time satisfies \\(T(n) = 2T(n/2) + \\Theta(n)\\).</li>
    <li><strong>Biology:</strong> Fibonacci's original rabbit problem models population growth through a recurrence.</li>
    <li><strong>Finance:</strong> Compound interest: \\(A_n = (1 + r)A_{n-1}\\), starting from an initial deposit \\(A_0\\).</li>
</ul>

<p>This chapter develops systematic methods for <em>solving</em> recurrence relations, meaning we find an explicit formula (a "closed form") for \\(a_n\\) in terms of \\(n\\) alone, without reference to previous terms.</p>

<div class="env-block remark">
    <div class="env-title">A Note on Notation</div>
    <div class="env-body">
        <p>We write \\(a_n\\) (or \\(T_n\\), \\(f(n)\\), etc.) for the \\(n\\)-th term of a sequence. The recurrence defines \\(a_n\\) for \\(n \\geq n_0\\) (some starting index), and we need <strong>initial conditions</strong> to pin down a unique solution. Without initial conditions, a recurrence has infinitely many solutions.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-tower-of-hanoi"></div>
`,
            visualizations: [
                {
                    id: 'viz-tower-of-hanoi',
                    title: 'Tower of Hanoi',
                    description: 'Watch the Tower of Hanoi solved optimally. The number of moves is \\(T_n = 2^n - 1\\). Adjust the number of disks and click Play to watch the recursive solution unfold.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nDisks = 4;
                        var pegs = [[], [], []];
                        var moves = [];
                        var moveIdx = 0;
                        var animating = false;
                        var timer = null;

                        VizEngine.createSlider(controls, 'Disks', 2, 7, nDisks, 1, function(v) {
                            nDisks = Math.round(v);
                            reset();
                        });

                        var playBtn = VizEngine.createButton(controls, 'Play', function() {
                            if (animating) return;
                            reset();
                            generateMoves(nDisks, 0, 2, 1);
                            moveIdx = 0;
                            animating = true;
                            step();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            if (timer) clearTimeout(timer);
                            animating = false;
                            reset();
                        });

                        function reset() {
                            pegs = [[], [], []];
                            for (var i = nDisks; i >= 1; i--) pegs[0].push(i);
                            moves = [];
                            moveIdx = 0;
                            draw();
                        }

                        function generateMoves(n, from, to, aux) {
                            if (n === 0) return;
                            generateMoves(n - 1, from, aux, to);
                            moves.push([from, to]);
                            generateMoves(n - 1, aux, to, from);
                        }

                        function step() {
                            if (moveIdx >= moves.length) {
                                animating = false;
                                return;
                            }
                            var m = moves[moveIdx];
                            var disk = pegs[m[0]].pop();
                            pegs[m[1]].push(disk);
                            moveIdx++;
                            draw();
                            timer = setTimeout(step, Math.max(100, 800 - nDisks * 80));
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pegX = [viz.width * 0.2, viz.width * 0.5, viz.width * 0.8];
                            var baseY = 310;
                            var diskH = Math.min(25, 180 / nDisks);
                            var maxW = 100;
                            var minW = 30;

                            // Title
                            viz.screenText('Tower of Hanoi', viz.width / 2, 20, viz.colors.white, 15);
                            viz.screenText('Moves: ' + moveIdx + ' / ' + (Math.pow(2, nDisks) - 1), viz.width / 2, 42, viz.colors.teal, 12);

                            // Draw pegs
                            ctx.fillStyle = viz.colors.axis;
                            for (var p = 0; p < 3; p++) {
                                ctx.fillRect(pegX[p] - 3, baseY - nDisks * diskH - 20, 6, nDisks * diskH + 20);
                                ctx.fillRect(pegX[p] - 55, baseY, 110, 4);
                            }

                            // Peg labels
                            var pegLabels = ['A', 'B', 'C'];
                            for (var p = 0; p < 3; p++) {
                                viz.screenText(pegLabels[p], pegX[p], baseY + 20, viz.colors.text, 12);
                            }

                            // Draw disks
                            var diskColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.red, viz.colors.yellow];
                            for (var p = 0; p < 3; p++) {
                                for (var d = 0; d < pegs[p].length; d++) {
                                    var diskSize = pegs[p][d];
                                    var w = minW + (maxW - minW) * (diskSize / nDisks);
                                    var y = baseY - (d + 1) * diskH;
                                    ctx.fillStyle = diskColors[(diskSize - 1) % diskColors.length];
                                    ctx.beginPath();
                                    ctx.roundRect(pegX[p] - w / 2, y, w, diskH - 2, 4);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(diskSize.toString(), pegX[p], y + diskH / 2 - 1);
                                }
                            }

                            // Recurrence
                            viz.screenText('T(n) = 2T(n-1) + 1,  T(1) = 1', viz.width / 2, 350, viz.colors.muted, 11);
                            viz.screenText('Closed form: T(n) = 2\u207F - 1 = ' + (Math.pow(2, nDisks) - 1), viz.width / 2, 368, viz.colors.orange, 11);
                        }

                        reset();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Recurrence Relations (Definition)
        // ================================================================
        {
            id: 'sec-definition',
            title: 'Recurrence Relations',
            content: `
<h2>Recurrence Relations</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Recurrence Relation)</div>
    <div class="env-body">
        <p>A <strong>recurrence relation</strong> for a sequence \\(\\{a_n\\}\\) is an equation that expresses \\(a_n\\) as a function of one or more of the preceding terms \\(a_{n-1}, a_{n-2}, \\ldots\\)  The <strong>order</strong> of the recurrence is the number of previous terms it uses. Together with <strong>initial conditions</strong> (specific values for the first few terms), a recurrence uniquely determines the entire sequence.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: First-Order Recurrence</div>
    <div class="env-body">
        <p>The recurrence \\(a_n = 3a_{n-1}\\) with \\(a_0 = 2\\) gives:</p>
        \\[a_0 = 2, \\quad a_1 = 6, \\quad a_2 = 18, \\quad a_3 = 54, \\quad \\ldots\\]
        <p>Closed form: \\(a_n = 2 \\cdot 3^n\\). This is a geometric sequence.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Second-Order Recurrence</div>
    <div class="env-body">
        <p>The Fibonacci sequence \\(F_n = F_{n-1} + F_{n-2}\\) with \\(F_0 = 0, F_1 = 1\\) needs <em>two</em> initial conditions because the recurrence is second-order (it looks back two steps).</p>
    </div>
</div>

<h3>Why Seek Closed Forms?</h3>

<p>A recurrence tells you how to compute \\(a_n\\) step by step, but a closed form lets you jump directly to any term. For example, to find \\(a_{1000}\\) from \\(a_n = 3a_{n-1}\\), the recurrence requires 1000 multiplications, while the closed form \\(a_n = 2 \\cdot 3^n\\) gives the answer in one step.</p>

<p>Closed forms also reveal the <em>growth rate</em> of a sequence. From \\(T_n = 2^n - 1\\), we immediately see exponential growth. From the recurrence \\(T_n = 2T_{n-1} + 1\\) alone, the growth rate is far less obvious.</p>

<h3>Linear vs. Nonlinear</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Linear Recurrence)</div>
    <div class="env-body">
        <p>A recurrence is <strong>linear</strong> if \\(a_n\\) is expressed as a linear combination of previous terms (possibly plus a function of \\(n\\)):</p>
        \\[a_n = c_1 a_{n-1} + c_2 a_{n-2} + \\cdots + c_k a_{n-k} + f(n),\\]
        <p>where the \\(c_i\\) are constants and \\(f(n)\\) depends only on \\(n\\). If \\(f(n) = 0\\), the recurrence is <strong>homogeneous</strong>; otherwise it is <strong>nonhomogeneous</strong>.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Examples of Classification</div>
    <div class="env-body">
        <ul>
            <li>\\(a_n = 5a_{n-1} - 6a_{n-2}\\): linear, homogeneous, order 2, constant coefficients.</li>
            <li>\\(a_n = 2a_{n-1} + n\\): linear, nonhomogeneous, order 1.</li>
            <li>\\(a_n = a_{n-1} \\cdot a_{n-2}\\): <strong>nonlinear</strong> (product of previous terms).</li>
            <li>\\(a_n = na_{n-1}\\): linear but with <em>variable</em> coefficient \\(n\\); our standard methods apply to <em>constant</em> coefficients.</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-recurrence-explorer"></div>
`,
            visualizations: [
                {
                    id: 'viz-recurrence-explorer',
                    title: 'Recurrence Explorer',
                    description: 'Enter a recurrence relation and initial conditions to compute and plot the sequence. See how different recurrences produce different growth patterns.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 320, scale: 1
                        });

                        var presets = [
                            { name: 'Fibonacci', recurrence: function(a, n) { return a[n-1] + a[n-2]; }, init: [0, 1], nMax: 15 },
                            { name: 'Tower of Hanoi', recurrence: function(a, n) { return 2 * a[n-1] + 1; }, init: [1], nMax: 12 },
                            { name: 'Geometric (3^n)', recurrence: function(a, n) { return 3 * a[n-1]; }, init: [1], nMax: 10 },
                            { name: 'a(n) = 2a(n-1) + n', recurrence: function(a, n) { return 2 * a[n-1] + n; }, init: [0], nMax: 10 },
                            { name: 'a(n) = a(n-1) + a(n-2) + a(n-3)', recurrence: function(a, n) { return a[n-1] + a[n-2] + a[n-3]; }, init: [0, 0, 1], nMax: 15 }
                        ];
                        var current = 0;

                        // Preset buttons
                        for (var i = 0; i < presets.length; i++) {
                            (function(idx) {
                                VizEngine.createButton(controls, presets[idx].name, function() {
                                    current = idx;
                                    draw();
                                });
                            })(i);
                        }

                        function draw() {
                            var preset = presets[current];
                            var seq = preset.init.slice();
                            var startIdx = seq.length;
                            for (var n = startIdx; n <= preset.nMax; n++) {
                                seq.push(preset.recurrence(seq, n));
                            }

                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Recurrence: ' + preset.name, viz.width / 2, 20, viz.colors.white, 14);

                            // Plot
                            var maxVal = Math.max.apply(null, seq.map(function(v) { return Math.abs(v); }));
                            if (maxVal === 0) maxVal = 1;
                            var chartLeft = 70;
                            var chartRight = viz.width - 30;
                            var chartTop = 50;
                            var chartBottom = 300;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartBottom);
                            ctx.lineTo(chartRight, chartBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartTop);
                            ctx.lineTo(chartLeft, chartBottom);
                            ctx.stroke();

                            // Y-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var tick = 0; tick <= 4; tick++) {
                                var yVal = maxVal * tick / 4;
                                var yPos = chartBottom - (tick / 4) * chartH;
                                ctx.fillText(Math.round(yVal).toLocaleString(), chartLeft - 6, yPos);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(chartLeft, yPos);
                                ctx.lineTo(chartRight, yPos);
                                ctx.stroke();
                            }

                            // Plot points and lines
                            var barW = Math.min(20, chartW / (seq.length * 1.5));
                            for (var n = 0; n < seq.length; n++) {
                                var x = chartLeft + (n + 0.5) * chartW / seq.length;
                                var h = (seq[n] / maxVal) * chartH;
                                var y = chartBottom - h;

                                // Bar
                                ctx.fillStyle = n < (preset.init.length) ? viz.colors.orange : viz.colors.blue;
                                ctx.fillRect(x - barW / 2, y, barW, h);

                                // Point
                                ctx.fillStyle = viz.colors.white;
                                ctx.beginPath();
                                ctx.arc(x, y, 3, 0, Math.PI * 2);
                                ctx.fill();

                                // n label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(n.toString(), x, chartBottom + 4);
                            }

                            // Connect with line
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var n = 0; n < seq.length; n++) {
                                var x = chartLeft + (n + 0.5) * chartW / seq.length;
                                var y = chartBottom - (seq[n] / maxVal) * chartH;
                                if (n === 0) ctx.moveTo(x, y);
                                else ctx.lineTo(x, y);
                            }
                            ctx.stroke();

                            // Legend
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(chartLeft + 10, chartTop + 5, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Initial conditions', chartLeft + 24, chartTop + 14);

                            // Value table at bottom
                            var tableY = 330;
                            var maxShow = Math.min(seq.length, 10);
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.muted;
                            var tableStr = '';
                            for (var n = 0; n < maxShow; n++) {
                                tableStr += 'a(' + n + ')=' + seq[n];
                                if (n < maxShow - 1) tableStr += ',  ';
                            }
                            if (seq.length > maxShow) tableStr += ', ...';
                            viz.screenText(tableStr, viz.width / 2, tableY, viz.colors.text, 10);
                            viz.screenText('n', chartLeft + chartW / 2, chartBottom + 18, viz.colors.text, 10);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write a recurrence relation (with initial conditions) for the number of bit strings of length \\(n\\) that do not contain the pattern "11".',
                    hint: 'Consider the last bit. If it is 0, the preceding \\(n-1\\) bits can be any valid string. If it is 1, the second-to-last bit must be 0, so the first \\(n-2\\) bits form a valid string.',
                    solution: 'Let \\(a_n\\) be the count. If the last bit is 0, the first \\(n-1\\) bits give \\(a_{n-1}\\) strings. If the last bit is 1, the previous bit must be 0, and the first \\(n-2\\) bits give \\(a_{n-2}\\) strings. So \\(a_n = a_{n-1} + a_{n-2}\\), with \\(a_1 = 2\\) (strings: 0, 1) and \\(a_2 = 3\\) (strings: 00, 01, 10). This is a shifted Fibonacci sequence.'
                },
                {
                    question: 'Let \\(a_n = 2a_{n-1} + 1\\) with \\(a_0 = 0\\). Compute \\(a_1, a_2, \\ldots, a_5\\) and guess a closed form. Verify by substitution.',
                    hint: 'The sequence starts 0, 1, 3, 7, 15, 31. These are \\(2^n - 1\\).',
                    solution: '\\(a_0 = 0, a_1 = 1, a_2 = 3, a_3 = 7, a_4 = 15, a_5 = 31\\). Guess: \\(a_n = 2^n - 1\\). Check: \\(2a_{n-1} + 1 = 2(2^{n-1} - 1) + 1 = 2^n - 2 + 1 = 2^n - 1 = a_n\\). \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Linear Recurrences
        // ================================================================
        {
            id: 'sec-linear',
            title: 'Linear Recurrences',
            content: `
<h2>Linear Homogeneous Recurrences with Constant Coefficients</h2>

<div class="env-block intuition">
    <div class="env-title">The Exponential Guess</div>
    <div class="env-body">
        <p>For the recurrence \\(a_n = c_1 a_{n-1} + c_2 a_{n-2}\\), try \\(a_n = r^n\\). Substituting:</p>
        \\[r^n = c_1 r^{n-1} + c_2 r^{n-2}.\\]
        <p>Dividing by \\(r^{n-2}\\) (assuming \\(r \\neq 0\\)):</p>
        \\[r^2 = c_1 r + c_2.\\]
        <p>This is the <strong>characteristic equation</strong>. Its roots tell us everything about the solution.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Characteristic Equation)</div>
    <div class="env-body">
        <p>The <strong>characteristic equation</strong> of the linear homogeneous recurrence</p>
        \\[a_n = c_1 a_{n-1} + c_2 a_{n-2} + \\cdots + c_k a_{n-k}\\]
        <p>is the polynomial equation</p>
        \\[r^k - c_1 r^{k-1} - c_2 r^{k-2} - \\cdots - c_k = 0.\\]
        <p>Its roots \\(r_1, r_2, \\ldots, r_k\\) are called the <strong>characteristic roots</strong>.</p>
    </div>
</div>

<h3>Case 1: Distinct Roots</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.1 (Distinct Roots)</div>
    <div class="env-body">
        <p>If the characteristic equation has \\(k\\) distinct roots \\(r_1, r_2, \\ldots, r_k\\), then the general solution is</p>
        \\[a_n = \\alpha_1 r_1^n + \\alpha_2 r_2^n + \\cdots + \\alpha_k r_k^n,\\]
        <p>where the constants \\(\\alpha_1, \\ldots, \\alpha_k\\) are determined by the initial conditions.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Solve \\(a_n = 5a_{n-1} - 6a_{n-2}\\) with \\(a_0 = 1, a_1 = 4\\).</p>
        <p>Characteristic equation: \\(r^2 - 5r + 6 = 0\\), so \\((r-2)(r-3) = 0\\), giving \\(r_1 = 2, r_2 = 3\\).</p>
        <p>General solution: \\(a_n = \\alpha_1 \\cdot 2^n + \\alpha_2 \\cdot 3^n\\).</p>
        <p>From initial conditions: \\(\\alpha_1 + \\alpha_2 = 1\\) and \\(2\\alpha_1 + 3\\alpha_2 = 4\\). Solving: \\(\\alpha_1 = -1, \\alpha_2 = 2\\).</p>
        <p>Answer: \\(a_n = -2^n + 2 \\cdot 3^n = 2 \\cdot 3^n - 2^n\\).</p>
    </div>
</div>

<h3>Case 2: Repeated Roots</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.2 (Repeated Roots)</div>
    <div class="env-body">
        <p>If a root \\(r\\) has multiplicity \\(m\\), it contributes \\(m\\) linearly independent solutions:</p>
        \\[r^n, \\; n r^n, \\; n^2 r^n, \\; \\ldots, \\; n^{m-1} r^n.\\]
        <p>In particular, for a second-order recurrence with a double root \\(r\\), the general solution is</p>
        \\[a_n = (\\alpha_1 + \\alpha_2 n) r^n.\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Solve \\(a_n = 4a_{n-1} - 4a_{n-2}\\) with \\(a_0 = 1, a_1 = 6\\).</p>
        <p>Characteristic equation: \\(r^2 - 4r + 4 = 0\\), so \\((r-2)^2 = 0\\). Double root \\(r = 2\\).</p>
        <p>General solution: \\(a_n = (\\alpha_1 + \\alpha_2 n) 2^n\\).</p>
        <p>From \\(a_0 = 1\\): \\(\\alpha_1 = 1\\). From \\(a_1 = 6\\): \\((1 + \\alpha_2) \\cdot 2 = 6\\), so \\(\\alpha_2 = 2\\).</p>
        <p>Answer: \\(a_n = (1 + 2n) \\cdot 2^n\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-characteristic-roots"></div>
`,
            visualizations: [
                {
                    id: 'viz-characteristic-roots',
                    title: 'Characteristic Equation Explorer',
                    description: 'For the second-order recurrence \\(a_n = c_1 a_{n-1} + c_2 a_{n-2}\\), this visualization shows the characteristic equation \\(r^2 - c_1 r - c_2 = 0\\), its roots in the complex plane, and the resulting solution form.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 200, scale: 60
                        });

                        var c1 = 5;
                        var c2 = -6;

                        VizEngine.createSlider(controls, 'c\u2081', -5, 8, c1, 0.5, function(v) { c1 = v; draw(); });
                        VizEngine.createSlider(controls, 'c\u2082', -8, 5, c2, 0.5, function(v) { c2 = v; draw(); });

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();
                            var ctx = viz.ctx;

                            // Characteristic equation: r^2 - c1*r - c2 = 0
                            var disc = c1 * c1 + 4 * c2;

                            viz.screenText('r\u00B2 - ' + c1.toFixed(1) + 'r - (' + c2.toFixed(1) + ') = 0', viz.width / 2, 22, viz.colors.white, 13);

                            if (disc > 0.001) {
                                // Two distinct real roots
                                var r1 = (c1 + Math.sqrt(disc)) / 2;
                                var r2 = (c1 - Math.sqrt(disc)) / 2;
                                viz.drawPoint(r1, 0, viz.colors.blue, 'r\u2081=' + r1.toFixed(2), 6);
                                viz.drawPoint(r2, 0, viz.colors.teal, 'r\u2082=' + r2.toFixed(2), 6);
                                viz.screenText('Distinct roots: a(n) = \u03B1\u2081\u00B7(' + r1.toFixed(2) + ')\u207F + \u03B1\u2082\u00B7(' + r2.toFixed(2) + ')\u207F', viz.width / 2, viz.height - 20, viz.colors.blue, 11);
                                viz.screenText('\u0394 = ' + disc.toFixed(2) + ' > 0', viz.width / 2, 42, viz.colors.green, 11);
                            } else if (disc < -0.001) {
                                // Complex conjugate roots
                                var re = c1 / 2;
                                var im = Math.sqrt(-disc) / 2;
                                var modulus = Math.sqrt(re * re + im * im);
                                viz.drawPoint(re, im, viz.colors.purple, 'r\u2081=' + re.toFixed(2) + '+' + im.toFixed(2) + 'i', 6);
                                viz.drawPoint(re, -im, viz.colors.pink, 'r\u2082=' + re.toFixed(2) + '-' + im.toFixed(2) + 'i', 6);
                                // Draw circle of modulus
                                viz.drawCircle(0, 0, modulus, null, viz.colors.purple + '44', 1);
                                viz.screenText('Complex roots: |r| = ' + modulus.toFixed(2) + ', oscillating solution', viz.width / 2, viz.height - 20, viz.colors.purple, 11);
                                viz.screenText('\u0394 = ' + disc.toFixed(2) + ' < 0', viz.width / 2, 42, viz.colors.red, 11);
                            } else {
                                // Repeated root
                                var r = c1 / 2;
                                viz.drawPoint(r, 0, viz.colors.orange, 'r=' + r.toFixed(2) + ' (double)', 8);
                                viz.screenText('Repeated root: a(n) = (\u03B1\u2081 + \u03B1\u2082 n)\u00B7(' + r.toFixed(2) + ')\u207F', viz.width / 2, viz.height - 20, viz.colors.orange, 11);
                                viz.screenText('\u0394 = 0', viz.width / 2, 42, viz.colors.yellow, 11);
                            }

                            // Draw unit circle for reference
                            viz.drawCircle(0, 0, 1, null, viz.colors.axis + '44', 1);
                            viz.screenText('Unit circle', 0.7 * 60 + 280 + 5, 200 - 0.7 * 60 - 5, viz.colors.text, 9, 'left');

                            // Axis labels
                            viz.screenText('Re', viz.width - 15, viz.originY - 8, viz.colors.text, 10);
                            viz.screenText('Im', viz.originX + 8, 15, viz.colors.text, 10);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Solve \\(a_n = 7a_{n-1} - 12a_{n-2}\\) with \\(a_0 = 2, a_1 = 7\\).',
                    hint: 'The characteristic equation is \\(r^2 - 7r + 12 = 0\\). Factor it.',
                    solution: 'Characteristic equation: \\(r^2 - 7r + 12 = (r-3)(r-4) = 0\\), roots \\(r_1=3, r_2=4\\). General solution: \\(a_n = \\alpha_1 \\cdot 3^n + \\alpha_2 \\cdot 4^n\\). From \\(a_0=2\\): \\(\\alpha_1 + \\alpha_2 = 2\\). From \\(a_1=7\\): \\(3\\alpha_1 + 4\\alpha_2 = 7\\). Solving: \\(\\alpha_1 = 1, \\alpha_2 = 1\\). Answer: \\(a_n = 3^n + 4^n\\).'
                },
                {
                    question: 'Solve \\(a_n = 6a_{n-1} - 9a_{n-2}\\) with \\(a_0 = 1, a_1 = 6\\).',
                    hint: 'The characteristic equation has a repeated root.',
                    solution: '\\(r^2 - 6r + 9 = (r-3)^2 = 0\\). Double root \\(r = 3\\). General solution: \\(a_n = (\\alpha_1 + \\alpha_2 n)3^n\\). From \\(a_0 = 1\\): \\(\\alpha_1 = 1\\). From \\(a_1 = 6\\): \\((1+\\alpha_2)\\cdot 3 = 6\\), so \\(\\alpha_2 = 1\\). Answer: \\(a_n = (1+n)3^n\\).'
                },
                {
                    question: 'Find the general solution of \\(a_n = 2a_{n-1} + 3a_{n-2}\\). What is the growth rate for large \\(n\\)?',
                    hint: 'Factor \\(r^2 - 2r - 3\\). One root dominates for large \\(n\\).',
                    solution: '\\(r^2 - 2r - 3 = (r-3)(r+1) = 0\\). Roots: \\(r_1 = 3, r_2 = -1\\). General solution: \\(a_n = \\alpha_1 \\cdot 3^n + \\alpha_2 \\cdot (-1)^n\\). For large \\(n\\), the \\(3^n\\) term dominates (assuming \\(\\alpha_1 \\neq 0\\)), so \\(a_n \\sim \\alpha_1 \\cdot 3^n\\), i.e., exponential growth with base 3.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Nonhomogeneous Recurrences
        // ================================================================
        {
            id: 'sec-particular',
            title: 'Nonhomogeneous Recurrences',
            content: `
<h2>Nonhomogeneous Recurrences</h2>

<div class="env-block intuition">
    <div class="env-title">The Structure of the Solution</div>
    <div class="env-body">
        <p>A nonhomogeneous recurrence looks like:</p>
        \\[a_n = c_1 a_{n-1} + c_2 a_{n-2} + \\cdots + c_k a_{n-k} + f(n).\\]
        <p>The complete solution is always <strong>general solution of homogeneous part + one particular solution</strong>:</p>
        \\[a_n = a_n^{(h)} + a_n^{(p)}.\\]
        <p>This is the same superposition principle that appears in differential equations.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.3 (Superposition)</div>
    <div class="env-body">
        <p>If \\(a_n^{(h)}\\) is the general solution of the associated homogeneous recurrence (with \\(f(n) = 0\\)) and \\(a_n^{(p)}\\) is any particular solution of the full nonhomogeneous recurrence, then the general solution of the nonhomogeneous recurrence is</p>
        \\[a_n = a_n^{(h)} + a_n^{(p)}.\\]
    </div>
</div>

<h3>Method of Undetermined Coefficients</h3>

<p>To find a particular solution \\(a_n^{(p)}\\), we guess its form based on \\(f(n)\\):</p>

<table style="width:100%;border-collapse:collapse;margin:16px 0;">
<tr style="border-bottom:1px solid #30363d;">
    <th style="text-align:left;padding:8px;color:#8b949e;">\\(f(n)\\)</th>
    <th style="text-align:left;padding:8px;color:#8b949e;">Trial \\(a_n^{(p)}\\)</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:8px;">\\(d\\) (constant)</td>
    <td style="padding:8px;">\\(A\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:8px;">\\(dn + e\\)</td>
    <td style="padding:8px;">\\(An + B\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:8px;">\\(d \\cdot s^n\\)</td>
    <td style="padding:8px;">\\(A \\cdot s^n\\) (if \\(s\\) is not a characteristic root)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:8px;">\\(d \\cdot s^n\\) (\\(s\\) is a root of multiplicity \\(m\\))</td>
    <td style="padding:8px;">\\(A \\cdot n^m s^n\\)</td>
</tr>
<tr>
    <td style="padding:8px;">\\(p(n) \\cdot s^n\\) (polynomial degree \\(d\\))</td>
    <td style="padding:8px;">\\(n^m (A_d n^d + \\cdots + A_0) s^n\\)</td>
</tr>
</table>

<div class="env-block example">
    <div class="env-title">Example: Tower of Hanoi Revisited</div>
    <div class="env-body">
        <p>Solve \\(T_n = 2T_{n-1} + 1\\) with \\(T_0 = 0\\).</p>
        <p><strong>Step 1 (Homogeneous):</strong> \\(T_n^{(h)} = \\alpha \\cdot 2^n\\). (Characteristic root: \\(r = 2\\).)</p>
        <p><strong>Step 2 (Particular):</strong> \\(f(n) = 1\\) is constant. Try \\(T_n^{(p)} = A\\). Substituting: \\(A = 2A + 1\\), so \\(A = -1\\).</p>
        <p><strong>Step 3 (General):</strong> \\(T_n = \\alpha \\cdot 2^n - 1\\). From \\(T_0 = 0\\): \\(\\alpha - 1 = 0\\), so \\(\\alpha = 1\\).</p>
        <p>Answer: \\(T_n = 2^n - 1\\). \\(\\checkmark\\)</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Linear Forcing</div>
    <div class="env-body">
        <p>Solve \\(a_n = 3a_{n-1} + 2n\\) with \\(a_0 = 1\\).</p>
        <p><strong>Homogeneous:</strong> \\(a_n^{(h)} = \\alpha \\cdot 3^n\\).</p>
        <p><strong>Particular:</strong> Try \\(a_n^{(p)} = An + B\\). Substituting:</p>
        \\[An + B = 3(A(n-1) + B) + 2n = (3A + 2)n + (-3A + 3B).\\]
        <p>Matching coefficients: \\(A = 3A + 2\\) gives \\(A = -1\\), and \\(B = -3(-1) + 3B\\) gives \\(B = -3/2\\).</p>
        <p>General solution: \\(a_n = \\alpha \\cdot 3^n - n - 3/2\\). From \\(a_0 = 1\\): \\(\\alpha = 5/2\\).</p>
        <p>Answer: \\(a_n = \\frac{5}{2} \\cdot 3^n - n - \\frac{3}{2}\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">When the Trial Fails</div>
    <div class="env-body">
        <p>If \\(f(n) = d \\cdot s^n\\) and \\(s\\) happens to be a characteristic root, the standard trial \\(A s^n\\) will give \\(0 = d s^n\\), which fails. The fix is to multiply by \\(n\\): try \\(A n s^n\\) instead. If \\(s\\) is a root of multiplicity \\(m\\), multiply by \\(n^m\\).</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Solve \\(a_n = 2a_{n-1} + 3^n\\) with \\(a_0 = 1\\).',
                    hint: '3 is not a characteristic root (the root is 2), so try \\(a_n^{(p)} = A \\cdot 3^n\\).',
                    solution: 'Homogeneous: \\(a_n^{(h)} = \\alpha \\cdot 2^n\\). Particular: try \\(A \\cdot 3^n\\). Substituting: \\(A \\cdot 3^n = 2A \\cdot 3^{n-1} + 3^n\\). Dividing by \\(3^{n-1}\\): \\(3A = 2A + 3\\), so \\(A = 3\\). General: \\(a_n = \\alpha \\cdot 2^n + 3^{n+1}\\). From \\(a_0 = 1\\): \\(\\alpha + 3 = 1\\), so \\(\\alpha = -2\\). Answer: \\(a_n = -2^{n+1} + 3^{n+1}\\).'
                },
                {
                    question: 'Solve \\(a_n = 2a_{n-1} + 2^n\\) with \\(a_0 = 1\\). (Note: 2 is the characteristic root!)',
                    hint: 'Since 2 is a root of multiplicity 1, try \\(a_n^{(p)} = A \\cdot n \\cdot 2^n\\).',
                    solution: 'Homogeneous: \\(a_n^{(h)} = \\alpha \\cdot 2^n\\). Since 2 is the characteristic root, try \\(An \\cdot 2^n\\). Substituting: \\(An \\cdot 2^n = 2A(n-1) \\cdot 2^{n-1} + 2^n = A(n-1) \\cdot 2^n + 2^n\\). So \\(An = A(n-1) + 1\\), giving \\(A = 1\\). General: \\(a_n = \\alpha \\cdot 2^n + n \\cdot 2^n = (\\alpha + n)2^n\\). From \\(a_0 = 1\\): \\(\\alpha = 1\\). Answer: \\(a_n = (n+1)2^n\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Fibonacci & Lucas
        // ================================================================
        {
            id: 'sec-fibonacci',
            title: 'Fibonacci & Lucas',
            content: `
<h2>Fibonacci and Lucas Numbers</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Fibonacci Numbers)</div>
    <div class="env-body">
        <p>The <strong>Fibonacci numbers</strong> are defined by:</p>
        \\[F_0 = 0, \\quad F_1 = 1, \\quad F_n = F_{n-1} + F_{n-2} \\quad (n \\geq 2).\\]
        <p>The sequence begins: \\(0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, \\ldots\\)</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Lucas Numbers)</div>
    <div class="env-body">
        <p>The <strong>Lucas numbers</strong> satisfy the same recurrence but with different initial conditions:</p>
        \\[L_0 = 2, \\quad L_1 = 1, \\quad L_n = L_{n-1} + L_{n-2} \\quad (n \\geq 2).\\]
        <p>The sequence begins: \\(2, 1, 3, 4, 7, 11, 18, 29, 47, 76, \\ldots\\)</p>
    </div>
</div>

<h3>The Golden Ratio and Binet's Formula</h3>

<p>The characteristic equation for both sequences is \\(r^2 - r - 1 = 0\\), with roots:</p>

\\[\\phi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618 \\quad \\text{(the golden ratio)}, \\qquad \\hat{\\phi} = \\frac{1 - \\sqrt{5}}{2} \\approx -0.618.\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 8.4 (Binet's Formula)</div>
    <div class="env-body">
        \\[F_n = \\frac{\\phi^n - \\hat{\\phi}^n}{\\sqrt{5}}.\\]
        <p>Since \\(|\\hat{\\phi}| < 1\\), the term \\(\\hat{\\phi}^n \\to 0\\) as \\(n \\to \\infty\\), so \\(F_n\\) is the nearest integer to \\(\\phi^n / \\sqrt{5}\\) for \\(n \\geq 1\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>General solution: \\(F_n = \\alpha \\phi^n + \\beta \\hat{\\phi}^n\\). From \\(F_0 = 0\\): \\(\\alpha + \\beta = 0\\). From \\(F_1 = 1\\): \\(\\alpha \\phi + \\beta \\hat{\\phi} = 1\\).</p>
        <p>So \\(\\beta = -\\alpha\\) and \\(\\alpha(\\phi - \\hat{\\phi}) = 1\\). Since \\(\\phi - \\hat{\\phi} = \\sqrt{5}\\), we get \\(\\alpha = 1/\\sqrt{5}\\), \\(\\beta = -1/\\sqrt{5}\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Properties of Fibonacci Numbers</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.5 (Fibonacci Identities)</div>
    <div class="env-body">
        <ol>
            <li><strong>Cassini's identity:</strong> \\(F_{n-1}F_{n+1} - F_n^2 = (-1)^n\\).</li>
            <li><strong>Sum of first \\(n\\):</strong> \\(\\sum_{i=1}^{n} F_i = F_{n+2} - 1\\).</li>
            <li><strong>Ratio convergence:</strong> \\(\\displaystyle \\lim_{n \\to \\infty} \\frac{F_{n+1}}{F_n} = \\phi\\).</li>
            <li><strong>GCD property:</strong> \\(\\gcd(F_m, F_n) = F_{\\gcd(m,n)}\\).</li>
        </ol>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-golden-ratio"></div>

<div class="viz-placeholder" data-viz="viz-fibonacci-spiral"></div>
`,
            visualizations: [
                {
                    id: 'viz-golden-ratio',
                    title: 'Fibonacci Ratios Converging to the Golden Ratio',
                    description: 'The ratio \\(F_{n+1}/F_n\\) oscillates around \\(\\phi \\approx 1.618\\), converging rapidly. Watch the ratios stabilize as \\(n\\) grows.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nMax = 15;
                        var animN = 0;
                        var animating = false;
                        var timer = null;

                        VizEngine.createSlider(controls, 'n max', 5, 25, nMax, 1, function(v) {
                            nMax = Math.round(v);
                            animN = nMax;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animN = 2;
                            function step() {
                                draw();
                                if (animN < nMax) {
                                    animN++;
                                    timer = setTimeout(step, 400);
                                } else {
                                    animating = false;
                                }
                            }
                            step();
                        });

                        var phi = (1 + Math.sqrt(5)) / 2;

                        function fib(n) {
                            var a = 0, b = 1;
                            for (var i = 0; i < n; i++) { var t = a + b; a = b; b = t; }
                            return a;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('F(n+1) / F(n) converges to \u03C6 \u2248 ' + phi.toFixed(6), viz.width / 2, 20, viz.colors.white, 13);

                            var chartLeft = 70;
                            var chartRight = viz.width - 30;
                            var chartTop = 50;
                            var chartBottom = 310;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;

                            // Y range: show phi +/- something
                            var yMin = 1.0;
                            var yMax = 2.5;
                            var yRange = yMax - yMin;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartBottom);
                            ctx.lineTo(chartRight, chartBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartTop);
                            ctx.lineTo(chartLeft, chartBottom);
                            ctx.stroke();

                            // Golden ratio line
                            var phiY = chartBottom - ((phi - yMin) / yRange) * chartH;
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, phiY);
                            ctx.lineTo(chartRight, phiY);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('\u03C6 = ' + phi.toFixed(4), chartRight - 80, phiY - 4);

                            // Y ticks
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yt = 1.0; yt <= 2.5; yt += 0.25) {
                                var yp = chartBottom - ((yt - yMin) / yRange) * chartH;
                                ctx.fillText(yt.toFixed(2), chartLeft - 6, yp);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(chartLeft, yp);
                                ctx.lineTo(chartRight, yp);
                                ctx.stroke();
                            }

                            // Plot ratios
                            var showN = animating ? animN : nMax;
                            var ratios = [];
                            for (var n = 2; n <= showN; n++) {
                                ratios.push({ n: n, ratio: fib(n + 1) / fib(n) });
                            }

                            // Connect with line
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var i = 0; i < ratios.length; i++) {
                                var x = chartLeft + ((ratios[i].n - 2) + 0.5) * chartW / (nMax - 1);
                                var y = chartBottom - ((ratios[i].ratio - yMin) / yRange) * chartH;
                                if (i === 0) ctx.moveTo(x, y);
                                else ctx.lineTo(x, y);
                            }
                            ctx.stroke();

                            // Points
                            for (var i = 0; i < ratios.length; i++) {
                                var x = chartLeft + ((ratios[i].n - 2) + 0.5) * chartW / (nMax - 1);
                                var y = chartBottom - ((ratios[i].ratio - yMin) / yRange) * chartH;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(x, y, 4, 0, Math.PI * 2);
                                ctx.fill();

                                // Label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(ratios[i].n.toString(), x, chartBottom + 4);
                            }

                            viz.screenText('n', chartLeft + chartW / 2, chartBottom + 20, viz.colors.text, 10);

                            // Show current ratio
                            if (ratios.length > 0) {
                                var last = ratios[ratios.length - 1];
                                var err = Math.abs(last.ratio - phi);
                                viz.screenText('F(' + (last.n+1) + ')/F(' + last.n + ') = ' + last.ratio.toFixed(8) + '    |error| = ' + err.toExponential(2), viz.width / 2, chartBottom + 38, viz.colors.teal, 11);
                            }
                        }

                        animN = nMax;
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-fibonacci-spiral',
                    title: 'Fibonacci Spiral',
                    description: 'Fibonacci numbers generate squares that tile a rectangle, and a spiral through them approximates the golden spiral. Click Animate to watch it build.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nSquares = 8;
                        var animIdx = 0;
                        var animating = false;
                        var timer = null;

                        VizEngine.createSlider(controls, 'Squares', 4, 12, nSquares, 1, function(v) {
                            nSquares = Math.round(v);
                            animIdx = nSquares;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animIdx = 1;
                            function step() {
                                draw();
                                if (animIdx < nSquares) {
                                    animIdx++;
                                    timer = setTimeout(step, 500);
                                } else {
                                    animating = false;
                                }
                            }
                            step();
                        });

                        var fibs = [1, 1];
                        for (var i = 2; i < 20; i++) fibs.push(fibs[i-1] + fibs[i-2]);

                        var squareColors = [
                            '#58a6ff44', '#3fb9a044', '#f0883e44', '#bc8cff44',
                            '#3fb95044', '#f8514944', '#d2992244', '#f778ba44',
                            '#58a6ff33', '#3fb9a033', '#f0883e33', '#bc8cff33'
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var showN = animating ? animIdx : nSquares;

                            // Compute bounding box of all squares
                            var rects = [];
                            var x = 0, y = 0;
                            var dir = 0; // 0=right, 1=up, 2=left, 3=down
                            for (var i = 0; i < showN; i++) {
                                var s = fibs[i];
                                var rx, ry;
                                if (dir === 0) { rx = x; ry = y - s; x += s; }
                                else if (dir === 1) { rx = x - s; ry = y - s; y -= s; }
                                else if (dir === 2) { rx = x - s; ry = y; x -= s; }
                                else { rx = x; ry = y; y += s; }
                                rects.push({ x: rx, y: ry, s: s, dir: dir });
                                dir = (dir + 1) % 4;
                            }

                            // Find bounding box
                            var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                            for (var i = 0; i < rects.length; i++) {
                                minX = Math.min(minX, rects[i].x);
                                maxX = Math.max(maxX, rects[i].x + rects[i].s);
                                minY = Math.min(minY, rects[i].y);
                                maxY = Math.max(maxY, rects[i].y + rects[i].s);
                            }

                            var bw = maxX - minX || 1;
                            var bh = maxY - minY || 1;
                            var margin = 40;
                            var scaleF = Math.min((viz.width - 2 * margin) / bw, (viz.height - 2 * margin - 30) / bh);
                            var offX = (viz.width - bw * scaleF) / 2 - minX * scaleF;
                            var offY = (viz.height - bh * scaleF) / 2 - minY * scaleF + 10;

                            viz.screenText('Fibonacci Spiral', viz.width / 2, 18, viz.colors.white, 14);

                            // Draw squares
                            for (var i = 0; i < rects.length; i++) {
                                var r = rects[i];
                                var sx = r.x * scaleF + offX;
                                var sy = r.y * scaleF + offY;
                                var ss = r.s * scaleF;

                                ctx.fillStyle = squareColors[i % squareColors.length];
                                ctx.fillRect(sx, sy, ss, ss);
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(sx, sy, ss, ss);

                                // Label
                                if (ss > 15) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = Math.min(14, ss * 0.4) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(r.s.toString(), sx + ss / 2, sy + ss / 2);
                                }
                            }

                            // Draw spiral arcs
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            for (var i = 0; i < rects.length; i++) {
                                var r = rects[i];
                                var sx = r.x * scaleF + offX;
                                var sy = r.y * scaleF + offY;
                                var ss = r.s * scaleF;

                                ctx.beginPath();
                                var cx, cy, startAngle;
                                if (r.dir === 0) { cx = sx + ss; cy = sy + ss; startAngle = Math.PI; }
                                else if (r.dir === 1) { cx = sx + ss; cy = sy; startAngle = Math.PI / 2; }
                                else if (r.dir === 2) { cx = sx; cy = sy; startAngle = 0; }
                                else { cx = sx; cy = sy + ss; startAngle = -Math.PI / 2; }
                                ctx.arc(cx, cy, ss, startAngle, startAngle + Math.PI / 2);
                                ctx.stroke();
                            }

                            // Fibonacci numbers at bottom
                            var fibStr = 'F: ';
                            for (var i = 0; i < showN; i++) {
                                fibStr += fibs[i];
                                if (i < showN - 1) fibStr += ', ';
                            }
                            viz.screenText(fibStr, viz.width / 2, viz.height - 15, viz.colors.muted, 10);
                        }

                        animIdx = nSquares;
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Binet\'s formula to show that \\(F_n\\) is always an integer, even though the formula involves \\(\\sqrt{5}\\).',
                    hint: 'Expand \\(\\phi^n\\) and \\(\\hat{\\phi}^n\\) using the binomial theorem. The irrational parts cancel.',
                    solution: 'By the binomial theorem, \\(\\phi^n = \\frac{1}{2^n}\\sum_{k=0}^{n}\\binom{n}{k}(\\sqrt{5})^k\\) and similarly for \\(\\hat{\\phi}^n\\) with \\((-\\sqrt{5})^k\\). When we subtract, the even-\\(k\\) terms cancel and the odd-\\(k\\) terms double: \\(\\phi^n - \\hat{\\phi}^n = \\frac{2}{2^n}\\sum_{k \\text{ odd}}\\binom{n}{k}5^{k/2}\\). Dividing by \\(\\sqrt{5}\\) gives an integer because each term has \\(5^{(k-1)/2}\\) in the numerator after cancellation.'
                },
                {
                    question: 'Prove Cassini\'s identity \\(F_{n-1}F_{n+1} - F_n^2 = (-1)^n\\) by strong induction.',
                    hint: 'For the inductive step, use \\(F_{n+1} = F_n + F_{n-1}\\) to rewrite \\(F_n F_{n+2} - F_{n+1}^2\\).',
                    solution: 'Base: \\(n=1\\): \\(F_0 F_2 - F_1^2 = 0 \\cdot 1 - 1 = -1 = (-1)^1\\). \\(\\checkmark\\) Inductive step: assume \\(F_{n-1}F_{n+1} - F_n^2 = (-1)^n\\). Then \\(F_n F_{n+2} - F_{n+1}^2 = F_n(F_{n+1} + F_n) - F_{n+1}^2 = F_n F_{n+1} + F_n^2 - F_{n+1}^2 = F_n^2 - F_{n+1}(F_{n+1} - F_n) = F_n^2 - F_{n+1} F_{n-1} = -(F_{n-1}F_{n+1} - F_n^2) = -(-1)^n = (-1)^{n+1}\\). \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 6: The Master Theorem
        // ================================================================
        {
            id: 'sec-master',
            title: 'The Master Theorem',
            content: `
<h2>The Master Theorem</h2>

<div class="env-block intuition">
    <div class="env-title">Divide and Conquer</div>
    <div class="env-body">
        <p>Many algorithms work by dividing a problem of size \\(n\\) into \\(a\\) subproblems, each of size \\(n/b\\), and then combining the results in \\(f(n)\\) time. This gives the recurrence:</p>
        \\[T(n) = aT(n/b) + f(n).\\]
        <p>Merge sort divides into \\(a = 2\\) halves (\\(b = 2\\)) and merges in \\(f(n) = \\Theta(n)\\) time. Binary search has \\(a = 1, b = 2, f(n) = \\Theta(1)\\). The Master Theorem gives a closed-form answer for all such recurrences.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.6 (Master Theorem)</div>
    <div class="env-body">
        <p>Let \\(a \\geq 1\\) and \\(b > 1\\) be constants, and let \\(f(n)\\) be a non-negative function. Consider</p>
        \\[T(n) = aT(n/b) + f(n).\\]
        <p>Let \\(c_{\\text{crit}} = \\log_b a\\). Then:</p>
        <ol>
            <li><strong>Case 1:</strong> If \\(f(n) = O(n^{c_{\\text{crit}} - \\varepsilon})\\) for some \\(\\varepsilon > 0\\), then \\(T(n) = \\Theta(n^{c_{\\text{crit}}})\\). <em>(Work is dominated by the leaves.)</em></li>
            <li><strong>Case 2:</strong> If \\(f(n) = \\Theta(n^{c_{\\text{crit}}} \\log^k n)\\) for some \\(k \\geq 0\\), then \\(T(n) = \\Theta(n^{c_{\\text{crit}}} \\log^{k+1} n)\\). <em>(Work is evenly spread across levels.)</em></li>
            <li><strong>Case 3:</strong> If \\(f(n) = \\Omega(n^{c_{\\text{crit}} + \\varepsilon})\\) for some \\(\\varepsilon > 0\\), and if \\(af(n/b) \\leq \\delta f(n)\\) for some \\(\\delta < 1\\) and large \\(n\\), then \\(T(n) = \\Theta(f(n))\\). <em>(Work is dominated by the root.)</em></li>
        </ol>
    </div>
</div>

<h3>Examples</h3>

<div class="env-block example">
    <div class="env-title">Merge Sort: \\(T(n) = 2T(n/2) + n\\)</div>
    <div class="env-body">
        <p>Here \\(a = 2, b = 2\\), so \\(c_{\\text{crit}} = \\log_2 2 = 1\\). And \\(f(n) = n = \\Theta(n^1 \\log^0 n)\\). This is Case 2 with \\(k = 0\\).</p>
        <p>Answer: \\(T(n) = \\Theta(n \\log n)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Binary Search: \\(T(n) = T(n/2) + 1\\)</div>
    <div class="env-body">
        <p>\\(a = 1, b = 2\\), so \\(c_{\\text{crit}} = \\log_2 1 = 0\\). And \\(f(n) = 1 = \\Theta(n^0 \\log^0 n)\\). Case 2 with \\(k = 0\\).</p>
        <p>Answer: \\(T(n) = \\Theta(\\log n)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Strassen's Matrix Multiplication: \\(T(n) = 7T(n/2) + n^2\\)</div>
    <div class="env-body">
        <p>\\(a = 7, b = 2\\), so \\(c_{\\text{crit}} = \\log_2 7 \\approx 2.807\\). And \\(f(n) = n^2 = O(n^{2.807 - \\varepsilon})\\) with \\(\\varepsilon \\approx 0.807\\). This is Case 1.</p>
        <p>Answer: \\(T(n) = \\Theta(n^{\\log_2 7}) \\approx \\Theta(n^{2.807})\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Gaps in the Master Theorem</div>
    <div class="env-body">
        <p>Not every \\(f(n)\\) fits into one of the three cases. For example, if \\(f(n) = n \\log \\log n\\) in a recurrence with \\(c_{\\text{crit}} = 1\\), neither Case 2 nor Case 3 applies. Such "gap" cases require more advanced methods (e.g., the Akra-Bazzi theorem).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-master-theorem"></div>

<div class="viz-placeholder" data-viz="viz-merge-sort"></div>
`,
            visualizations: [
                {
                    id: 'viz-master-theorem',
                    title: 'Master Theorem Classifier',
                    description: 'Set the parameters \\(a\\), \\(b\\), and the exponent of \\(f(n) = n^p\\) to see which case of the Master Theorem applies and the resulting asymptotic growth rate.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 2, b = 2, p = 1;

                        VizEngine.createSlider(controls, 'a', 1, 9, a, 1, function(v) { a = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'b', 2, 5, b, 1, function(v) { b = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'p (f(n)=n^p)', 0, 4, p, 0.5, function(v) { p = v; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var ccrit = Math.log(a) / Math.log(b);

                            viz.screenText('T(n) = ' + a + 'T(n/' + b + ') + n^' + p.toFixed(1), viz.width / 2, 25, viz.colors.white, 15);
                            viz.screenText('c_crit = log_' + b + '(' + a + ') = ' + ccrit.toFixed(3), viz.width / 2, 50, viz.colors.teal, 13);

                            var caseNum, result, caseColor, explanation;
                            var eps = 0.001;

                            if (p < ccrit - eps) {
                                caseNum = 1;
                                result = '\u0398(n^' + ccrit.toFixed(3) + ')';
                                caseColor = viz.colors.blue;
                                explanation = 'Leaves dominate: f(n) grows slower than n^c_crit';
                            } else if (p > ccrit + eps) {
                                caseNum = 3;
                                result = '\u0398(n^' + p.toFixed(1) + ')';
                                caseColor = viz.colors.orange;
                                explanation = 'Root dominates: f(n) grows faster than n^c_crit';
                            } else {
                                caseNum = 2;
                                result = '\u0398(n^' + ccrit.toFixed(3) + ' log n)';
                                caseColor = viz.colors.green;
                                explanation = 'Even split: f(n) matches n^c_crit';
                            }

                            viz.screenText('Case ' + caseNum + ':  T(n) = ' + result, viz.width / 2, 85, caseColor, 16);
                            viz.screenText(explanation, viz.width / 2, 110, viz.colors.text, 11);

                            // Recursion tree visualization
                            var treeTop = 140;
                            var treeH = 200;
                            var levels = Math.min(5, Math.ceil(Math.log(64) / Math.log(b)));

                            // Draw levels of the tree
                            for (var lvl = 0; lvl < levels; lvl++) {
                                var nodesAtLevel = Math.pow(a, lvl);
                                var nodeSize = Math.min(b, 20);
                                var y = treeTop + lvl * treeH / levels;
                                var workAtLevel = Math.pow(a, lvl) * Math.pow(1 / Math.pow(b, lvl), p);
                                var maxWork = Math.max(1, Math.pow(a, levels - 1));

                                // Normalize bar width
                                var barW = Math.min(200, (workAtLevel / Math.max(workAtLevel, 1)) * 200);

                                // Show nodes (limited display)
                                var showNodes = Math.min(nodesAtLevel, 16);
                                var spacing = Math.min(30, (viz.width * 0.4) / showNodes);
                                var startX = 80;

                                for (var nd = 0; nd < showNodes; nd++) {
                                    var nx = startX + nd * spacing;
                                    ctx.fillStyle = caseColor + '88';
                                    ctx.beginPath();
                                    ctx.arc(nx, y, Math.max(2, 6 - lvl), 0, Math.PI * 2);
                                    ctx.fill();
                                }
                                if (nodesAtLevel > showNodes) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('... (' + nodesAtLevel + ' nodes)', startX + showNodes * spacing + 5, y + 3);
                                }

                                // Level info on right
                                var problemSize = 'n/' + Math.pow(b, lvl);
                                if (lvl === 0) problemSize = 'n';
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('Level ' + lvl + ': ' + nodesAtLevel + ' \u00D7 (' + problemSize + ')^' + p.toFixed(1), viz.width - 20, y + 3);

                                // Draw lines to children (for first few)
                                if (lvl < levels - 1) {
                                    var childY = treeTop + (lvl + 1) * treeH / levels;
                                    var childNodes = Math.min(Math.pow(a, lvl + 1), 16);
                                    var childSpacing = Math.min(30, (viz.width * 0.4) / childNodes);
                                    for (var nd = 0; nd < Math.min(showNodes, 4); nd++) {
                                        var px = startX + nd * spacing;
                                        for (var ch = 0; ch < Math.min(a, 3); ch++) {
                                            var ci = nd * a + ch;
                                            if (ci < childNodes) {
                                                var cx = startX + ci * childSpacing;
                                                ctx.strokeStyle = viz.colors.grid;
                                                ctx.lineWidth = 0.5;
                                                ctx.beginPath();
                                                ctx.moveTo(px, y + 4);
                                                ctx.lineTo(cx, childY - 4);
                                                ctx.stroke();
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-merge-sort',
                    title: 'Merge Sort Recurrence',
                    description: 'Merge sort splits an array in half, sorts each half recursively, and merges. The recurrence \\(T(n) = 2T(n/2) + n\\) yields \\(T(n) = \\Theta(n \\log n)\\). Watch the splitting and merging process.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var arrSize = 8;
                        var arr = [];
                        var steps = [];
                        var stepIdx = 0;
                        var animating = false;
                        var timer = null;

                        VizEngine.createSlider(controls, 'Array size', 4, 16, arrSize, 1, function(v) {
                            arrSize = Math.round(v);
                            generateArray();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Shuffle & Sort', function() {
                            if (animating) return;
                            generateArray();
                            steps = [];
                            mergeSort(arr.slice(), 0, arr.length - 1, 0);
                            stepIdx = 0;
                            animating = true;
                            animStep();
                        });

                        function generateArray() {
                            arr = [];
                            for (var i = 1; i <= arrSize; i++) arr.push(i);
                            // Shuffle
                            for (var i = arr.length - 1; i > 0; i--) {
                                var j = Math.floor(Math.random() * (i + 1));
                                var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
                            }
                            steps = [{ type: 'initial', arr: arr.slice(), depth: 0, lo: 0, hi: arr.length - 1 }];
                            stepIdx = 0;
                        }

                        function mergeSort(a, lo, hi, depth) {
                            if (lo >= hi) return;
                            var mid = Math.floor((lo + hi) / 2);
                            steps.push({ type: 'split', lo: lo, hi: hi, mid: mid, depth: depth, arr: a.slice() });
                            mergeSort(a, lo, mid, depth + 1);
                            mergeSort(a, mid + 1, hi, depth + 1);
                            // Merge
                            var left = a.slice(lo, mid + 1);
                            var right = a.slice(mid + 1, hi + 1);
                            var i = 0, j = 0, k = lo;
                            while (i < left.length && j < right.length) {
                                if (left[i] <= right[j]) a[k++] = left[i++];
                                else a[k++] = right[j++];
                            }
                            while (i < left.length) a[k++] = left[i++];
                            while (j < right.length) a[k++] = right[j++];
                            steps.push({ type: 'merge', lo: lo, hi: hi, mid: mid, depth: depth, arr: a.slice() });
                        }

                        function animStep() {
                            draw();
                            if (stepIdx < steps.length - 1) {
                                stepIdx++;
                                timer = setTimeout(animStep, 600);
                            } else {
                                animating = false;
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var step = steps[stepIdx] || steps[0];

                            viz.screenText('Merge Sort: T(n) = 2T(n/2) + n = \u0398(n log n)', viz.width / 2, 20, viz.colors.white, 13);

                            var currentArr = step.arr;
                            var barW = Math.min(40, (viz.width - 80) / currentArr.length);
                            var maxVal = arrSize;
                            var chartBottom = 320;
                            var chartTop = 60;
                            var chartH = chartBottom - chartTop;
                            var startX = (viz.width - currentArr.length * barW) / 2;

                            for (var i = 0; i < currentArr.length; i++) {
                                var h = (currentArr[i] / maxVal) * chartH;
                                var x = startX + i * barW;
                                var y = chartBottom - h;

                                var color = viz.colors.blue;
                                if (step.type === 'split' || step.type === 'merge') {
                                    if (i >= step.lo && i <= step.mid) color = viz.colors.teal;
                                    else if (i > step.mid && i <= step.hi) color = viz.colors.orange;
                                }

                                ctx.fillStyle = color;
                                ctx.fillRect(x + 1, y, barW - 2, h);

                                // Value label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = Math.min(12, barW - 4) + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(currentArr[i].toString(), x + barW / 2, y - 2);
                            }

                            // Step info
                            var info = '';
                            if (step.type === 'initial') info = 'Initial array';
                            else if (step.type === 'split') info = 'Splitting [' + step.lo + '..' + step.hi + '] at mid=' + step.mid;
                            else if (step.type === 'merge') info = 'Merged [' + step.lo + '..' + step.hi + ']';

                            viz.screenText(info, viz.width / 2, 45, viz.colors.teal, 12);
                            viz.screenText('Step ' + (stepIdx + 1) + ' / ' + steps.length, viz.width / 2, chartBottom + 20, viz.colors.muted, 11);
                            viz.screenText('n = ' + arrSize + ', expected comparisons \u2248 ' + Math.round(arrSize * Math.log2(arrSize)), viz.width / 2, chartBottom + 40, viz.colors.text, 10);
                        }

                        generateArray();
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the Master Theorem to solve \\(T(n) = 4T(n/2) + n\\).',
                    hint: '\\(c_{\\text{crit}} = \\log_2 4 = 2\\). Compare with \\(f(n) = n = n^1\\).',
                    solution: '\\(a = 4, b = 2\\), so \\(c_{\\text{crit}} = \\log_2 4 = 2\\). Since \\(f(n) = n = O(n^{2 - 1})\\), this is Case 1 with \\(\\varepsilon = 1\\). Answer: \\(T(n) = \\Theta(n^2)\\).'
                },
                {
                    question: 'Use the Master Theorem to solve \\(T(n) = 2T(n/2) + n \\log n\\).',
                    hint: '\\(c_{\\text{crit}} = 1\\). Is \\(f(n) = n \\log n = \\Theta(n^1 \\log^k n)\\) for some \\(k\\)?',
                    solution: '\\(a = 2, b = 2\\), so \\(c_{\\text{crit}} = 1\\). We have \\(f(n) = n \\log n = \\Theta(n^1 \\log^1 n)\\), so this is Case 2 with \\(k = 1\\). Answer: \\(T(n) = \\Theta(n \\log^2 n)\\).'
                },
                {
                    question: 'Use the Master Theorem to solve \\(T(n) = 3T(n/4) + n \\sqrt{n}\\).',
                    hint: '\\(c_{\\text{crit}} = \\log_4 3 \\approx 0.792\\). Compare with the exponent of \\(f(n) = n^{3/2}\\).',
                    solution: '\\(a = 3, b = 4\\), \\(c_{\\text{crit}} = \\log_4 3 \\approx 0.792\\). Here \\(f(n) = n^{1.5} = \\Omega(n^{0.792 + \\varepsilon})\\) with \\(\\varepsilon \\approx 0.708\\). Check regularity: \\(3f(n/4) = 3(n/4)^{1.5} = 3n^{1.5}/8 = (3/8)f(n)\\), so \\(\\delta = 3/8 < 1\\). Case 3 applies. Answer: \\(T(n) = \\Theta(n^{3/2})\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Forward',
            content: `
<h2>Looking Forward: Generating Functions</h2>

<p>In this chapter, we developed three main tools for solving recurrences:</p>

<ol>
    <li><strong>Characteristic equation method</strong> for linear homogeneous recurrences with constant coefficients.</li>
    <li><strong>Method of undetermined coefficients</strong> for nonhomogeneous recurrences.</li>
    <li><strong>The Master Theorem</strong> for divide-and-conquer recurrences.</li>
</ol>

<p>These methods cover a wide range of practical cases, but they have limitations. The characteristic equation method requires constant coefficients. The method of undetermined coefficients requires guessing the right form for the particular solution. The Master Theorem applies only to a specific pattern of divide-and-conquer recurrences.</p>

<h3>The Power of Generating Functions</h3>

<p>The next chapter introduces <strong>generating functions</strong>, a remarkably general technique that converts a recurrence relation into an algebraic equation. The idea is to encode the entire sequence \\(a_0, a_1, a_2, \\ldots\\) as the coefficients of a power series:</p>

\\[A(x) = \\sum_{n=0}^{\\infty} a_n x^n = a_0 + a_1 x + a_2 x^2 + \\cdots\\]

<p>The recurrence relation for \\(a_n\\) translates into a functional equation for \\(A(x)\\), which we can often solve algebraically. For example, the Fibonacci recurrence \\(F_n = F_{n-1} + F_{n-2}\\) translates into:</p>

\\[A(x) = xA(x) + x^2 A(x) + x,\\]

<p>which gives \\(A(x) = \\frac{x}{1 - x - x^2}\\). Partial fraction decomposition then recovers Binet's formula automatically.</p>

<h3>What Generating Functions Add</h3>

<ul>
    <li><strong>Universality:</strong> The method works for any recurrence, not just constant-coefficient linear ones.</li>
    <li><strong>Counting power:</strong> Generating functions provide a unified framework for combinatorial enumeration far beyond what direct counting offers.</li>
    <li><strong>Asymptotic analysis:</strong> The singularities of \\(A(x)\\) determine the growth rate of \\(a_n\\), connecting algebra to analysis.</li>
    <li><strong>Convolution:</strong> Multiplying generating functions corresponds to summing products of sequence terms, making it easy to handle sums like \\(\\sum_{k=0}^{n} a_k b_{n-k}\\).</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Bigger Picture</div>
    <div class="env-body">
        <p>Recurrence relations are one of the core tools in discrete mathematics. They connect counting (Chapter 6 and 7) to algorithms (graph algorithms in later chapters use recurrences for running time analysis) and to generating functions (Chapter 9). Every time you see a recursive structure, whether in a proof, an algorithm, or a counting argument, a recurrence is lurking underneath.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The Catalan numbers satisfy \\(C_0 = 1\\) and \\(C_{n+1} = \\sum_{k=0}^{n} C_k C_{n-k}\\). Compute \\(C_1, C_2, C_3, C_4\\).',
                    hint: 'Use the recurrence directly. \\(C_1 = C_0 C_0 = 1\\). For \\(C_2\\), sum over \\(k = 0, 1\\).',
                    solution: '\\(C_1 = C_0 C_0 = 1\\). \\(C_2 = C_0 C_1 + C_1 C_0 = 1 + 1 = 2\\). \\(C_3 = C_0 C_2 + C_1 C_1 + C_2 C_0 = 2 + 1 + 2 = 5\\). \\(C_4 = C_0 C_3 + C_1 C_2 + C_2 C_1 + C_3 C_0 = 5 + 2 + 2 + 5 = 14\\). The Catalan numbers are \\(1, 1, 2, 5, 14, 42, \\ldots\\)'
                },
                {
                    question: 'A robot can take steps of size 1 or 2 on a staircase of \\(n\\) steps. Let \\(S_n\\) be the number of ways to climb. Find a recurrence for \\(S_n\\), solve it, and identify the connection to Fibonacci numbers.',
                    hint: 'The last step is either 1 or 2. What remains?',
                    solution: 'If the last step is size 1, there are \\(S_{n-1}\\) ways for the first \\(n-1\\) steps. If size 2, there are \\(S_{n-2}\\) ways. So \\(S_n = S_{n-1} + S_{n-2}\\) with \\(S_1 = 1, S_2 = 2\\). This is the Fibonacci sequence shifted by one: \\(S_n = F_{n+1}\\). The closed form is \\(S_n = \\frac{\\phi^{n+1} - \\hat{\\phi}^{n+1}}{\\sqrt{5}}\\).'
                }
            ]
        }
    ]
});
