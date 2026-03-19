window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch09',
    number: 9,
    title: 'Generating Functions',
    subtitle: 'Encoding sequences as power series',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Generating Functions?',
            content: `
<h2>Why Generating Functions?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Idea</div>
    <div class="env-body">
        <p>A sequence of numbers \\(a_0, a_1, a_2, \\ldots\\) is just a list. But if we package it as a formal power series \\(A(x) = \\sum_{n \\geq 0} a_n x^n\\), something remarkable happens: algebraic operations on the power series translate into combinatorial operations on the sequence. Multiplication of series corresponds to convolution. Differentiation shifts and weights. Composition encodes substitution. The generating function turns sequence problems into algebra problems.</p>
    </div>
</div>

<p>We have already encountered recurrence relations (Chapter 8) as a way to define sequences implicitly. Generating functions give us a unified machine for <strong>solving</strong> those recurrences, extracting closed-form expressions, and proving combinatorial identities.</p>

<h3>A First Taste</h3>

<p>Consider the geometric series. The sequence \\(1, 1, 1, \\ldots\\) (all ones) has generating function</p>
\\[
\\sum_{n \\geq 0} x^n = \\frac{1}{1 - x}.
\\]
<p>This identity, valid as a formal power series, lets us "compress" an infinite sequence into a single rational expression. Want the sequence \\(1, 2, 4, 8, \\ldots\\)? Replace \\(x\\) by \\(2x\\):</p>
\\[
\\sum_{n \\geq 0} (2x)^n = \\frac{1}{1 - 2x}.
\\]

<p>The coefficient of \\(x^n\\) in \\(\\frac{1}{1-2x}\\) is \\(2^n\\), exactly the \\(n\\)-th term of our sequence. This principle, that a closed-form generating function "knows" every term of its sequence, is what makes the method so powerful.</p>

<h3>What Generating Functions Are Not</h3>

<p>We treat \\(A(x)\\) as a <em>formal</em> power series. We never worry about convergence: \\(x\\) is not a number, it is an indeterminate. The operations we perform (addition, multiplication, differentiation) are purely algebraic, defined on the ring of formal power series \\(\\mathbb{R}[[x]]\\). When we write \\(\\frac{1}{1-x}\\), we mean the unique power series whose product with \\((1-x)\\) is 1.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Euler was the first to exploit generating functions systematically, using them to study partition numbers in the 1740s. The term "generating function" (fonction generatrice) was coined by Laplace. Today they are an indispensable tool in combinatorics, probability, and analysis of algorithms.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Ordinary Generating Functions
        // ================================================================
        {
            id: 'sec-definition',
            title: 'Ordinary Generating Functions',
            content: `
<h2>Ordinary Generating Functions</h2>

<div class="env-block definition">
    <div class="env-title">Definition 9.1 (Ordinary Generating Function)</div>
    <div class="env-body">
        <p>The <strong>ordinary generating function</strong> (OGF) of a sequence \\((a_n)_{n \\geq 0}\\) is the formal power series</p>
        \\[A(x) = \\sum_{n=0}^{\\infty} a_n x^n = a_0 + a_1 x + a_2 x^2 + a_3 x^3 + \\cdots\\]
        <p>We write \\([x^n] A(x)\\) for the coefficient of \\(x^n\\) in \\(A(x)\\), so \\([x^n] A(x) = a_n\\).</p>
    </div>
</div>

<h3>Fundamental Examples</h3>

<div class="env-block example">
    <div class="env-title">Example: Common Generating Functions</div>
    <div class="env-body">
        <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #30363d;">
                <th style="text-align:left;padding:4px 8px;">Sequence \\(a_n\\)</th>
                <th style="text-align:left;padding:4px 8px;">Generating Function \\(A(x)\\)</th>
            </tr>
            <tr><td style="padding:4px 8px;">\\(1, 1, 1, 1, \\ldots\\)</td><td style="padding:4px 8px;">\\(\\frac{1}{1-x}\\)</td></tr>
            <tr><td style="padding:4px 8px;">\\(1, c, c^2, c^3, \\ldots\\)</td><td style="padding:4px 8px;">\\(\\frac{1}{1-cx}\\)</td></tr>
            <tr><td style="padding:4px 8px;">\\(1, 2, 3, 4, \\ldots\\)</td><td style="padding:4px 8px;">\\(\\frac{1}{(1-x)^2}\\)</td></tr>
            <tr><td style="padding:4px 8px;">\\(\\binom{n+k-1}{k-1}\\)</td><td style="padding:4px 8px;">\\(\\frac{1}{(1-x)^k}\\)</td></tr>
            <tr><td style="padding:4px 8px;">\\(1, 1, \\frac{1}{2}, \\frac{1}{6}, \\ldots\\) (i.e. \\(\\frac{1}{n!}\\))</td><td style="padding:4px 8px;">\\(e^x\\) (EGF, not OGF)</td></tr>
        </table>
    </div>
</div>

<p>The first two follow from the geometric series formula. The third follows by differentiating \\(\\frac{1}{1-x} = \\sum x^n\\):</p>
\\[
\\frac{d}{dx}\\frac{1}{1-x} = \\frac{1}{(1-x)^2} = \\sum_{n=0}^{\\infty}(n+1)x^n.
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 9.1 (Negative Binomial Series)</div>
    <div class="env-body">
        <p>For any positive integer \\(k\\),</p>
        \\[\\frac{1}{(1-x)^k} = \\sum_{n=0}^{\\infty} \\binom{n+k-1}{k-1} x^n.\\]
        <p>The coefficient \\(\\binom{n+k-1}{k-1}\\) counts the number of ways to choose \\(n\\) items from \\(k\\) types with repetition (stars and bars).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-gf-builder"></div>
`,
            visualizations: [
                {
                    id: 'viz-gf-builder',
                    title: 'Generating Function Builder',
                    description: 'Enter a sequence and see its generating function as a partial sum. The bar chart shows the coefficients, and the curve shows the polynomial evaluated at x.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 80, originY: 300, scale: 30
                        });

                        var seqType = 'geometric';
                        var param = 0.5;
                        var nTerms = 10;

                        var selDiv = document.createElement('div');
                        selDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;flex-wrap:wrap;';
                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;';
                        var opts = [
                            ['geometric', '1, c, c^2, ...'],
                            ['naturals', '1, 2, 3, 4, ...'],
                            ['powers2', '1, 2, 4, 8, ...'],
                            ['fibonacci', 'Fibonacci'],
                            ['catalan', 'Catalan']
                        ];
                        for (var i = 0; i < opts.length; i++) {
                            var o = document.createElement('option');
                            o.value = opts[i][0]; o.textContent = opts[i][1];
                            sel.appendChild(o);
                        }
                        sel.addEventListener('change', function() { seqType = sel.value; draw(); });
                        selDiv.appendChild(sel);
                        controls.appendChild(selDiv);

                        VizEngine.createSlider(controls, 'c (geom)', 0.1, 2.0, param, 0.1, function(v) { param = v; draw(); });
                        VizEngine.createSlider(controls, 'Terms', 3, 20, nTerms, 1, function(v) { nTerms = Math.round(v); draw(); });

                        function getSequence() {
                            var seq = [];
                            if (seqType === 'geometric') {
                                for (var i = 0; i < nTerms; i++) seq.push(Math.pow(param, i));
                            } else if (seqType === 'naturals') {
                                for (var i = 0; i < nTerms; i++) seq.push(i + 1);
                            } else if (seqType === 'powers2') {
                                for (var i = 0; i < nTerms; i++) seq.push(Math.pow(2, i));
                            } else if (seqType === 'fibonacci') {
                                seq = [0, 1];
                                for (var i = 2; i < nTerms; i++) seq.push(seq[i-1] + seq[i-2]);
                            } else if (seqType === 'catalan') {
                                seq = [1];
                                for (var i = 1; i < nTerms; i++) {
                                    var c = 0;
                                    for (var j = 0; j < i; j++) c += seq[j] * seq[i-1-j];
                                    seq.push(c);
                                }
                            }
                            return seq;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var seq = getSequence();

                            viz.screenText('Generating Function Builder', viz.width / 2, 18, viz.colors.white, 15);

                            // Bar chart of coefficients
                            var maxVal = Math.max.apply(null, seq.map(function(v) { return Math.abs(v); }));
                            if (maxVal < 1) maxVal = 1;
                            var barW = Math.min(30, (viz.width - 120) / nTerms);
                            var chartLeft = 90;
                            var chartBottom = 290;
                            var chartH = 220;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartLeft - 5, chartBottom); ctx.lineTo(chartLeft + nTerms * barW + 10, chartBottom); ctx.stroke();

                            for (var i = 0; i < seq.length; i++) {
                                var h = (seq[i] / maxVal) * chartH;
                                var x = chartLeft + i * barW;
                                ctx.fillStyle = viz.colors.blue + 'bb';
                                ctx.fillRect(x + 2, chartBottom - h, barW - 4, h);

                                // Label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(i.toString(), x + barW / 2, chartBottom + 3);

                                // Value on top
                                var valText = seq[i] >= 1000 ? seq[i].toExponential(0) : (Number.isInteger(seq[i]) ? seq[i].toString() : seq[i].toFixed(2));
                                if (h > 15) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textBaseline = 'bottom';
                                    ctx.fillText(valText, x + barW / 2, chartBottom - h - 2);
                                }
                            }

                            // Labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('n', chartLeft + nTerms * barW / 2, chartBottom + 18);

                            // Show closed form
                            var closedForm = '';
                            if (seqType === 'geometric') closedForm = 'A(x) = 1/(1 - ' + param.toFixed(1) + 'x)';
                            else if (seqType === 'naturals') closedForm = 'A(x) = 1/(1 - x)^2';
                            else if (seqType === 'powers2') closedForm = 'A(x) = 1/(1 - 2x)';
                            else if (seqType === 'fibonacci') closedForm = 'A(x) = x/(1 - x - x^2)';
                            else if (seqType === 'catalan') closedForm = 'A(x) = (1 - sqrt(1 - 4x))/(2x)';

                            viz.screenText(closedForm, viz.width / 2, chartBottom + 42, viz.colors.teal, 13);

                            // Partial sum info
                            var partialSum = 0;
                            for (var k = 0; k < seq.length; k++) partialSum += seq[k];
                            viz.screenText('Sum of ' + nTerms + ' terms: ' + (Number.isInteger(partialSum) ? partialSum.toLocaleString() : partialSum.toFixed(3)), viz.width / 2, chartBottom + 62, viz.colors.orange, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the ordinary generating function for the sequence \\(a_n = 3^n\\).',
                    hint: 'Substitute \\(cx\\) for \\(x\\) in the geometric series \\(\\frac{1}{1-x} = \\sum x^n\\).',
                    solution: '\\(A(x) = \\sum_{n \\geq 0} 3^n x^n = \\sum_{n \\geq 0} (3x)^n = \\frac{1}{1-3x}\\).'
                },
                {
                    question: 'What sequence has generating function \\(\\frac{x}{(1-x)^2}\\)?',
                    hint: 'We know \\(\\frac{1}{(1-x)^2} = \\sum (n+1)x^n\\). What does multiplying by \\(x\\) do to the sequence?',
                    solution: 'Multiplying by \\(x\\) shifts the sequence: \\(\\frac{x}{(1-x)^2} = \\sum_{n \\geq 0}(n+1)x^{n+1} = \\sum_{n \\geq 1} n x^n\\). So the sequence is \\(a_0 = 0, a_1 = 1, a_2 = 2, a_3 = 3, \\ldots\\), i.e. \\(a_n = n\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Operations on Generating Functions
        // ================================================================
        {
            id: 'sec-operations',
            title: 'Operations',
            content: `
<h2>Operations on Generating Functions</h2>

<p>The power of generating functions comes from the correspondence between algebraic operations on the series and combinatorial operations on the underlying sequences.</p>

<h3>Addition</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.2 (Addition)</div>
    <div class="env-body">
        <p>If \\(A(x) = \\sum a_n x^n\\) and \\(B(x) = \\sum b_n x^n\\), then</p>
        \\[A(x) + B(x) = \\sum_{n \\geq 0} (a_n + b_n) x^n.\\]
        <p>Term-by-term addition of the series corresponds to term-by-term addition of the sequences.</p>
    </div>
</div>

<h3>Multiplication (Convolution)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.3 (Multiplication = Convolution)</div>
    <div class="env-body">
        <p>If \\(A(x) = \\sum a_n x^n\\) and \\(B(x) = \\sum b_n x^n\\), then</p>
        \\[A(x) \\cdot B(x) = \\sum_{n \\geq 0} c_n x^n, \\qquad \\text{where } c_n = \\sum_{k=0}^{n} a_k b_{n-k}.\\]
        <p>The sequence \\((c_n)\\) is the <strong>convolution</strong> of \\((a_n)\\) and \\((b_n)\\). Combinatorially, it counts the number of ways to split \\(n\\) into two parts and combine choices from each.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Convolution as Counting</div>
    <div class="env-body">
        <p>The number of ways to write \\(n\\) as an ordered sum of a non-negative integer from set \\(A\\) and one from set \\(B\\) is exactly \\(c_n\\), where \\(A(x) = \\sum_{a \\in A} x^a\\) and \\(B(x) = \\sum_{b \\in B} x^b\\). This principle underlies the coin-change problem.</p>
    </div>
</div>

<h3>Shifting</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.4 (Right Shift)</div>
    <div class="env-body">
        <p>If \\(A(x) = \\sum_{n \\geq 0} a_n x^n\\), then \\(x^k A(x) = \\sum_{n \\geq k} a_{n-k} x^n\\).</p>
        <p>Multiplying by \\(x^k\\) shifts the sequence right by \\(k\\) positions, inserting \\(k\\) zeros at the front.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.5 (Left Shift)</div>
    <div class="env-body">
        <p>To remove the first term: \\(\\frac{A(x) - a_0}{x} = \\sum_{n \\geq 0} a_{n+1} x^n\\).</p>
        <p>More generally, \\(\\frac{A(x) - a_0 - a_1 x - \\cdots - a_{k-1}x^{k-1}}{x^k} = \\sum_{n \\geq 0} a_{n+k} x^n\\).</p>
    </div>
</div>

<h3>Differentiation</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.6 (Differentiation)</div>
    <div class="env-body">
        <p>If \\(A(x) = \\sum a_n x^n\\), then \\(A'(x) = \\sum_{n \\geq 1} n a_n x^{n-1} = \\sum_{n \\geq 0} (n+1) a_{n+1} x^n\\).</p>
        <p>Differentiation both shifts left and multiplies by the index. In particular, \\(xA'(x) = \\sum n a_n x^n\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Deriving \\(\\sum n x^n\\)</div>
    <div class="env-body">
        <p>Starting from \\(\\frac{1}{1-x} = \\sum x^n\\), differentiate to get \\(\\frac{1}{(1-x)^2} = \\sum (n+1) x^n\\). Multiply by \\(x\\):</p>
        \\[\\frac{x}{(1-x)^2} = \\sum_{n \\geq 0} n x^n.\\]
        <p>Setting \\(x = 1/2\\): \\(\\sum_{n \\geq 0} n/2^n = \\frac{1/2}{(1/2)^2} = 2\\). The expected value of a geometric random variable with \\(p = 1/2\\)!</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-gf-operations"></div>
`,
            visualizations: [
                {
                    id: 'viz-gf-operations',
                    title: 'Operations on Generating Functions',
                    description: 'See how addition and multiplication (convolution) work on two sequences. The top two rows show the input sequences, the bottom row shows the result.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var op = 'multiply';
                        var nTerms = 8;
                        var seqA = 'ones';
                        var seqB = 'ones';

                        var selOp = document.createElement('select');
                        selOp.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        var opOpts = [['multiply', 'Multiply (Convolution)'], ['add', 'Add']];
                        for (var i = 0; i < opOpts.length; i++) {
                            var o = document.createElement('option'); o.value = opOpts[i][0]; o.textContent = opOpts[i][1]; selOp.appendChild(o);
                        }
                        selOp.addEventListener('change', function() { op = selOp.value; draw(); });
                        controls.appendChild(selOp);

                        function makeSeqSelect(label, initial, onChange) {
                            var s = document.createElement('select');
                            s.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                            var choices = [['ones','1,1,1,...'],['naturals','1,2,3,...'],['geo_half','1,1/2,1/4,...'],['fib','Fibonacci']];
                            for (var j = 0; j < choices.length; j++) {
                                var o = document.createElement('option'); o.value = choices[j][0]; o.textContent = label + ': ' + choices[j][1];
                                if (choices[j][0] === initial) o.selected = true;
                                s.appendChild(o);
                            }
                            s.addEventListener('change', function() { onChange(s.value); draw(); });
                            controls.appendChild(s);
                        }
                        makeSeqSelect('A', 'ones', function(v) { seqA = v; });
                        makeSeqSelect('B', 'ones', function(v) { seqB = v; });

                        function getSeq(type) {
                            var s = [];
                            for (var i = 0; i < nTerms; i++) {
                                if (type === 'ones') s.push(1);
                                else if (type === 'naturals') s.push(i + 1);
                                else if (type === 'geo_half') s.push(Math.pow(0.5, i));
                                else if (type === 'fib') { if (i === 0) s.push(0); else if (i === 1) s.push(1); else s.push(s[i-1]+s[i-2]); }
                            }
                            return s;
                        }

                        function convolve(a, b) {
                            var c = [];
                            for (var n = 0; n < a.length; n++) {
                                var val = 0;
                                for (var k = 0; k <= n; k++) val += a[k] * b[n - k];
                                c.push(val);
                            }
                            return c;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var a = getSeq(seqA);
                            var b = getSeq(seqB);
                            var c;
                            if (op === 'multiply') c = convolve(a, b);
                            else { c = []; for (var i = 0; i < nTerms; i++) c.push(a[i] + b[i]); }

                            var maxAll = Math.max.apply(null, a.concat(b).concat(c).map(function(v) { return Math.abs(v); }));
                            if (maxAll < 1) maxAll = 1;

                            var barW = Math.min(40, (viz.width - 140) / nTerms);
                            var chartLeft = 80;
                            var sections = [
                                { label: 'A(x) coefficients', data: a, color: viz.colors.blue, y: 40, h: 90 },
                                { label: 'B(x) coefficients', data: b, color: viz.colors.teal, y: 155, h: 90 },
                                { label: (op === 'multiply' ? 'A*B convolution' : 'A+B sum'), data: c, color: viz.colors.orange, y: 275, h: 110 }
                            ];

                            for (var s = 0; s < sections.length; s++) {
                                var sec = sections[s];
                                var localMax = Math.max.apply(null, sec.data.map(function(v) { return Math.abs(v); }));
                                if (localMax < 1) localMax = 1;

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(sec.label, chartLeft, sec.y);

                                for (var i = 0; i < sec.data.length; i++) {
                                    var h = (sec.data[i] / localMax) * (sec.h - 25);
                                    var x = chartLeft + i * barW;
                                    var base = sec.y + sec.h;
                                    ctx.fillStyle = sec.color + 'bb';
                                    ctx.fillRect(x + 2, base - h, barW - 4, h);

                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '8px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText(i.toString(), x + barW / 2, base + 2);

                                    if (h > 10) {
                                        var vt = Number.isInteger(sec.data[i]) ? sec.data[i].toString() : sec.data[i].toFixed(1);
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.font = '8px -apple-system,sans-serif';
                                        ctx.textBaseline = 'bottom';
                                        ctx.fillText(vt, x + barW / 2, base - h - 1);
                                    }
                                }
                            }

                            // Operator symbol
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 18px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(op === 'multiply' ? '\u00D7' : '+', 40, 200);
                            ctx.fillText('=', 40, 310);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the convolution of \\(a_n = 1\\) (for all \\(n \\geq 0\\)) with itself. What is the resulting sequence?',
                    hint: '\\(c_n = \\sum_{k=0}^{n} 1 \\cdot 1\\). Alternatively, use the product of generating functions: \\(\\frac{1}{1-x} \\cdot \\frac{1}{1-x} = ?\\)',
                    solution: '\\(c_n = \\sum_{k=0}^n 1 = n + 1\\). The product is \\(\\frac{1}{(1-x)^2} = \\sum (n+1) x^n\\), confirming the sequence \\(1, 2, 3, 4, \\ldots\\).'
                },
                {
                    question: 'If \\(A(x) = \\frac{1}{1-x}\\) and \\(B(x) = \\frac{1}{1-2x}\\), find \\([x^n](A(x) \\cdot B(x))\\) using partial fractions.',
                    hint: 'Multiply to get \\(\\frac{1}{(1-x)(1-2x)}\\) and decompose as \\(\\frac{A}{1-x} + \\frac{B}{1-2x}\\).',
                    solution: '\\(\\frac{1}{(1-x)(1-2x)} = \\frac{-1}{1-x} + \\frac{2}{1-2x}\\). So \\([x^n] = -1 + 2 \\cdot 2^n = 2^{n+1} - 1\\). One can verify: \\(c_n = \\sum_{k=0}^n 2^{n-k} = 2^{n+1}-1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Solving Recurrences with Generating Functions
        // ================================================================
        {
            id: 'sec-solving',
            title: 'Solving Recurrences',
            content: `
<h2>Solving Recurrences with Generating Functions</h2>

<div class="env-block intuition">
    <div class="env-title">The Method</div>
    <div class="env-body">
        <p>The generating function method for solving recurrences follows a systematic recipe:</p>
        <ol>
            <li><strong>Define</strong> \\(A(x) = \\sum a_n x^n\\).</li>
            <li><strong>Multiply</strong> both sides of the recurrence by \\(x^n\\) and <strong>sum</strong> over all valid \\(n\\).</li>
            <li><strong>Express</strong> each sum in terms of \\(A(x)\\) using the shift rules.</li>
            <li><strong>Solve</strong> the resulting algebraic equation for \\(A(x)\\).</li>
            <li><strong>Extract</strong> \\([x^n] A(x)\\) via partial fractions or the binomial series.</li>
        </ol>
    </div>
</div>

<h3>Example: Fibonacci Numbers</h3>

<p>Recall the Fibonacci recurrence: \\(F_0 = 0,\\; F_1 = 1,\\; F_n = F_{n-1} + F_{n-2}\\) for \\(n \\geq 2\\).</p>

<p><strong>Step 1.</strong> Let \\(F(x) = \\sum_{n \\geq 0} F_n x^n\\).</p>

<p><strong>Step 2-3.</strong> From the recurrence \\(F_n - F_{n-1} - F_{n-2} = 0\\) for \\(n \\geq 2\\), multiply by \\(x^n\\) and sum:</p>
\\[
\\sum_{n \\geq 2} F_n x^n - \\sum_{n \\geq 2} F_{n-1} x^n - \\sum_{n \\geq 2} F_{n-2} x^n = 0.
\\]
<p>Using the shift rules:</p>
\\[
(F(x) - F_0 - F_1 x) - x(F(x) - F_0) - x^2 F(x) = 0.
\\]
\\[
F(x) - x - xF(x) - x^2 F(x) = 0.
\\]

<p><strong>Step 4.</strong> Solve: \\(F(x)(1 - x - x^2) = x\\), so</p>
\\[
F(x) = \\frac{x}{1 - x - x^2}.
\\]

<p><strong>Step 5.</strong> Partial fractions. The roots of \\(1 - x - x^2 = 0\\) are \\(x = \\frac{-1 \\pm \\sqrt{5}}{2}\\), giving roots \\(r_1 = \\frac{1+\\sqrt{5}}{2} = \\varphi\\) (the golden ratio) and \\(r_2 = \\frac{1-\\sqrt{5}}{2}\\) for the reciprocal polynomial. We factor \\(1 - x - x^2 = (1 - \\varphi x)(1 - \\hat\\varphi x)\\), where \\(\\hat\\varphi = \\frac{1-\\sqrt{5}}{2}\\). Partial fractions give:</p>
\\[
F(x) = \\frac{1}{\\sqrt{5}} \\left( \\frac{1}{1 - \\varphi x} - \\frac{1}{1 - \\hat\\varphi x} \\right).
\\]
<p>Extracting coefficients:</p>
\\[
F_n = \\frac{\\varphi^n - \\hat\\varphi^n}{\\sqrt{5}} = \\frac{1}{\\sqrt{5}}\\left[\\left(\\frac{1+\\sqrt{5}}{2}\\right)^n - \\left(\\frac{1-\\sqrt{5}}{2}\\right)^n\\right].
\\]
<p>This is <strong>Binet's formula</strong>. Since \\(|\\hat\\varphi| < 1\\), for large \\(n\\) we have \\(F_n \\approx \\varphi^n / \\sqrt{5}\\), rounded to the nearest integer.</p>

<div class="viz-placeholder" data-viz="viz-fibonacci-gf"></div>

<h3>General Linear Recurrences</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.7 (GF of Linear Recurrences)</div>
    <div class="env-body">
        <p>Any sequence satisfying a linear recurrence \\(a_n = c_1 a_{n-1} + c_2 a_{n-2} + \\cdots + c_d a_{n-d}\\) has a generating function of the form \\(A(x) = \\frac{P(x)}{Q(x)}\\) where \\(\\deg P < \\deg Q = d\\) and \\(Q(x) = 1 - c_1 x - c_2 x^2 - \\cdots - c_d x^d\\).</p>
        <p>Conversely, every rational generating function \\(P(x)/Q(x)\\) with \\(\\deg P < \\deg Q\\) encodes a sequence satisfying a linear recurrence of order \\(\\deg Q\\).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-fibonacci-gf',
                    title: 'Fibonacci via Generating Functions',
                    description: "Binet's formula extracts exact Fibonacci numbers from the partial fraction decomposition of x/(1-x-x^2). The blue dots show actual Fibonacci numbers; the gold curve shows the Binet approximation.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var nMax = 15;
                        VizEngine.createSlider(controls, 'n max', 5, 25, nMax, 1, function(v) { nMax = Math.round(v); draw(); });

                        var phi = (1 + Math.sqrt(5)) / 2;
                        var psi = (1 - Math.sqrt(5)) / 2;

                        function fib(n) {
                            if (n <= 0) return 0;
                            var a = 0, b = 1;
                            for (var i = 2; i <= n; i++) { var t = a + b; a = b; b = t; }
                            return b;
                        }

                        function binet(n) {
                            return (Math.pow(phi, n) - Math.pow(psi, n)) / Math.sqrt(5);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Fibonacci Numbers & Binet\'s Formula', viz.width / 2, 18, viz.colors.white, 14);

                            var fibs = [];
                            for (var i = 0; i <= nMax; i++) fibs.push(fib(i));
                            var maxF = Math.max.apply(null, fibs);
                            if (maxF < 1) maxF = 1;

                            var chartLeft = 70;
                            var chartRight = viz.width - 30;
                            var chartBottom = 330;
                            var chartTop = 50;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;

                            // Use log scale if values get large
                            var useLog = maxF > 100;
                            var scaleMax = useLog ? Math.log10(maxF + 1) : maxF;

                            function yPos(v) {
                                var sv = useLog ? Math.log10(Math.max(v, 0.5) + 1) : v;
                                return chartBottom - (sv / scaleMax) * chartH;
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartLeft, chartBottom); ctx.lineTo(chartRight, chartBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartLeft, chartBottom); ctx.lineTo(chartLeft, chartTop); ctx.stroke();

                            if (useLog) {
                                viz.screenText('log scale', chartLeft - 30, chartTop + 10, viz.colors.text, 9);
                            }

                            // Binet curve (continuous)
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var t = 0; t <= nMax; t += 0.1) {
                                var bv = binet(t);
                                if (bv < 0) { started = false; continue; }
                                var sx = chartLeft + (t / nMax) * chartW;
                                var sy = yPos(bv);
                                if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Fibonacci dots
                            for (var i = 0; i <= nMax; i++) {
                                var sx = chartLeft + (i / nMax) * chartW;
                                var sy = yPos(fibs[i]);
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();

                                // n label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText(i.toString(), sx, chartBottom + 4);
                            }

                            // Legend
                            var legY = chartTop + 10;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(chartRight - 140, legY, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('F_n (exact)', chartRight - 130, legY + 4);

                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(chartRight - 145, legY + 20); ctx.lineTo(chartRight - 130, legY + 20); ctx.stroke();
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.fillText('Binet', chartRight - 125, legY + 24);

                            // Show formula
                            viz.screenText('F(x) = x / (1 - x - x^2)', viz.width / 2, chartBottom + 28, viz.colors.teal, 12);
                            viz.screenText('F_n = (phi^n - psi^n) / sqrt(5)', viz.width / 2, chartBottom + 44, viz.colors.orange, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use generating functions to solve the recurrence \\(a_n = 3a_{n-1}\\) with \\(a_0 = 2\\). Verify your answer.',
                    hint: 'Define \\(A(x) = \\sum a_n x^n\\). From the recurrence, \\(A(x) - 2 = 3x A(x)\\).',
                    solution: '\\(A(x)(1 - 3x) = 2\\), so \\(A(x) = \\frac{2}{1-3x} = 2 \\sum (3x)^n = \\sum 2 \\cdot 3^n x^n\\). Hence \\(a_n = 2 \\cdot 3^n\\). Check: \\(a_0 = 2\\), \\(a_1 = 6 = 3 \\cdot 2\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Solve \\(a_n = 2a_{n-1} + 1\\) with \\(a_0 = 0\\) using generating functions.',
                    hint: 'The right-hand side has the non-homogeneous term 1. Its generating function contribution is \\(\\frac{1}{1-x}\\) (summing \\(1 \\cdot x^n\\)).',
                    solution: 'Let \\(A(x) = \\sum a_n x^n\\). Then \\(A(x) - 0 = 2x A(x) + \\frac{x}{1-x}\\) (shifted by one since \\(n \\geq 1\\)). So \\(A(x)(1-2x) = \\frac{x}{1-x}\\), giving \\(A(x) = \\frac{x}{(1-x)(1-2x)}\\). Partial fractions: \\(\\frac{-1}{1-x} + \\frac{1}{1-2x}\\) times appropriate constants yield \\(a_n = 2^n - 1\\). Check: \\(a_0 = 0, a_1 = 1, a_2 = 3, a_3 = 7\\). \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Partition Numbers
        // ================================================================
        {
            id: 'sec-partition',
            title: 'Partition Numbers',
            content: `
<h2>Partition Numbers</h2>

<div class="env-block definition">
    <div class="env-title">Definition 9.2 (Integer Partition)</div>
    <div class="env-body">
        <p>A <strong>partition</strong> of a positive integer \\(n\\) is a way of writing \\(n\\) as a sum of positive integers, where the order does not matter. The number of partitions of \\(n\\) is denoted \\(p(n)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Partitions of 5</div>
    <div class="env-body">
        <p>The partitions of 5 are:</p>
        <p>5,&emsp; 4+1,&emsp; 3+2,&emsp; 3+1+1,&emsp; 2+2+1,&emsp; 2+1+1+1,&emsp; 1+1+1+1+1</p>
        <p>So \\(p(5) = 7\\). Each partition can be visualized as a <strong>Young diagram</strong> (or Ferrers diagram): rows of boxes, weakly decreasing from top to bottom.</p>
    </div>
</div>

<h3>Euler's Generating Function</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.8 (Euler's Partition Generating Function)</div>
    <div class="env-body">
        <p>The generating function for the partition numbers is</p>
        \\[\\sum_{n=0}^{\\infty} p(n) x^n = \\prod_{k=1}^{\\infty} \\frac{1}{1 - x^k}.\\]
        <p>Here \\(p(0) = 1\\) by convention (the empty partition).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (sketch)</div>
    <div class="env-body">
        <p>Each factor \\(\\frac{1}{1-x^k} = 1 + x^k + x^{2k} + x^{3k} + \\cdots\\) represents choosing how many copies of \\(k\\) appear in the partition: 0 copies (contributing \\(x^0\\)), 1 copy (contributing \\(x^k\\)), 2 copies (contributing \\(x^{2k}\\)), and so on. When we multiply all the factors for \\(k = 1, 2, 3, \\ldots\\), the coefficient of \\(x^n\\) in the product counts the number of ways to choose non-negative integers \\(m_1, m_2, m_3, \\ldots\\) such that \\(1 \\cdot m_1 + 2 \\cdot m_2 + 3 \\cdot m_3 + \\cdots = n\\). This is exactly \\(p(n)\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>Euler also proved striking identities about partitions. For instance, the number of partitions of \\(n\\) into <em>odd</em> parts equals the number of partitions into <em>distinct</em> parts. This follows from the generating function identity</p>
\\[
\\prod_{k=0}^{\\infty} \\frac{1}{1 - x^{2k+1}} = \\prod_{k=1}^{\\infty} (1 + x^k).
\\]

<div class="viz-placeholder" data-viz="viz-partition-numbers"></div>
<div class="viz-placeholder" data-viz="viz-coin-change"></div>

<div class="env-block remark">
    <div class="env-title">Remark: Asymptotic Growth</div>
    <div class="env-body">
        <p>Hardy and Ramanujan (1918) proved the famous asymptotic formula</p>
        \\[p(n) \\sim \\frac{1}{4n\\sqrt{3}} \\exp\\left(\\pi \\sqrt{\\frac{2n}{3}}\\right)\\]
        <p>as \\(n \\to \\infty\\). The partition function grows sub-exponentially but super-polynomially.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-partition-numbers',
                    title: 'Partitions & Young Diagrams',
                    description: 'See all partitions of n displayed as Young diagrams. Each row of boxes represents a part in the partition.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nVal = 5;
                        VizEngine.createSlider(controls, 'n', 1, 12, nVal, 1, function(v) { nVal = Math.round(v); draw(); });

                        function getPartitions(n) {
                            var result = [];
                            function helper(remaining, maxPart, current) {
                                if (remaining === 0) { result.push(current.slice()); return; }
                                for (var i = Math.min(remaining, maxPart); i >= 1; i--) {
                                    current.push(i);
                                    helper(remaining - i, i, current);
                                    current.pop();
                                }
                            }
                            helper(n, n, []);
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var parts = getPartitions(nVal);

                            viz.screenText('Partitions of ' + nVal, viz.width / 2, 18, viz.colors.white, 15);
                            viz.screenText('p(' + nVal + ') = ' + parts.length, viz.width / 2, 38, viz.colors.teal, 13);

                            // Draw Young diagrams in a grid
                            var cellSize = Math.max(6, Math.min(14, 200 / nVal));
                            var padding = 8;
                            var diagW = nVal * cellSize + padding;
                            var diagH = nVal * cellSize + padding + 14;

                            var cols = Math.max(1, Math.floor((viz.width - 20) / diagW));
                            var rows = Math.ceil(parts.length / cols);

                            var startX = (viz.width - Math.min(parts.length, cols) * diagW) / 2;
                            var startY = 56;

                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink];

                            for (var p = 0; p < parts.length; p++) {
                                var col = p % cols;
                                var row = Math.floor(p / cols);
                                var ox = startX + col * diagW;
                                var oy = startY + row * diagH;

                                if (oy + diagH > viz.height) break;

                                var part = parts[p];
                                var partColor = colors[p % colors.length];

                                // Draw boxes
                                for (var r = 0; r < part.length; r++) {
                                    for (var c = 0; c < part[r]; c++) {
                                        var bx = ox + c * cellSize;
                                        var by = oy + r * cellSize;
                                        ctx.fillStyle = partColor + '66';
                                        ctx.fillRect(bx, by, cellSize - 1, cellSize - 1);
                                        ctx.strokeStyle = partColor;
                                        ctx.lineWidth = 0.5;
                                        ctx.strokeRect(bx, by, cellSize - 1, cellSize - 1);
                                    }
                                }

                                // Label
                                var label = part.join('+');
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = Math.min(9, cellSize) + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'top';
                                ctx.fillText(label, ox, oy + part.length * cellSize + 2);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-coin-change',
                    title: 'Coin Change via Generating Functions',
                    description: 'Making change for n cents using coins of given denominations is a partition problem. Each coin denomination contributes a factor 1/(1-x^d) to the generating function.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var coins = [1, 5, 10, 25];
                        var nMax = 30;

                        VizEngine.createSlider(controls, 'Max cents', 10, 100, nMax, 5, function(v) { nMax = Math.round(v); draw(); });

                        var coinToggle = document.createElement('div');
                        coinToggle.style.cssText = 'display:flex;gap:6px;align-items:center;margin-top:2px;';
                        var allDenoms = [1, 5, 10, 25, 50];
                        for (var i = 0; i < allDenoms.length; i++) {
                            (function(d) {
                                var btn = document.createElement('button');
                                btn.style.cssText = 'padding:2px 8px;border:1px solid #30363d;border-radius:4px;background:' + (coins.indexOf(d) >= 0 ? '#58a6ff33' : '#1a1a40') + ';color:#c9d1d9;font-size:0.75rem;cursor:pointer;';
                                btn.textContent = d + '\u00A2';
                                btn.addEventListener('click', function() {
                                    var idx = coins.indexOf(d);
                                    if (idx >= 0) coins.splice(idx, 1); else coins.push(d);
                                    coins.sort(function(a,b) { return a-b; });
                                    btn.style.background = coins.indexOf(d) >= 0 ? '#58a6ff33' : '#1a1a40';
                                    draw();
                                });
                                coinToggle.appendChild(btn);
                            })(allDenoms[i]);
                        }
                        controls.appendChild(coinToggle);

                        function countWays(maxN, denominations) {
                            var dp = new Array(maxN + 1).fill(0);
                            dp[0] = 1;
                            for (var d = 0; d < denominations.length; d++) {
                                var coin = denominations[d];
                                for (var n = coin; n <= maxN; n++) {
                                    dp[n] += dp[n - coin];
                                }
                            }
                            return dp;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Making Change: Product of GFs', viz.width / 2, 18, viz.colors.white, 14);

                            var ways = countWays(nMax, coins);
                            var maxW = Math.max.apply(null, ways);
                            if (maxW < 1) maxW = 1;

                            var chartLeft = 70;
                            var chartBottom = 300;
                            var chartH = 230;
                            var barW = Math.min(18, (viz.width - 100) / (nMax + 1));

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartLeft - 5, chartBottom); ctx.lineTo(chartLeft + (nMax + 1) * barW + 5, chartBottom); ctx.stroke();

                            var useLog = maxW > 50;
                            var scaleMax = useLog ? Math.log10(maxW + 1) : maxW;

                            for (var n = 0; n <= nMax; n++) {
                                var val = ways[n];
                                var h = ((useLog ? Math.log10(val + 1) : val) / scaleMax) * chartH;
                                var x = chartLeft + n * barW;

                                ctx.fillStyle = viz.colors.teal + 'bb';
                                ctx.fillRect(x + 1, chartBottom - h, barW - 2, h);

                                if (n % Math.max(1, Math.ceil(nMax / 15)) === 0) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '8px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText(n.toString(), x + barW / 2, chartBottom + 3);
                                }
                            }

                            // GF formula
                            var formula = 'GF = ';
                            for (var i = 0; i < coins.length; i++) {
                                if (i > 0) formula += ' * ';
                                formula += '1/(1-x^' + coins[i] + ')';
                            }
                            viz.screenText(formula, viz.width / 2, chartBottom + 24, viz.colors.orange, 11);

                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('cents', chartLeft + (nMax + 1) * barW / 2, chartBottom + 18);

                            if (useLog) viz.screenText('(log scale)', chartLeft - 30, chartBottom - chartH - 5, viz.colors.text, 9);

                            // Show coins in use
                            viz.screenText('Coins: ' + coins.map(function(c) { return c + '\u00A2'; }).join(', '), viz.width / 2, chartBottom + 44, viz.colors.blue, 12);
                            viz.screenText('Ways to make ' + nMax + '\u00A2: ' + ways[nMax], viz.width / 2, chartBottom + 62, viz.colors.white, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify by hand that \\(p(6) = 11\\) by listing all partitions of 6.',
                    hint: 'Start with the largest part and work down systematically.',
                    solution: 'The 11 partitions of 6 are: 6, 5+1, 4+2, 4+1+1, 3+3, 3+2+1, 3+1+1+1, 2+2+2, 2+2+1+1, 2+1+1+1+1, 1+1+1+1+1+1.'
                },
                {
                    question: 'Using the generating function for coin change, how many ways can you make 15 cents using pennies (1c), nickels (5c), and dimes (10c)?',
                    hint: 'The GF is \\(\\frac{1}{(1-x)(1-x^5)(1-x^{10})}\\). You need \\([x^{15}]\\) of this product. Try dynamic programming or enumerate systematically.',
                    solution: 'Enumerate by number of dimes: 1 dime leaves 5c (2 ways: 5c or 5 pennies); 0 dimes, then by nickels: 3 nickels (1 way), 2 nickels + 5 pennies (1 way), 1 nickel + 10 pennies (1 way), 0 nickels + 15 pennies (1 way). Total: 2 + 4 = 6 ways.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to What Comes Next
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Catalan Numbers & Beyond',
            content: `
<h2>The Catalan Numbers and Beyond</h2>

<div class="env-block intuition">
    <div class="env-title">A Generating Function That Solves Itself</div>
    <div class="env-body">
        <p>Not all generating functions are rational. When a sequence satisfies a <em>nonlinear</em> recurrence, the generating function satisfies a polynomial equation in itself. The Catalan numbers are the most famous example.</p>
    </div>
</div>

<h3>The Catalan Numbers</h3>

<div class="env-block definition">
    <div class="env-title">Definition 9.3 (Catalan Numbers)</div>
    <div class="env-body">
        <p>The Catalan numbers \\(C_n\\) are defined by \\(C_0 = 1\\) and</p>
        \\[C_n = \\sum_{k=0}^{n-1} C_k C_{n-1-k} \\quad \\text{for } n \\geq 1.\\]
        <p>The first few values are \\(1, 1, 2, 5, 14, 42, 132, 429, \\ldots\\)</p>
    </div>
</div>

<p>The recurrence says each \\(C_n\\) is a convolution sum. This is the hallmark of the multiplication of generating functions. Let \\(C(x) = \\sum C_n x^n\\). Then the recurrence gives</p>
\\[
C(x) - 1 = x \\cdot C(x)^2,
\\]
<p>since the right side is \\(\\sum_{n \\geq 1} \\left(\\sum_{k=0}^{n-1} C_k C_{n-1-k}\\right) x^n = x \\cdot C(x)^2\\). Rearranging:</p>
\\[
x C(x)^2 - C(x) + 1 = 0.
\\]
<p>By the quadratic formula (treating \\(C(x)\\) as the unknown):</p>
\\[
C(x) = \\frac{1 - \\sqrt{1 - 4x}}{2x}.
\\]
<p>(We choose the minus sign so that \\(C(0) = 1\\).) Expanding \\(\\sqrt{1-4x}\\) via the generalized binomial series yields</p>
\\[
C_n = \\frac{1}{n+1}\\binom{2n}{n}.
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 9.9 (Catalan Closed Form)</div>
    <div class="env-body">
        <p>\\(C_n = \\frac{1}{n+1}\\binom{2n}{n}\\). Asymptotically, \\(C_n \\sim \\frac{4^n}{n^{3/2}\\sqrt{\\pi}}\\).</p>
    </div>
</div>

<p>The Catalan numbers count a remarkable variety of combinatorial objects: balanced parenthesizations, binary trees with \\(n\\) internal nodes, paths on a grid that do not cross the diagonal, triangulations of a convex polygon, and many more.</p>

<div class="viz-placeholder" data-viz="viz-catalan-gf"></div>

<h3>Where Generating Functions Lead</h3>

<p>Generating functions are not just a technique; they are a way of thinking. By encoding combinatorial structure into algebra, they connect discrete mathematics to analysis (singularity analysis), algebra (ring of formal power series), and even physics (partition functions in statistical mechanics).</p>

<p>In the chapters ahead, we will apply generating functions implicitly whenever we count paths in graphs (Chapter 10), enumerate trees (Chapter 11), or analyze algorithms (Chapter 12). The Catalan numbers, in particular, will reappear in the study of binary trees and triangulations.</p>

<div class="env-block remark">
    <div class="env-title">Further Reading</div>
    <div class="env-body">
        <p>For a masterful treatment of generating functions, see Herbert Wilf's <em>generatingfunctionology</em> (freely available online). For the analytic side, see Flajolet and Sedgewick's <em>Analytic Combinatorics</em>.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-catalan-gf',
                    title: 'Catalan Numbers: From Quadratic GF to Closed Form',
                    description: 'The Catalan generating function C(x) satisfies the quadratic equation xC^2 - C + 1 = 0. Watch the Catalan numbers grow and see both the convolution recurrence and the closed form.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nMax = 12;
                        var animPhase = 0;
                        var animating = false;

                        VizEngine.createSlider(controls, 'n max', 3, 18, nMax, 1, function(v) { nMax = Math.round(v); draw(); });

                        VizEngine.createButton(controls, 'Animate Convolution', function() {
                            if (animating) return;
                            animating = true;
                            animPhase = 0;
                            function step() {
                                animPhase++;
                                draw();
                                if (animPhase <= nMax) setTimeout(step, 400);
                                else animating = false;
                            }
                            step();
                        });

                        function catalan(n) {
                            if (n <= 0) return 1;
                            // C_n = C(2n,n)/(n+1)
                            var c = 1;
                            for (var i = 0; i < n; i++) c = c * (2 * n - i) / (i + 1);
                            return Math.round(c / (n + 1));
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Catalan Numbers', viz.width / 2, 18, viz.colors.white, 15);
                            viz.screenText('C(x) = (1 - sqrt(1 - 4x)) / (2x)', viz.width / 2, 38, viz.colors.teal, 12);

                            var cats = [];
                            for (var i = 0; i <= nMax; i++) cats.push(catalan(i));
                            var maxC = Math.max.apply(null, cats);
                            if (maxC < 1) maxC = 1;

                            var chartLeft = 70;
                            var chartBottom = 320;
                            var chartH = 240;
                            var barW = Math.min(35, (viz.width - 100) / (nMax + 1));
                            var useLog = maxC > 100;
                            var scaleMax = useLog ? Math.log10(maxC + 1) : maxC;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartLeft - 5, chartBottom); ctx.lineTo(chartLeft + (nMax + 1) * barW + 5, chartBottom); ctx.stroke();

                            var showUpTo = animating ? Math.min(animPhase, nMax) : nMax;

                            for (var i = 0; i <= showUpTo; i++) {
                                var val = cats[i];
                                var h = ((useLog ? Math.log10(val + 1) : val) / scaleMax) * chartH;
                                var x = chartLeft + i * barW;

                                var isActive = animating && i === animPhase;
                                ctx.fillStyle = isActive ? viz.colors.orange : viz.colors.purple + 'bb';
                                ctx.fillRect(x + 2, chartBottom - h, barW - 4, h);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText(i.toString(), x + barW / 2, chartBottom + 3);

                                if (h > 12) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textBaseline = 'bottom';
                                    ctx.fillText(val.toString(), x + barW / 2, chartBottom - h - 1);
                                }
                            }

                            // Closed form
                            viz.screenText('C_n = C(2n,n) / (n+1)', viz.width / 2, chartBottom + 24, viz.colors.orange, 12);

                            if (useLog) viz.screenText('(log scale)', chartLeft - 30, chartBottom - chartH - 5, viz.colors.text, 9);

                            // Show convolution for current n
                            if (animating && animPhase > 0 && animPhase <= nMax) {
                                var n = animPhase;
                                var convStr = 'C_' + n + ' = ';
                                var terms = [];
                                for (var k = 0; k < n; k++) {
                                    terms.push('C_' + k + '*C_' + (n-1-k));
                                }
                                convStr += terms.join(' + ');
                                viz.screenText(convStr, viz.width / 2, chartBottom + 48, viz.colors.teal, 10);
                            }

                            viz.screenText('Growth: ~4^n / (n^(3/2) * sqrt(pi))', viz.width / 2, chartBottom + 68, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that \\(C_4 = 14\\) using both the convolution recurrence and the closed form \\(\\frac{1}{n+1}\\binom{2n}{n}\\).',
                    hint: 'For the recurrence: \\(C_4 = C_0 C_3 + C_1 C_2 + C_2 C_1 + C_3 C_0\\). For the closed form: \\(\\frac{1}{5}\\binom{8}{4}\\).',
                    solution: 'Recurrence: \\(C_4 = 1 \\cdot 5 + 1 \\cdot 2 + 2 \\cdot 1 + 5 \\cdot 1 = 5 + 2 + 2 + 5 = 14\\). Closed form: \\(\\frac{1}{5}\\binom{8}{4} = \\frac{70}{5} = 14\\). \\(\\checkmark\\)'
                },
                {
                    question: 'The Catalan number \\(C_n\\) counts the number of ways to correctly match \\(n\\) pairs of parentheses. List all 5 valid arrangements for \\(n = 3\\).',
                    hint: 'A valid arrangement has \\(n\\) opening and \\(n\\) closing parentheses such that, reading left to right, the number of closing parentheses never exceeds the number of opening ones.',
                    solution: 'The \\(C_3 = 5\\) arrangements are: ((())), (()()),  (())(), ()(()),  ()()().'
                }
            ]
        }
    ]
});
