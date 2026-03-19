window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch17',
    number: 17,
    title: 'Boolean Algebra & Circuits',
    subtitle: 'From logic to hardware',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Boolean Algebra?',
            content: `
<h2>Why Boolean Algebra?</h2>

<div class="env-block intuition">
    <div class="env-title">The Bridge from Logic to Silicon</div>
    <div class="env-body">
        <p>Every computation your computer performs reduces to operations on bits: 0s and 1s. But how does abstract logic become physical hardware? The answer is Boolean algebra, a mathematical framework invented by George Boole in 1854 that provides the theoretical foundation for digital circuit design. When you write <code>if (x &amp;&amp; !y)</code> in a program, a physical circuit with transistors implements exactly that Boolean expression.</p>
    </div>
</div>

<p>In earlier chapters, we studied propositional logic: statements that are true or false, connected by AND, OR, and NOT. Boolean algebra takes these same ideas and formalizes them into an algebraic system with its own axioms, theorems, and simplification rules. The payoff is enormous:</p>

<ol>
    <li><strong>Simplification.</strong> A Boolean expression with 20 terms might simplify to one with 3, saving transistors, power, and money.</li>
    <li><strong>Circuit synthesis.</strong> Any truth table can be converted mechanically to a circuit made of logic gates.</li>
    <li><strong>Verification.</strong> We can prove two circuits are functionally equivalent by algebraic manipulation.</li>
</ol>

<p>This chapter develops Boolean algebra from axioms, introduces logic gates and their circuit realizations, presents systematic minimization techniques (Karnaugh maps), and builds standard combinational circuits like adders and multiplexers.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>George Boole's <em>An Investigation of the Laws of Thought</em> (1854) laid the algebraic foundation. Nearly a century later, Claude Shannon's 1937 master's thesis showed that Boole's algebra could be implemented with electrical relay circuits, launching the digital age. Shannon's insight was that switches in series implement AND, switches in parallel implement OR, and a normally-closed switch implements NOT.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Boolean Algebra
        // ================================================================
        {
            id: 'sec-boolean',
            title: 'Boolean Algebra',
            content: `
<h2>Boolean Algebra</h2>

<div class="env-block definition">
    <div class="env-title">Definition 17.1 (Boolean Algebra)</div>
    <div class="env-body">
        <p>A <strong>Boolean algebra</strong> is a set \\(B = \\{0, 1\\}\\) together with three operations:</p>
        <ul>
            <li><strong>AND</strong> (conjunction, written \\(x \\cdot y\\) or \\(xy\\))</li>
            <li><strong>OR</strong> (disjunction, written \\(x + y\\))</li>
            <li><strong>NOT</strong> (complement, written \\(\\overline{x}\\) or \\(x'\\))</li>
        </ul>
        <p>satisfying the following axioms for all \\(x, y, z \\in B\\):</p>
    </div>
</div>

<h3>Huntington's Axioms</h3>

<div class="env-block theorem">
    <div class="env-title">Axioms (Huntington, 1904)</div>
    <div class="env-body">
        <ol>
            <li><strong>Closure:</strong> \\(x + y \\in B\\) and \\(x \\cdot y \\in B\\).</li>
            <li><strong>Identity:</strong> \\(x + 0 = x\\) and \\(x \\cdot 1 = x\\).</li>
            <li><strong>Commutativity:</strong> \\(x + y = y + x\\) and \\(x \\cdot y = y \\cdot x\\).</li>
            <li><strong>Distributivity:</strong> \\(x \\cdot (y + z) = xy + xz\\) and \\(x + yz = (x+y)(x+z)\\).</li>
            <li><strong>Complement:</strong> \\(x + \\overline{x} = 1\\) and \\(x \\cdot \\overline{x} = 0\\).</li>
        </ol>
    </div>
</div>

<p>Notice the elegant symmetry: every axiom comes in a dual pair, swapping \\(+\\) with \\(\\cdot\\) and \\(0\\) with \\(1\\). This is the <strong>principle of duality</strong>.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 17.1 (Principle of Duality)</div>
    <div class="env-body">
        <p>If a Boolean identity is valid, then the <strong>dual</strong> identity (obtained by swapping \\(+\\) with \\(\\cdot\\) and \\(0\\) with \\(1\\)) is also valid.</p>
    </div>
</div>

<h3>Derived Laws</h3>

<p>From the axioms, we can derive many useful identities:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 17.2 (Key Boolean Identities)</div>
    <div class="env-body">
        <ol>
            <li><strong>Idempotent:</strong> \\(x + x = x\\), \\(x \\cdot x = x\\).</li>
            <li><strong>Domination:</strong> \\(x + 1 = 1\\), \\(x \\cdot 0 = 0\\).</li>
            <li><strong>Absorption:</strong> \\(x + xy = x\\), \\(x(x + y) = x\\).</li>
            <li><strong>Involution:</strong> \\(\\overline{\\overline{x}} = x\\).</li>
            <li><strong>De Morgan's Laws:</strong> \\(\\overline{x + y} = \\overline{x} \\cdot \\overline{y}\\), \\(\\overline{x \\cdot y} = \\overline{x} + \\overline{y}\\).</li>
            <li><strong>Consensus:</strong> \\(xy + \\overline{x}z + yz = xy + \\overline{x}z\\).</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of Absorption: \\(x + xy = x\\)</div>
    <div class="env-body">
        <p>\\(x + xy = x \\cdot 1 + x \\cdot y = x(1 + y) = x \\cdot 1 = x\\).</p>
        <p>We used the identity law, factoring (distributivity), domination (\\(1 + y = 1\\)), and the identity law again.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Boolean Functions and Truth Tables</h3>

<p>A <strong>Boolean function</strong> \\(f: \\{0,1\\}^n \\to \\{0,1\\}\\) maps \\(n\\) binary inputs to a single binary output. Every Boolean function can be described by a truth table with \\(2^n\\) rows.</p>

<div class="env-block definition">
    <div class="env-title">Definition 17.2 (Canonical Forms)</div>
    <div class="env-body">
        <p>Every Boolean function can be expressed in two canonical forms:</p>
        <ul>
            <li><strong>Sum of Products (SOP):</strong> OR of AND terms (minterms). Each minterm includes every variable (complemented or not).</li>
            <li><strong>Product of Sums (POS):</strong> AND of OR terms (maxterms). Each maxterm includes every variable.</li>
        </ul>
        <p>These are also called <em>disjunctive normal form</em> (DNF) and <em>conjunctive normal form</em> (CNF).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: SOP from Truth Table</div>
    <div class="env-body">
        <p>Consider \\(f(x,y) = x \\oplus y\\) (XOR). The truth table is:</p>
        <table style="margin:0.5em auto;border-collapse:collapse;">
            <tr><th style="padding:2px 10px;">x</th><th style="padding:2px 10px;">y</th><th style="padding:2px 10px;">f</th></tr>
            <tr><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td></tr>
            <tr><td style="text-align:center;">0</td><td style="text-align:center;">1</td><td style="text-align:center;">1</td></tr>
            <tr><td style="text-align:center;">1</td><td style="text-align:center;">0</td><td style="text-align:center;">1</td></tr>
            <tr><td style="text-align:center;">1</td><td style="text-align:center;">1</td><td style="text-align:center;">0</td></tr>
        </table>
        <p>The output is 1 for rows (0,1) and (1,0). Reading off the minterms:</p>
        \\[f = \\overline{x}\\,y + x\\,\\overline{y}.\\]
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-boolean-expression"></div>
`,
            visualizations: [
                {
                    id: 'viz-boolean-expression',
                    title: 'Boolean Expression Explorer',
                    description: 'Enter a Boolean expression in variables A, B, C and see the truth table and circuit representation. Use + for OR, * for AND, ! for NOT, ^ for XOR.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var exprStr = '!A*B + A*!B';
                        var numVars = 2;

                        // Input field
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:4px;';
                        var label = document.createElement('span');
                        label.className = 'viz-slider-label';
                        label.textContent = 'f = ';
                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.value = exprStr;
                        inp.style.cssText = 'flex:1;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-family:monospace;font-size:0.85rem;';
                        var goBtn = document.createElement('button');
                        goBtn.textContent = 'Evaluate';
                        goBtn.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                        inputDiv.appendChild(label);
                        inputDiv.appendChild(inp);
                        inputDiv.appendChild(goBtn);
                        controls.appendChild(inputDiv);

                        VizEngine.createSlider(controls, 'Variables', 2, 4, numVars, 1, function(v) {
                            numVars = Math.round(v);
                            draw();
                        });

                        goBtn.addEventListener('click', function() {
                            exprStr = inp.value;
                            draw();
                        });
                        inp.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') { exprStr = inp.value; draw(); }
                        });

                        function evalBool(expr, vals) {
                            var s = expr;
                            s = s.replace(/A/g, vals.A ? '1' : '0');
                            s = s.replace(/B/g, vals.B ? '1' : '0');
                            s = s.replace(/C/g, vals.C ? '1' : '0');
                            s = s.replace(/D/g, vals.D ? '1' : '0');
                            // Process NOT
                            for (var iter = 0; iter < 10; iter++) {
                                s = s.replace(/!([01])/g, function(_, b) { return b === '1' ? '0' : '1'; });
                            }
                            // Process XOR
                            for (iter = 0; iter < 10; iter++) {
                                s = s.replace(/([01])\s*\^\s*([01])/, function(_, a, b) { return (a !== b) ? '1' : '0'; });
                            }
                            // Process AND
                            for (iter = 0; iter < 10; iter++) {
                                s = s.replace(/([01])\s*\*\s*([01])/, function(_, a, b) { return (a === '1' && b === '1') ? '1' : '0'; });
                            }
                            // Process OR
                            for (iter = 0; iter < 10; iter++) {
                                s = s.replace(/([01])\s*\+\s*([01])/, function(_, a, b) { return (a === '1' || b === '1') ? '1' : '0'; });
                            }
                            // Process parentheses
                            for (iter = 0; iter < 20; iter++) {
                                s = s.replace(/\(([01])\)/, '$1');
                                s = s.replace(/!([01])/g, function(_, b) { return b === '1' ? '0' : '1'; });
                                s = s.replace(/([01])\s*\^\s*([01])/, function(_, a, b) { return (a !== b) ? '1' : '0'; });
                                s = s.replace(/([01])\s*\*\s*([01])/, function(_, a, b) { return (a === '1' && b === '1') ? '1' : '0'; });
                                s = s.replace(/([01])\s*\+\s*([01])/, function(_, a, b) { return (a === '1' || b === '1') ? '1' : '0'; });
                            }
                            return s.trim() === '1' ? 1 : 0;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var varNames = ['A', 'B', 'C', 'D'].slice(0, numVars);
                            var rows = 1 << numVars;

                            viz.screenText('Truth Table for f = ' + exprStr, viz.width / 2, 18, viz.colors.white, 14);

                            // Draw truth table
                            var tableX = 30;
                            var tableY = 45;
                            var colW = 50;
                            var rowH = Math.min(22, (viz.height - 90) / (rows + 1));

                            // Header
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            for (var v = 0; v < numVars; v++) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText(varNames[v], tableX + v * colW + colW / 2, tableY);
                            }
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('f', tableX + numVars * colW + colW / 2, tableY);

                            // Divider
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(tableX, tableY + 10);
                            ctx.lineTo(tableX + (numVars + 1) * colW, tableY + 10);
                            ctx.stroke();

                            // Rows
                            var minterms = [];
                            var errorOccurred = false;
                            ctx.font = '12px -apple-system,sans-serif';
                            for (var r = 0; r < rows; r++) {
                                var ry = tableY + (r + 1) * rowH + 5;
                                var vals = {};
                                for (var vi = 0; vi < numVars; vi++) {
                                    var bit = (r >> (numVars - 1 - vi)) & 1;
                                    vals[varNames[vi]] = bit;
                                    ctx.fillStyle = bit ? viz.colors.white : viz.colors.text;
                                    ctx.fillText(bit.toString(), tableX + vi * colW + colW / 2, ry);
                                }
                                var result;
                                try {
                                    result = evalBool(exprStr, vals);
                                } catch (e) {
                                    result = 0;
                                    errorOccurred = true;
                                }
                                if (result === 1) minterms.push(r);

                                // Highlight row if output is 1
                                if (result === 1) {
                                    ctx.fillStyle = viz.colors.teal + '22';
                                    ctx.fillRect(tableX, ry - rowH / 2, (numVars + 1) * colW, rowH);
                                }
                                ctx.fillStyle = result ? viz.colors.teal : viz.colors.text;
                                ctx.fillText(result.toString(), tableX + numVars * colW + colW / 2, ry);
                            }

                            // Show SOP (minterms)
                            var sopY = viz.height - 40;
                            if (minterms.length === 0) {
                                viz.screenText('f = 0 (constant false)', viz.width / 2, sopY, viz.colors.orange, 12);
                            } else if (minterms.length === rows) {
                                viz.screenText('f = 1 (constant true)', viz.width / 2, sopY, viz.colors.orange, 12);
                            } else {
                                var sopTerms = [];
                                for (var mi = 0; mi < minterms.length; mi++) {
                                    var term = '';
                                    for (var vi2 = 0; vi2 < numVars; vi2++) {
                                        var bit2 = (minterms[mi] >> (numVars - 1 - vi2)) & 1;
                                        term += bit2 ? varNames[vi2] : varNames[vi2] + "'";
                                    }
                                    sopTerms.push(term);
                                }
                                viz.screenText('SOP: f = ' + sopTerms.join(' + '), viz.width / 2, sopY, viz.colors.orange, 12);
                            }
                            viz.screenText('Minterms: \u03A3m(' + minterms.join(',') + ')', viz.width / 2, sopY + 18, viz.colors.text, 11);

                            if (errorOccurred) {
                                viz.screenText('(Parse error in expression)', viz.width / 2, sopY - 18, viz.colors.red, 11);
                            }

                            // Draw simple gate diagram on the right side
                            var gateX = tableX + (numVars + 1) * colW + 50;
                            var gateW = viz.width - gateX - 20;
                            if (gateW > 120 && minterms.length > 0 && minterms.length < rows && minterms.length <= 6) {
                                viz.screenText('Circuit (SOP)', gateX + gateW / 2, 45, viz.colors.purple, 11);
                                var andGateY = 70;
                                var andGateSpacing = Math.min(40, (viz.height - 120) / minterms.length);
                                for (var ai = 0; ai < minterms.length; ai++) {
                                    var ay = andGateY + ai * andGateSpacing;
                                    // AND gate box
                                    ctx.strokeStyle = viz.colors.blue;
                                    ctx.lineWidth = 1.5;
                                    ctx.strokeRect(gateX + 10, ay - 10, 50, 20);
                                    ctx.fillStyle = viz.colors.blue + '22';
                                    ctx.fillRect(gateX + 10, ay - 10, 50, 20);
                                    // Label
                                    var andLabel = '';
                                    for (var vi3 = 0; vi3 < numVars; vi3++) {
                                        var bit3 = (minterms[ai] >> (numVars - 1 - vi3)) & 1;
                                        andLabel += bit3 ? varNames[vi3] : varNames[vi3] + "'";
                                    }
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(andLabel, gateX + 35, ay + 1);

                                    // Line to OR gate
                                    ctx.strokeStyle = viz.colors.teal + '88';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(gateX + 60, ay);
                                    ctx.lineTo(gateX + gateW - 40, andGateY + (minterms.length - 1) * andGateSpacing / 2);
                                    ctx.stroke();
                                }
                                // OR gate
                                var orY = andGateY + (minterms.length - 1) * andGateSpacing / 2;
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(gateX + gateW - 40, orY - 12, 35, 24);
                                ctx.fillStyle = viz.colors.teal + '22';
                                ctx.fillRect(gateX + gateW - 40, orY - 12, 35, 24);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('OR', gateX + gateW - 22, orY + 1);
                                // Output
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.moveTo(gateX + gateW - 5, orY);
                                ctx.lineTo(gateX + gateW + 10, orY);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('f', gateX + gateW + 12, orY + 1);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using Boolean algebra axioms, prove that \\(x(x + y) = x\\) (absorption).',
                    hint: 'Expand using distributivity, then apply the idempotent and identity laws.',
                    solution: '\\(x(x + y) = x \\cdot x + x \\cdot y = x + xy = x(1 + y) = x \\cdot 1 = x\\). We used idempotent (\\(xx = x\\)), then distributivity, domination (\\(1 + y = 1\\)), and identity.'
                },
                {
                    question: 'Find the dual of the expression \\(xy + \\overline{z} = 1\\).',
                    hint: 'Swap every \\(+\\) with \\(\\cdot\\), every \\(\\cdot\\) with \\(+\\), every 0 with 1 and every 1 with 0. Complements stay unchanged.',
                    solution: 'Dual: \\((x + y) \\cdot \\overline{z} = 0\\). We swapped \\(+\\) and \\(\\cdot\\), and swapped \\(1\\) and \\(0\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Logic Gates
        // ================================================================
        {
            id: 'sec-gates',
            title: 'Logic Gates',
            content: `
<h2>Logic Gates</h2>

<p>A <strong>logic gate</strong> is a physical device (built from transistors) that implements a Boolean function. The standard gates are:</p>

<div class="env-block definition">
    <div class="env-title">Definition 17.3 (Standard Logic Gates)</div>
    <div class="env-body">
        <ul>
            <li><strong>AND:</strong> output is 1 only when <em>all</em> inputs are 1.</li>
            <li><strong>OR:</strong> output is 1 when <em>at least one</em> input is 1.</li>
            <li><strong>NOT (inverter):</strong> output is the complement of the input.</li>
            <li><strong>NAND:</strong> NOT-AND. Output is 0 only when all inputs are 1.</li>
            <li><strong>NOR:</strong> NOT-OR. Output is 0 when at least one input is 1.</li>
            <li><strong>XOR:</strong> Exclusive-OR. Output is 1 when inputs differ.</li>
        </ul>
    </div>
</div>

<p>The truth tables for two-input versions:</p>

<table style="margin:0.5em auto;border-collapse:collapse;text-align:center;">
    <tr><th style="padding:2px 8px;">A</th><th style="padding:2px 8px;">B</th><th style="padding:2px 8px;">AND</th><th style="padding:2px 8px;">OR</th><th style="padding:2px 8px;">NAND</th><th style="padding:2px 8px;">NOR</th><th style="padding:2px 8px;">XOR</th></tr>
    <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
    <tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
    <tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
    <tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
</table>

<div class="env-block theorem">
    <div class="env-title">Theorem 17.3 (NAND and NOR are Universal)</div>
    <div class="env-body">
        <p>Any Boolean function can be implemented using <strong>only NAND gates</strong> (or only NOR gates). This is because:</p>
        <ul>
            <li>NOT: \\(\\overline{x} = x \\uparrow x\\) (NAND of \\(x\\) with itself).</li>
            <li>AND: \\(xy = (x \\uparrow y) \\uparrow (x \\uparrow y)\\).</li>
            <li>OR: \\(x + y = (x \\uparrow x) \\uparrow (y \\uparrow y)\\).</li>
        </ul>
        <p>where \\(\\uparrow\\) denotes NAND. Since AND, OR, NOT are complete, NAND alone is complete.</p>
    </div>
</div>

<p>This universality is why NAND gates are the fundamental building block of modern digital circuits. Manufacturing a single gate type is far cheaper than manufacturing multiple types.</p>

<div class="viz-placeholder" data-viz="viz-gate-simulator"></div>
<div class="viz-placeholder" data-viz="viz-nand-universal"></div>
`,
            visualizations: [
                {
                    id: 'viz-gate-simulator',
                    title: 'Interactive Logic Gate Simulator',
                    description: 'Select a gate type and toggle the inputs to see the output. The gate symbol, truth table, and Boolean expression are shown together.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var gateType = 'AND';
                        var inputA = 0;
                        var inputB = 0;
                        var gateTypes = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'];

                        // Gate selector buttons
                        var btnDiv = document.createElement('div');
                        btnDiv.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px;';
                        var gateBtns = [];
                        gateTypes.forEach(function(gt) {
                            var b = document.createElement('button');
                            b.textContent = gt;
                            b.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                            b.addEventListener('click', function() {
                                gateType = gt;
                                updateBtnStyles();
                                draw();
                            });
                            btnDiv.appendChild(b);
                            gateBtns.push({btn: b, type: gt});
                        });
                        controls.appendChild(btnDiv);

                        function updateBtnStyles() {
                            gateBtns.forEach(function(gb) {
                                gb.btn.style.background = (gb.type === gateType) ? '#58a6ff33' : '#1a1a40';
                                gb.btn.style.borderColor = (gb.type === gateType) ? '#58a6ff' : '#30363d';
                            });
                        }
                        updateBtnStyles();

                        // Input toggles
                        var toggleDiv = document.createElement('div');
                        toggleDiv.style.cssText = 'display:flex;gap:16px;align-items:center;';
                        function makeToggle(lbl, val, onChange) {
                            var g = document.createElement('div');
                            g.style.cssText = 'display:flex;align-items:center;gap:6px;';
                            var s = document.createElement('span');
                            s.className = 'viz-slider-label';
                            s.textContent = lbl;
                            var b = document.createElement('button');
                            b.textContent = val.toString();
                            b.style.cssText = 'width:36px;padding:4px;border:1px solid #30363d;border-radius:4px;background:' + (val ? '#3fb95033' : '#1a1a40') + ';color:' + (val ? '#3fb950' : '#c9d1d9') + ';font-size:0.85rem;cursor:pointer;font-weight:bold;';
                            b.addEventListener('click', function() {
                                var nv = val ? 0 : 1;
                                val = nv;
                                b.textContent = nv.toString();
                                b.style.background = nv ? '#3fb95033' : '#1a1a40';
                                b.style.color = nv ? '#3fb950' : '#c9d1d9';
                                onChange(nv);
                            });
                            g.appendChild(s);
                            g.appendChild(b);
                            toggleDiv.appendChild(g);
                            return { getVal: function() { return val; } };
                        }
                        var togA = makeToggle('Input A:', inputA, function(v) { inputA = v; draw(); });
                        var togB = makeToggle('Input B:', inputB, function(v) { inputB = v; draw(); });
                        controls.appendChild(toggleDiv);

                        function gateEval(type, a, b) {
                            switch(type) {
                                case 'AND':  return a & b;
                                case 'OR':   return a | b;
                                case 'NOT':  return a ? 0 : 1;
                                case 'NAND': return (a & b) ? 0 : 1;
                                case 'NOR':  return (a | b) ? 0 : 1;
                                case 'XOR':  return a ^ b;
                                default: return 0;
                            }
                        }

                        function gateExpr(type) {
                            switch(type) {
                                case 'AND':  return 'f = A \u00B7 B';
                                case 'OR':   return 'f = A + B';
                                case 'NOT':  return 'f = A\'';
                                case 'NAND': return 'f = (A \u00B7 B)\'';
                                case 'NOR':  return 'f = (A + B)\'';
                                case 'XOR':  return 'f = A \u2295 B';
                                default: return '';
                            }
                        }

                        function drawGateShape(ctx, cx, cy, type, size) {
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.fillStyle = viz.colors.bg;
                            var s = size;

                            if (type === 'AND' || type === 'NAND') {
                                ctx.beginPath();
                                ctx.moveTo(cx - s, cy - s);
                                ctx.lineTo(cx, cy - s);
                                ctx.arc(cx, cy, s, -Math.PI / 2, Math.PI / 2);
                                ctx.lineTo(cx - s, cy + s);
                                ctx.closePath();
                                ctx.fill(); ctx.stroke();
                                if (type === 'NAND') {
                                    ctx.beginPath();
                                    ctx.arc(cx + s + 6, cy, 5, 0, Math.PI * 2);
                                    ctx.fill(); ctx.stroke();
                                }
                            } else if (type === 'OR' || type === 'NOR' || type === 'XOR') {
                                ctx.beginPath();
                                ctx.moveTo(cx - s, cy - s);
                                ctx.quadraticCurveTo(cx - s / 2, cy, cx - s, cy + s);
                                ctx.quadraticCurveTo(cx + s / 2, cy + s * 0.8, cx + s, cy);
                                ctx.quadraticCurveTo(cx + s / 2, cy - s * 0.8, cx - s, cy - s);
                                ctx.closePath();
                                ctx.fill(); ctx.stroke();
                                if (type === 'XOR') {
                                    ctx.beginPath();
                                    ctx.moveTo(cx - s - 8, cy - s);
                                    ctx.quadraticCurveTo(cx - s / 2 - 8, cy, cx - s - 8, cy + s);
                                    ctx.stroke();
                                }
                                if (type === 'NOR') {
                                    ctx.beginPath();
                                    ctx.arc(cx + s + 6, cy, 5, 0, Math.PI * 2);
                                    ctx.fill(); ctx.stroke();
                                }
                            } else if (type === 'NOT') {
                                ctx.beginPath();
                                ctx.moveTo(cx - s, cy - s);
                                ctx.lineTo(cx + s, cy);
                                ctx.lineTo(cx - s, cy + s);
                                ctx.closePath();
                                ctx.fill(); ctx.stroke();
                                ctx.beginPath();
                                ctx.arc(cx + s + 5, cy, 4, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var out = gateEval(gateType, inputA, inputB);
                            var isUnary = (gateType === 'NOT');

                            // Title
                            viz.screenText(gateType + ' Gate', viz.width / 2, 22, viz.colors.white, 16);
                            viz.screenText(gateExpr(gateType), viz.width / 2, 44, viz.colors.teal, 13);

                            // Gate symbol
                            var gcx = 200, gcy = 180, gs = 35;
                            drawGateShape(ctx, gcx, gcy, gateType, gs);

                            // Input wires
                            var wireColor = viz.colors.text;
                            if (!isUnary) {
                                // A wire
                                ctx.strokeStyle = inputA ? viz.colors.green : wireColor;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(gcx - 100, gcy - 18); ctx.lineTo(gcx - gs, gcy - 18); ctx.stroke();
                                viz.screenText('A = ' + inputA, gcx - 120, gcy - 18, inputA ? viz.colors.green : viz.colors.text, 13, 'center');
                                // B wire
                                ctx.strokeStyle = inputB ? viz.colors.green : wireColor;
                                ctx.beginPath(); ctx.moveTo(gcx - 100, gcy + 18); ctx.lineTo(gcx - gs, gcy + 18); ctx.stroke();
                                viz.screenText('B = ' + inputB, gcx - 120, gcy + 18, inputB ? viz.colors.green : viz.colors.text, 13, 'center');
                            } else {
                                ctx.strokeStyle = inputA ? viz.colors.green : wireColor;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(gcx - 100, gcy); ctx.lineTo(gcx - gs, gcy); ctx.stroke();
                                viz.screenText('A = ' + inputA, gcx - 120, gcy, inputA ? viz.colors.green : viz.colors.text, 13, 'center');
                            }

                            // Output wire
                            var outX = gcx + gs + (gateType === 'NAND' || gateType === 'NOR' ? 11 : (gateType === 'NOT' ? 9 : 0));
                            ctx.strokeStyle = out ? viz.colors.green : wireColor;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(outX, gcy); ctx.lineTo(outX + 60, gcy); ctx.stroke();

                            // Output indicator
                            ctx.fillStyle = out ? viz.colors.green : '#333';
                            ctx.beginPath(); ctx.arc(outX + 70, gcy, 14, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = out ? viz.colors.green : viz.colors.text;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(outX + 70, gcy, 14, 0, Math.PI * 2); ctx.stroke();
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(out.toString(), outX + 70, gcy);

                            viz.screenText('Output = ' + out, outX + 70, gcy + 30, out ? viz.colors.green : viz.colors.text, 12);

                            // Mini truth table on the right
                            var ttX = 380, ttY = 80;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

                            if (!isUnary) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText('A', ttX, ttY); ctx.fillText('B', ttX + 30, ttY);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText('Out', ttX + 65, ttY);

                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(ttX - 15, ttY + 8); ctx.lineTo(ttX + 85, ttY + 8); ctx.stroke();

                                for (var r = 0; r < 4; r++) {
                                    var ra = (r >> 1) & 1, rb = r & 1;
                                    var rout = gateEval(gateType, ra, rb);
                                    var ry = ttY + 22 + r * 20;
                                    var isActive = (ra === inputA && rb === inputB);

                                    if (isActive) {
                                        ctx.fillStyle = viz.colors.teal + '33';
                                        ctx.fillRect(ttX - 15, ry - 9, 100, 18);
                                    }

                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.fillStyle = isActive ? viz.colors.white : viz.colors.text;
                                    ctx.fillText(ra.toString(), ttX, ry);
                                    ctx.fillText(rb.toString(), ttX + 30, ry);
                                    ctx.fillStyle = isActive ? viz.colors.teal : (rout ? viz.colors.green : viz.colors.text);
                                    ctx.fillText(rout.toString(), ttX + 65, ry);
                                }
                            } else {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText('A', ttX, ttY);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText('Out', ttX + 45, ttY);

                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(ttX - 15, ttY + 8); ctx.lineTo(ttX + 70, ttY + 8); ctx.stroke();

                                for (var r2 = 0; r2 < 2; r2++) {
                                    var rout2 = gateEval('NOT', r2, 0);
                                    var ry2 = ttY + 22 + r2 * 20;
                                    var isActive2 = (r2 === inputA);

                                    if (isActive2) {
                                        ctx.fillStyle = viz.colors.teal + '33';
                                        ctx.fillRect(ttX - 15, ry2 - 9, 80, 18);
                                    }
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.fillStyle = isActive2 ? viz.colors.white : viz.colors.text;
                                    ctx.fillText(r2.toString(), ttX, ry2);
                                    ctx.fillStyle = isActive2 ? viz.colors.teal : (rout2 ? viz.colors.green : viz.colors.text);
                                    ctx.fillText(rout2.toString(), ttX + 45, ry2);
                                }
                            }

                            // Gate label at bottom
                            var desc = '';
                            switch(gateType) {
                                case 'AND': desc = 'Output 1 only when ALL inputs are 1'; break;
                                case 'OR': desc = 'Output 1 when ANY input is 1'; break;
                                case 'NOT': desc = 'Output is the complement of the input'; break;
                                case 'NAND': desc = 'NOT-AND: output 0 only when all inputs are 1'; break;
                                case 'NOR': desc = 'NOT-OR: output 0 when any input is 1'; break;
                                case 'XOR': desc = 'Output 1 when inputs DIFFER'; break;
                            }
                            viz.screenText(desc, viz.width / 2, viz.height - 20, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-nand-universal',
                    title: 'NAND is Universal',
                    description: 'See how AND, OR, and NOT gates can each be built using only NAND gates. Toggle the inputs to verify the construction works.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var inputA = 0;
                        var inputB = 0;
                        var showGate = 'NOT';
                        var gateChoices = ['NOT', 'AND', 'OR'];

                        var btnDiv = document.createElement('div');
                        btnDiv.style.cssText = 'display:flex;gap:6px;margin-bottom:4px;';
                        var gateBtns = [];
                        gateChoices.forEach(function(gt) {
                            var b = document.createElement('button');
                            b.textContent = gt + ' from NAND';
                            b.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                            b.addEventListener('click', function() {
                                showGate = gt;
                                updateStyles();
                                draw();
                            });
                            btnDiv.appendChild(b);
                            gateBtns.push({btn: b, type: gt});
                        });
                        controls.appendChild(btnDiv);

                        function updateStyles() {
                            gateBtns.forEach(function(gb) {
                                gb.btn.style.background = (gb.type === showGate) ? '#58a6ff33' : '#1a1a40';
                                gb.btn.style.borderColor = (gb.type === showGate) ? '#58a6ff' : '#30363d';
                            });
                        }
                        updateStyles();

                        var toggleDiv = document.createElement('div');
                        toggleDiv.style.cssText = 'display:flex;gap:16px;align-items:center;';
                        function makeToggle(lbl, initVal, onChange) {
                            var g = document.createElement('div');
                            g.style.cssText = 'display:flex;align-items:center;gap:6px;';
                            var s = document.createElement('span');
                            s.className = 'viz-slider-label';
                            s.textContent = lbl;
                            var val = initVal;
                            var b = document.createElement('button');
                            b.textContent = val.toString();
                            b.style.cssText = 'width:36px;padding:4px;border:1px solid #30363d;border-radius:4px;background:' + (val ? '#3fb95033' : '#1a1a40') + ';color:' + (val ? '#3fb950' : '#c9d1d9') + ';font-size:0.85rem;cursor:pointer;font-weight:bold;';
                            b.addEventListener('click', function() {
                                val = val ? 0 : 1;
                                b.textContent = val.toString();
                                b.style.background = val ? '#3fb95033' : '#1a1a40';
                                b.style.color = val ? '#3fb950' : '#c9d1d9';
                                onChange(val);
                            });
                            g.appendChild(s); g.appendChild(b);
                            toggleDiv.appendChild(g);
                        }
                        makeToggle('A:', inputA, function(v) { inputA = v; draw(); });
                        makeToggle('B:', inputB, function(v) { inputB = v; draw(); });
                        controls.appendChild(toggleDiv);

                        function nand(a, b) { return (a & b) ? 0 : 1; }

                        function drawNandBox(ctx, cx, cy, s) {
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.fillStyle = viz.colors.orange + '15';
                            ctx.beginPath();
                            ctx.moveTo(cx - s, cy - s);
                            ctx.lineTo(cx, cy - s);
                            ctx.arc(cx, cy, s, -Math.PI / 2, Math.PI / 2);
                            ctx.lineTo(cx - s, cy + s);
                            ctx.closePath();
                            ctx.fill(); ctx.stroke();
                            ctx.beginPath();
                            ctx.arc(cx + s + 5, cy, 4, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.bg; ctx.fill(); ctx.stroke();

                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('NAND', cx, cy);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Building ' + showGate + ' from NAND gates', viz.width / 2, 22, viz.colors.white, 15);

                            var finalOut;
                            var gs = 22;

                            if (showGate === 'NOT') {
                                // NOT A = NAND(A, A)
                                viz.screenText("A' = A NAND A", viz.width / 2, 50, viz.colors.teal, 12);
                                var cx = 280, cy = 180;
                                // Input wire (A goes to both inputs)
                                ctx.strokeStyle = inputA ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(120, cy); ctx.lineTo(cx - gs, cy - 10); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(120, cy); ctx.lineTo(cx - gs, cy + 10); ctx.stroke();
                                viz.screenText('A = ' + inputA, 90, cy, inputA ? viz.colors.green : viz.colors.text, 13);

                                drawNandBox(ctx, cx, cy, gs);
                                finalOut = nand(inputA, inputA);

                                ctx.strokeStyle = finalOut ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(cx + gs + 9, cy); ctx.lineTo(cx + gs + 60, cy); ctx.stroke();

                                ctx.fillStyle = finalOut ? viz.colors.green : '#333';
                                ctx.beginPath(); ctx.arc(cx + gs + 74, cy, 14, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = finalOut ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(cx + gs + 74, cy, 14, 0, Math.PI * 2); ctx.stroke();
                                ctx.fillStyle = viz.colors.white; ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(finalOut.toString(), cx + gs + 74, cy);

                                viz.screenText('1 NAND gate', viz.width / 2, viz.height - 30, viz.colors.text, 11);

                            } else if (showGate === 'AND') {
                                // AND = NAND(NAND(A,B), NAND(A,B))
                                viz.screenText('A \u00B7 B = [A NAND B] NAND [A NAND B]', viz.width / 2, 50, viz.colors.teal, 12);

                                var n1x = 200, n1y = 180;
                                var n2x = 380, n2y = 180;

                                // Input wires to first NAND
                                ctx.strokeStyle = inputA ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(80, n1y - 30); ctx.lineTo(n1x - gs, n1y - 10); ctx.stroke();
                                viz.screenText('A = ' + inputA, 55, n1y - 30, inputA ? viz.colors.green : viz.colors.text, 13);

                                ctx.strokeStyle = inputB ? viz.colors.green : viz.colors.text;
                                ctx.beginPath(); ctx.moveTo(80, n1y + 30); ctx.lineTo(n1x - gs, n1y + 10); ctx.stroke();
                                viz.screenText('B = ' + inputB, 55, n1y + 30, inputB ? viz.colors.green : viz.colors.text, 13);

                                drawNandBox(ctx, n1x, n1y, gs);
                                var mid = nand(inputA, inputB);

                                // Wire from NAND1 to NAND2 (both inputs)
                                ctx.strokeStyle = mid ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(n1x + gs + 9, n1y); ctx.lineTo(n2x - gs, n2y - 10); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(n1x + gs + 9, n1y); ctx.lineTo(n2x - gs, n2y + 10); ctx.stroke();

                                viz.screenText(mid.toString(), (n1x + gs + 9 + n2x - gs) / 2, n1y - 14, mid ? viz.colors.green : viz.colors.text, 10);

                                drawNandBox(ctx, n2x, n2y, gs);
                                finalOut = nand(mid, mid);

                                ctx.strokeStyle = finalOut ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(n2x + gs + 9, n2y); ctx.lineTo(n2x + gs + 50, n2y); ctx.stroke();

                                ctx.fillStyle = finalOut ? viz.colors.green : '#333';
                                ctx.beginPath(); ctx.arc(n2x + gs + 64, n2y, 14, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = finalOut ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(n2x + gs + 64, n2y, 14, 0, Math.PI * 2); ctx.stroke();
                                ctx.fillStyle = viz.colors.white; ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(finalOut.toString(), n2x + gs + 64, n2y);

                                viz.screenText('2 NAND gates', viz.width / 2, viz.height - 30, viz.colors.text, 11);

                            } else if (showGate === 'OR') {
                                // OR = NAND(NAND(A,A), NAND(B,B))
                                viz.screenText("A + B = [A NAND A] NAND [B NAND B]", viz.width / 2, 50, viz.colors.teal, 12);

                                var n1ax = 200, n1ay = 140;
                                var n1bx = 200, n1by = 230;
                                var n2ox = 380, n2oy = 185;

                                // A input to NAND1a (both inputs)
                                ctx.strokeStyle = inputA ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(80, n1ay); ctx.lineTo(n1ax - gs, n1ay - 10); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(80, n1ay); ctx.lineTo(n1ax - gs, n1ay + 10); ctx.stroke();
                                viz.screenText('A = ' + inputA, 55, n1ay, inputA ? viz.colors.green : viz.colors.text, 13);

                                drawNandBox(ctx, n1ax, n1ay, gs);
                                var notA = nand(inputA, inputA);

                                // B input to NAND1b (both inputs)
                                ctx.strokeStyle = inputB ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(80, n1by); ctx.lineTo(n1bx - gs, n1by - 10); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(80, n1by); ctx.lineTo(n1bx - gs, n1by + 10); ctx.stroke();
                                viz.screenText('B = ' + inputB, 55, n1by, inputB ? viz.colors.green : viz.colors.text, 13);

                                drawNandBox(ctx, n1bx, n1by, gs);
                                var notB = nand(inputB, inputB);

                                // Wires to final NAND
                                ctx.strokeStyle = notA ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(n1ax + gs + 9, n1ay); ctx.lineTo(n2ox - gs, n2oy - 10); ctx.stroke();
                                viz.screenText(notA.toString(), (n1ax + gs + n2ox - gs) / 2, n1ay - 10, notA ? viz.colors.green : viz.colors.text, 10);

                                ctx.strokeStyle = notB ? viz.colors.green : viz.colors.text;
                                ctx.beginPath(); ctx.moveTo(n1bx + gs + 9, n1by); ctx.lineTo(n2ox - gs, n2oy + 10); ctx.stroke();
                                viz.screenText(notB.toString(), (n1bx + gs + n2ox - gs) / 2, n1by + 10, notB ? viz.colors.green : viz.colors.text, 10);

                                drawNandBox(ctx, n2ox, n2oy, gs);
                                finalOut = nand(notA, notB);

                                ctx.strokeStyle = finalOut ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(n2ox + gs + 9, n2oy); ctx.lineTo(n2ox + gs + 50, n2oy); ctx.stroke();

                                ctx.fillStyle = finalOut ? viz.colors.green : '#333';
                                ctx.beginPath(); ctx.arc(n2ox + gs + 64, n2oy, 14, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = finalOut ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(n2ox + gs + 64, n2oy, 14, 0, Math.PI * 2); ctx.stroke();
                                ctx.fillStyle = viz.colors.white; ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(finalOut.toString(), n2ox + gs + 64, n2oy);

                                viz.screenText('3 NAND gates', viz.width / 2, viz.height - 30, viz.colors.text, 11);
                            }

                            // Verification text
                            var expected;
                            if (showGate === 'NOT') expected = inputA ? 0 : 1;
                            else if (showGate === 'AND') expected = inputA & inputB;
                            else expected = inputA | inputB;
                            var ok = finalOut === expected;
                            viz.screenText(
                                showGate + '(' + inputA + (showGate !== 'NOT' ? ', ' + inputB : '') + ') = ' + expected + (ok ? ' \u2713' : ' \u2717'),
                                viz.width / 2, viz.height - 55, ok ? viz.colors.green : viz.colors.red, 13
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many NAND gates are needed to build a 2-input XOR gate? Draw the circuit.',
                    hint: 'XOR can be written as \\(A \\oplus B = A\\overline{B} + \\overline{A}B\\). Express each part using NAND operations.',
                    solution: '4 NAND gates suffice. Let \\(N_1 = A \\uparrow B\\), \\(N_2 = A \\uparrow N_1\\), \\(N_3 = B \\uparrow N_1\\), \\(N_4 = N_2 \\uparrow N_3\\). Then \\(N_4 = A \\oplus B\\). Verify: when \\(A=1, B=0\\): \\(N_1 = 1\\), \\(N_2 = 0\\), \\(N_3 = 1\\), \\(N_4 = 1\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Show that NOR is also a universal gate by expressing NOT, AND, and OR using only NOR (\\(\\downarrow\\)) gates.',
                    hint: 'By duality with NAND: NOT \\(x = x \\downarrow x\\), OR \\(= (x \\downarrow y) \\downarrow (x \\downarrow y)\\), AND \\(= (x \\downarrow x) \\downarrow (y \\downarrow y)\\).',
                    solution: 'NOT: \\(\\overline{x} = x \\downarrow x\\). OR: \\(x + y = (x \\downarrow y) \\downarrow (x \\downarrow y)\\) since NOR then NOT gives OR. AND: \\(xy = (x \\downarrow x) \\downarrow (y \\downarrow y) = \\overline{x} \\downarrow \\overline{y}\\). Since \\(\\{\\text{NOT, AND, OR}\\}\\) is complete, NOR is universal.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Minimization
        // ================================================================
        {
            id: 'sec-minimization',
            title: 'Minimization',
            content: `
<h2>Minimization</h2>

<p>The canonical SOP form often has redundant terms. <strong>Minimization</strong> finds an equivalent expression with the fewest literals and terms, which translates directly to cheaper circuits.</p>

<h3>Algebraic Minimization</h3>

<div class="env-block example">
    <div class="env-title">Example: Algebraic Simplification</div>
    <div class="env-body">
        <p>Simplify \\(f = A\\overline{B}C + A\\overline{B}\\overline{C} + AB\\overline{C}\\).</p>
        <p>Factor: \\(f = A\\overline{B}(C + \\overline{C}) + AB\\overline{C} = A\\overline{B} + AB\\overline{C}\\).</p>
        <p>Factor again: \\(f = A(\\overline{B} + B\\overline{C}) = A(\\overline{B} + \\overline{C})\\).</p>
        <p>(Using \\(\\overline{B} + B\\overline{C} = \\overline{B} + \\overline{C}\\), a consequence of absorption in reverse.)</p>
    </div>
</div>

<p>Algebraic methods work but require insight. For systematic minimization, we use <strong>Karnaugh maps</strong>.</p>

<h3>Karnaugh Maps</h3>

<div class="env-block definition">
    <div class="env-title">Definition 17.4 (Karnaugh Map)</div>
    <div class="env-body">
        <p>A <strong>Karnaugh map</strong> (K-map) is a graphical method for simplifying Boolean functions of 2, 3, or 4 variables. The cells of the map are arranged so that adjacent cells differ in exactly one variable (Gray code ordering). This means adjacent 1-cells can be combined to eliminate one variable.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 17.4 (K-map Grouping Rules)</div>
    <div class="env-body">
        <ol>
            <li>Groups must be rectangular and contain \\(2^k\\) cells (1, 2, 4, 8, ...).</li>
            <li>Every cell in the group must contain a 1 (or a don't-care).</li>
            <li>Larger groups yield simpler terms (a group of \\(2^k\\) cells eliminates \\(k\\) variables).</li>
            <li>Every 1-cell must be covered by at least one group.</li>
            <li>The map wraps around: left-right edges are adjacent, and top-bottom edges are adjacent.</li>
        </ol>
    </div>
</div>

<h3>Don't-Care Conditions</h3>

<p>In practice, some input combinations may never occur (e.g., BCD codes greater than 9). These are <strong>don't-care</strong> conditions, denoted X or d. We are free to assign them 0 or 1, whichever leads to a simpler expression.</p>

<div class="env-block example">
    <div class="env-title">Example: 3-Variable K-map</div>
    <div class="env-body">
        <p>Minimize \\(f(A,B,C) = \\sum m(1, 2, 3, 5, 7)\\).</p>
        <p>The K-map groupings yield: a group of 4 covering minterms \\{1, 3, 5, 7\\} gives \\(C\\), and a group of 2 covering \\{2, 3\\} gives \\(\\overline{A}B\\). Result: \\(f = C + \\overline{A}B\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-karnaugh-map"></div>
`,
            visualizations: [
                {
                    id: 'viz-karnaugh-map',
                    title: 'Interactive Karnaugh Map',
                    description: 'Click cells to toggle between 0, 1, and X (don\'t-care). The map automatically identifies prime implicants and extracts a minimal SOP expression. Supports 2, 3, and 4 variables.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        var numVars = 3;
                        // Cell values: 0, 1, or 2 (don't-care)
                        var cells = new Array(16).fill(0);
                        // Preset: f(A,B,C) = sum m(1,2,3,5,7)
                        cells[1] = 1; cells[2] = 1; cells[3] = 1; cells[5] = 1; cells[7] = 1;

                        VizEngine.createSlider(controls, 'Variables', 2, 4, numVars, 1, function(v) {
                            numVars = Math.round(v);
                            cells = new Array(16).fill(0);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            cells = new Array(16).fill(0);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Random', function() {
                            var n = 1 << numVars;
                            for (var i = 0; i < 16; i++) {
                                cells[i] = i < n ? (Math.random() < 0.4 ? 1 : 0) : 0;
                            }
                            draw();
                        });

                        // Gray code orders
                        var gray2 = [0, 1];
                        var gray4 = [0, 1, 3, 2];

                        function grayLabel2(i) { return ['0', '1'][i]; }
                        function grayLabel4(i) { return ['00', '01', '11', '10'][i]; }

                        function mintermIndex(numV, row, col) {
                            if (numV === 2) {
                                return gray2[row] * 2 + gray2[col];
                            } else if (numV === 3) {
                                return gray2[row] * 4 + gray4[col];
                            } else {
                                return gray4[row] * 4 + gray4[col];
                            }
                        }

                        function getRows() { return numVars <= 3 ? 2 : 4; }
                        function getCols() { return numVars <= 2 ? 2 : 4; }

                        // Simple minimization: find groups
                        function findGroups() {
                            var nRows = getRows(), nCols = getCols();
                            var n = 1 << numVars;
                            var ones = [];
                            for (var i = 0; i < n; i++) {
                                if (cells[i] === 1 || cells[i] === 2) ones.push(i);
                            }
                            var essential = [];
                            for (var i2 = 0; i2 < n; i2++) {
                                if (cells[i2] === 1) essential.push(i2);
                            }
                            if (essential.length === 0) return [];

                            // Try groups of size 1, 2, 4, 8, 16
                            var groups = [];
                            var covered = new Set();

                            // Check if a set of minterms forms a valid K-map group
                            function isValidGroup(minterms) {
                                if (minterms.length === 0) return false;
                                var k = Math.log2(minterms.length);
                                if (k !== Math.floor(k)) return false;
                                // All must be 1 or don't-care
                                for (var i = 0; i < minterms.length; i++) {
                                    if (cells[minterms[i]] === 0) return false;
                                }
                                // Check rectangular in Gray code space
                                var rows = new Set(), cols = new Set();
                                for (var i = 0; i < minterms.length; i++) {
                                    for (var r = 0; r < nRows; r++) {
                                        for (var c = 0; c < nCols; c++) {
                                            if (mintermIndex(numVars, r, c) === minterms[i]) {
                                                rows.add(r); cols.add(c);
                                            }
                                        }
                                    }
                                }
                                return rows.size * cols.size === minterms.length;
                            }

                            // Find all prime implicant groups (rectangular blocks)
                            function findRectGroups() {
                                var allGroups = [];
                                var rowSizes = numVars <= 3 ? [1, 2] : [1, 2, 4];
                                var colSizes = numVars <= 2 ? [1, 2] : [1, 2, 4];

                                for (var rs = 0; rs < rowSizes.length; rs++) {
                                    for (var cs = 0; cs < colSizes.length; cs++) {
                                        var rSize = rowSizes[rs], cSize = colSizes[cs];
                                        if (rSize * cSize < 1) continue;
                                        for (var startR = 0; startR < nRows; startR++) {
                                            for (var startC = 0; startC < nCols; startC++) {
                                                var mints = [];
                                                var valid = true;
                                                for (var dr = 0; dr < rSize && valid; dr++) {
                                                    for (var dc = 0; dc < cSize && valid; dc++) {
                                                        var r = (startR + dr) % nRows;
                                                        var c = (startC + dc) % nCols;
                                                        var m = mintermIndex(numVars, r, c);
                                                        if (cells[m] === 0) { valid = false; break; }
                                                        mints.push(m);
                                                    }
                                                }
                                                if (valid && mints.length > 0) {
                                                    mints.sort(function(a,b){ return a-b; });
                                                    var key = mints.join(',');
                                                    var exists = false;
                                                    for (var gi = 0; gi < allGroups.length; gi++) {
                                                        if (allGroups[gi].key === key) { exists = true; break; }
                                                    }
                                                    if (!exists) {
                                                        allGroups.push({mints: mints, key: key, size: mints.length});
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                // Sort by size descending
                                allGroups.sort(function(a, b) { return b.size - a.size; });
                                return allGroups;
                            }

                            var allGroups = findRectGroups();

                            // Greedy covering
                            var uncovered = new Set(essential);
                            while (uncovered.size > 0) {
                                var best = null;
                                var bestCount = 0;
                                for (var gi = 0; gi < allGroups.length; gi++) {
                                    var g = allGroups[gi];
                                    var cnt = 0;
                                    for (var mi = 0; mi < g.mints.length; mi++) {
                                        if (uncovered.has(g.mints[mi])) cnt++;
                                    }
                                    if (cnt > bestCount || (cnt === bestCount && best && g.size > best.size)) {
                                        best = g; bestCount = cnt;
                                    }
                                }
                                if (!best || bestCount === 0) break;
                                groups.push(best);
                                for (var mi2 = 0; mi2 < best.mints.length; mi2++) {
                                    uncovered.delete(best.mints[mi2]);
                                }
                            }
                            return groups;
                        }

                        function groupToTerm(group) {
                            var varNames = ['A', 'B', 'C', 'D'].slice(0, numVars);
                            var mints = group.mints;
                            var term = '';
                            for (var v = 0; v < numVars; v++) {
                                var bit = (mints[0] >> (numVars - 1 - v)) & 1;
                                var same = true;
                                for (var i = 1; i < mints.length; i++) {
                                    if (((mints[i] >> (numVars - 1 - v)) & 1) !== bit) {
                                        same = false; break;
                                    }
                                }
                                if (same) {
                                    term += bit ? varNames[v] : varNames[v] + "'";
                                }
                            }
                            return term || '1';
                        }

                        // Click handler
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            var nRows = getRows(), nCols = getCols();
                            var cellSize = Math.min(70, (viz.width - 160) / (nCols + 1), (viz.height - 160) / (nRows + 1));
                            var mapX = (viz.width - (nCols + 1) * cellSize) / 2 + cellSize;
                            var mapY = 80 + cellSize;

                            for (var r = 0; r < nRows; r++) {
                                for (var c = 0; c < nCols; c++) {
                                    var cx = mapX + c * cellSize;
                                    var cy = mapY + r * cellSize;
                                    if (mx >= cx && mx < cx + cellSize && my >= cy && my < cy + cellSize) {
                                        var m = mintermIndex(numVars, r, c);
                                        cells[m] = (cells[m] + 1) % 3;
                                        draw();
                                        return;
                                    }
                                }
                            }
                        });

                        var groupColors = ['#58a6ff66', '#3fb9a066', '#f0883e66', '#bc8cff66', '#f7814966', '#3fb95066'];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var nRows = getRows(), nCols = getCols();
                            var varNames = ['A', 'B', 'C', 'D'].slice(0, numVars);

                            viz.screenText(numVars + '-Variable Karnaugh Map', viz.width / 2, 20, viz.colors.white, 15);

                            var cellSize = Math.min(70, (viz.width - 160) / (nCols + 1), (viz.height - 160) / (nRows + 1));
                            var mapX = (viz.width - (nCols + 1) * cellSize) / 2 + cellSize;
                            var mapY = 80 + cellSize;

                            // Column headers (Gray code)
                            var colLabels = numVars <= 2 ? ['0', '1'] : ['00', '01', '11', '10'];
                            var rowLabels = numVars <= 3 ? ['0', '1'] : ['00', '01', '11', '10'];
                            var colVar = numVars <= 2 ? varNames[1] : (numVars === 3 ? varNames[1] + varNames[2] : varNames[2] + varNames[3]);
                            var rowVar = numVars <= 3 ? varNames[0] : varNames[0] + varNames[1];

                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

                            // Variable labels
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText(colVar, mapX + nCols * cellSize / 2, mapY - cellSize - 15);
                            ctx.save(); ctx.translate(mapX - cellSize - 10, mapY + nRows * cellSize / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText(rowVar, 0, 0);
                            ctx.restore();

                            // Column labels
                            for (var c = 0; c < nCols; c++) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(colLabels[c], mapX + c * cellSize + cellSize / 2, mapY - cellSize / 2);
                            }
                            // Row labels
                            for (var r = 0; r < nRows; r++) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(rowLabels[r], mapX - cellSize / 2, mapY + r * cellSize + cellSize / 2);
                            }

                            // Find groups first for highlighting
                            var groups = findGroups();

                            // Draw cells
                            for (var r2 = 0; r2 < nRows; r2++) {
                                for (var c2 = 0; c2 < nCols; c2++) {
                                    var cx = mapX + c2 * cellSize;
                                    var cy = mapY + r2 * cellSize;
                                    var m = mintermIndex(numVars, r2, c2);

                                    // Cell background
                                    ctx.fillStyle = cells[m] === 1 ? '#3fb95022' : (cells[m] === 2 ? '#d2992222' : viz.colors.bg);
                                    ctx.fillRect(cx, cy, cellSize, cellSize);
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx, cy, cellSize, cellSize);

                                    // Cell value
                                    ctx.font = 'bold 16px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    if (cells[m] === 1) {
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.fillText('1', cx + cellSize / 2, cy + cellSize / 2);
                                    } else if (cells[m] === 2) {
                                        ctx.fillStyle = viz.colors.yellow;
                                        ctx.fillText('X', cx + cellSize / 2, cy + cellSize / 2);
                                    } else {
                                        ctx.fillStyle = viz.colors.text + '44';
                                        ctx.fillText('0', cx + cellSize / 2, cy + cellSize / 2);
                                    }

                                    // Minterm number (small, corner)
                                    ctx.font = '8px -apple-system,sans-serif';
                                    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                    ctx.fillStyle = viz.colors.text + '66';
                                    ctx.fillText('m' + m, cx + 2, cy + 2);
                                }
                            }

                            // Draw group rectangles
                            for (var gi = 0; gi < groups.length; gi++) {
                                var g = groups[gi];
                                var gColor = groupColors[gi % groupColors.length];
                                // Find bounding rect in grid coords
                                var minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
                                for (var mi = 0; mi < g.mints.length; mi++) {
                                    for (var r3 = 0; r3 < nRows; r3++) {
                                        for (var c3 = 0; c3 < nCols; c3++) {
                                            if (mintermIndex(numVars, r3, c3) === g.mints[mi]) {
                                                minR = Math.min(minR, r3); maxR = Math.max(maxR, r3);
                                                minC = Math.min(minC, c3); maxC = Math.max(maxC, c3);
                                            }
                                        }
                                    }
                                }
                                var pad = 3;
                                ctx.strokeStyle = gColor.substring(0, 7);
                                ctx.lineWidth = 3;
                                var rx = mapX + minC * cellSize + pad;
                                var ry = mapY + minR * cellSize + pad;
                                var rw = (maxC - minC + 1) * cellSize - 2 * pad;
                                var rh = (maxR - minR + 1) * cellSize - 2 * pad;

                                ctx.beginPath();
                                var bRad = 8;
                                ctx.moveTo(rx + bRad, ry);
                                ctx.lineTo(rx + rw - bRad, ry);
                                ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + bRad);
                                ctx.lineTo(rx + rw, ry + rh - bRad);
                                ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - bRad, ry + rh);
                                ctx.lineTo(rx + bRad, ry + rh);
                                ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - bRad);
                                ctx.lineTo(rx, ry + bRad);
                                ctx.quadraticCurveTo(rx, ry, rx + bRad, ry);
                                ctx.closePath();
                                ctx.stroke();
                            }

                            // Show minimal expression
                            var exprY = viz.height - 40;
                            if (groups.length === 0) {
                                var hasOnes = false;
                                for (var ci = 0; ci < (1 << numVars); ci++) {
                                    if (cells[ci] === 1) { hasOnes = true; break; }
                                }
                                if (!hasOnes) {
                                    viz.screenText('f = 0', viz.width / 2, exprY, viz.colors.orange, 14);
                                }
                            } else {
                                var terms = [];
                                for (var gi2 = 0; gi2 < groups.length; gi2++) {
                                    terms.push(groupToTerm(groups[gi2]));
                                }
                                viz.screenText('f = ' + terms.join(' + '), viz.width / 2, exprY, viz.colors.teal, 14);
                            }

                            viz.screenText('Click cells to toggle: 0 \u2192 1 \u2192 X \u2192 0', viz.width / 2, exprY + 20, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use a 4-variable K-map to minimize \\(f(A,B,C,D) = \\sum m(0, 1, 2, 5, 8, 9, 10)\\).',
                    hint: 'Look for groups that wrap around the edges. Minterms 0, 1, 8, 9 form a group on the left column, and 0, 2, 8, 10 form a group on the top and bottom rows.',
                    solution: 'Group \\{0,1,8,9\\} gives \\(\\overline{B}\\overline{C}\\). Group \\{0,2,8,10\\} gives \\(\\overline{B}\\overline{D}\\). Group \\{1,5\\} gives \\(\\overline{B}D\\) (wait, that does not cover 5). Re-check: \\{1,5\\} differ in A (not adjacent in standard 4-var map). Actually group \\{5\\} = \\(\\overline{A}B\\overline{C}D\\). Minimal: \\(f = \\overline{B}\\overline{C} + \\overline{B}\\overline{D} + \\overline{A}B\\overline{C}D\\).'
                },
                {
                    question: 'Minimize \\(f(A,B,C) = \\sum m(0, 2, 4, 5, 6)\\) with don\'t-care \\(d(1, 3, 7)\\). How does using don\'t-cares simplify the result?',
                    hint: 'With the don\'t-cares, you can form a group of 8 (the entire map) or large groups that cover all essential minterms.',
                    solution: 'Without don\'t-cares: \\(f = \\overline{C} + A\\overline{B}\\). With don\'t-cares: minterms \\{0,1,2,3,4,5,6,7\\} can all be 1, giving \\(f = 1\\). But if we want \\(f \\neq 1\\), note \\{0,1,2,3\\} (\\(\\overline{A}\\)) and \\{4,5,6,7\\} cover everything if d(7)=1. Since all outputs can be 1, the minimal form is \\(f = \\overline{C} + A\\). (With d(1)=1 and d(3)=1, group \\{0,1,4,5\\}=\\overline{B}\\overline{C}... actually: group \\{0,1,2,3\\}=\\overline{A}\\), group \\{4,5,6,7\\} if d(7)=1 gives A. So \\(f = \\overline{A} + A = 1\\). The don\'t-cares allow \\(f = 1\\).)'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Combinational Circuits
        // ================================================================
        {
            id: 'sec-circuits',
            title: 'Combinational Circuits',
            content: `
<h2>Combinational Circuits</h2>

<p>A <strong>combinational circuit</strong> is a circuit whose output depends only on the current inputs (no memory or feedback). We now build several important combinational circuits from gates.</p>

<h3>Half Adder</h3>

<div class="env-block definition">
    <div class="env-title">Definition 17.5 (Half Adder)</div>
    <div class="env-body">
        <p>A <strong>half adder</strong> adds two single bits \\(A\\) and \\(B\\), producing:</p>
        <ul>
            <li><strong>Sum:</strong> \\(S = A \\oplus B\\)</li>
            <li><strong>Carry:</strong> \\(C = A \\cdot B\\)</li>
        </ul>
        <table style="margin:0.5em auto;border-collapse:collapse;text-align:center;">
            <tr><th style="padding:2px 10px;">A</th><th style="padding:2px 10px;">B</th><th style="padding:2px 10px;">S</th><th style="padding:2px 10px;">C</th></tr>
            <tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
            <tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
            <tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
            <tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
        </table>
        <p>The "half" indicates it handles no carry input. It can only add the least significant bit position.</p>
    </div>
</div>

<h3>Full Adder</h3>

<div class="env-block definition">
    <div class="env-title">Definition 17.6 (Full Adder)</div>
    <div class="env-body">
        <p>A <strong>full adder</strong> adds two bits \\(A\\) and \\(B\\) plus a carry-in \\(C_{in}\\):</p>
        <ul>
            <li><strong>Sum:</strong> \\(S = A \\oplus B \\oplus C_{in}\\)</li>
            <li><strong>Carry-out:</strong> \\(C_{out} = AB + C_{in}(A \\oplus B)\\)</li>
        </ul>
        <p>A full adder can be built from two half adders and an OR gate. Chaining \\(n\\) full adders produces an \\(n\\)-bit ripple-carry adder.</p>
    </div>
</div>

<h3>Multiplexer</h3>

<div class="env-block definition">
    <div class="env-title">Definition 17.7 (Multiplexer)</div>
    <div class="env-body">
        <p>A <strong>multiplexer</strong> (MUX) selects one of \\(2^n\\) data inputs based on \\(n\\) selection lines.</p>
        <ul>
            <li><strong>2-to-1 MUX:</strong> \\(f = \\overline{S} \\cdot D_0 + S \\cdot D_1\\). When \\(S=0\\), output is \\(D_0\\); when \\(S=1\\), output is \\(D_1\\).</li>
            <li><strong>4-to-1 MUX:</strong> \\(f = \\overline{S_1}\\,\\overline{S_0} \\cdot D_0 + \\overline{S_1}\\,S_0 \\cdot D_1 + S_1\\,\\overline{S_0} \\cdot D_2 + S_1\\,S_0 \\cdot D_3\\).</li>
        </ul>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 17.5 (Multiplexer Universality)</div>
    <div class="env-body">
        <p>Any Boolean function of \\(n\\) variables can be implemented with a single \\(2^n\\)-to-1 multiplexer. Use the variables as select lines and tie each data input to 0 or 1 according to the truth table.</p>
    </div>
</div>

<h3>Decoder</h3>

<p>A <strong>decoder</strong> with \\(n\\) inputs and \\(2^n\\) outputs activates exactly one output for each input combination. It generates all minterms, making it another universal building block: any Boolean function can be implemented with a decoder plus a single OR gate.</p>

<div class="viz-placeholder" data-viz="viz-half-adder"></div>
<div class="viz-placeholder" data-viz="viz-full-adder"></div>
<div class="viz-placeholder" data-viz="viz-multiplexer"></div>
`,
            visualizations: [
                {
                    id: 'viz-half-adder',
                    title: 'Half Adder Circuit',
                    description: 'Toggle inputs A and B to see the Sum and Carry outputs. The circuit is built from an XOR gate and an AND gate.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 320,
                            originX: 0, originY: 0, scale: 1
                        });

                        var inputA = 0, inputB = 0;

                        var toggleDiv = document.createElement('div');
                        toggleDiv.style.cssText = 'display:flex;gap:16px;align-items:center;';
                        function makeToggle(lbl, initVal, onChange) {
                            var g = document.createElement('div');
                            g.style.cssText = 'display:flex;align-items:center;gap:6px;';
                            var s = document.createElement('span');
                            s.className = 'viz-slider-label'; s.textContent = lbl;
                            var val = initVal;
                            var b = document.createElement('button');
                            b.textContent = val.toString();
                            b.style.cssText = 'width:36px;padding:4px;border:1px solid #30363d;border-radius:4px;background:' + (val ? '#3fb95033' : '#1a1a40') + ';color:' + (val ? '#3fb950' : '#c9d1d9') + ';font-size:0.85rem;cursor:pointer;font-weight:bold;';
                            b.addEventListener('click', function() {
                                val = val ? 0 : 1;
                                b.textContent = val.toString();
                                b.style.background = val ? '#3fb95033' : '#1a1a40';
                                b.style.color = val ? '#3fb950' : '#c9d1d9';
                                onChange(val);
                            });
                            g.appendChild(s); g.appendChild(b);
                            toggleDiv.appendChild(g);
                        }
                        makeToggle('A:', 0, function(v) { inputA = v; draw(); });
                        makeToggle('B:', 0, function(v) { inputB = v; draw(); });
                        controls.appendChild(toggleDiv);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var sum = inputA ^ inputB;
                            var carry = inputA & inputB;

                            viz.screenText('Half Adder', viz.width / 2, 20, viz.colors.white, 16);
                            viz.screenText('S = A \u2295 B,  C = A \u00B7 B', viz.width / 2, 42, viz.colors.teal, 12);

                            // Draw the block diagram
                            var bx = 180, by = 100, bw = 160, bh = 140;
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(bx, by, bw, bh);
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(bx + 1, by + 1, bw - 2, bh - 2);

                            // Label
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('HALF', bx + bw / 2, by + bh / 2 - 10);
                            ctx.fillText('ADDER', bx + bw / 2, by + bh / 2 + 10);

                            // Internal: XOR and AND
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('XOR \u2192 S', bx + bw / 2, by + bh / 2 + 35);
                            ctx.fillText('AND \u2192 C', bx + bw / 2, by + bh / 2 + 50);

                            // Input wires
                            var aY = by + bh * 0.33;
                            var bY = by + bh * 0.67;
                            ctx.strokeStyle = inputA ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(60, aY); ctx.lineTo(bx, aY); ctx.stroke();
                            viz.screenText('A = ' + inputA, 40, aY, inputA ? viz.colors.green : viz.colors.text, 13);

                            ctx.strokeStyle = inputB ? viz.colors.green : viz.colors.text;
                            ctx.beginPath(); ctx.moveTo(60, bY); ctx.lineTo(bx, bY); ctx.stroke();
                            viz.screenText('B = ' + inputB, 40, bY, inputB ? viz.colors.green : viz.colors.text, 13);

                            // Output wires
                            var sY = by + bh * 0.33;
                            var cY = by + bh * 0.67;
                            ctx.strokeStyle = sum ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(bx + bw, sY); ctx.lineTo(bx + bw + 80, sY); ctx.stroke();

                            // Sum indicator
                            ctx.fillStyle = sum ? viz.colors.green : '#333';
                            ctx.beginPath(); ctx.arc(bx + bw + 100, sY, 14, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = sum ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(bx + bw + 100, sY, 14, 0, Math.PI * 2); ctx.stroke();
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(sum.toString(), bx + bw + 100, sY);
                            viz.screenText('Sum', bx + bw + 100, sY - 22, viz.colors.blue, 11);

                            ctx.strokeStyle = carry ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(bx + bw, cY); ctx.lineTo(bx + bw + 80, cY); ctx.stroke();

                            ctx.fillStyle = carry ? viz.colors.green : '#333';
                            ctx.beginPath(); ctx.arc(bx + bw + 100, cY, 14, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = carry ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(bx + bw + 100, cY, 14, 0, Math.PI * 2); ctx.stroke();
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(carry.toString(), bx + bw + 100, cY);
                            viz.screenText('Carry', bx + bw + 100, cY - 22, viz.colors.orange, 11);

                            // Summary
                            viz.screenText(inputA + ' + ' + inputB + ' = ' + (carry ? '1' : '') + sum + '\u2082', viz.width / 2, viz.height - 20, viz.colors.white, 14);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-full-adder',
                    title: 'Full Adder Circuit',
                    description: 'A full adder handles a carry-in bit. Toggle A, B, and Cin to see the Sum and Cout. Notice how it is built from two half adders plus an OR gate.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var inputA = 0, inputB = 0, inputCin = 0;

                        var toggleDiv = document.createElement('div');
                        toggleDiv.style.cssText = 'display:flex;gap:16px;align-items:center;';
                        function makeToggle(lbl, initVal, onChange) {
                            var g = document.createElement('div');
                            g.style.cssText = 'display:flex;align-items:center;gap:6px;';
                            var s = document.createElement('span');
                            s.className = 'viz-slider-label'; s.textContent = lbl;
                            var val = initVal;
                            var b = document.createElement('button');
                            b.textContent = val.toString();
                            b.style.cssText = 'width:36px;padding:4px;border:1px solid #30363d;border-radius:4px;background:' + (val ? '#3fb95033' : '#1a1a40') + ';color:' + (val ? '#3fb950' : '#c9d1d9') + ';font-size:0.85rem;cursor:pointer;font-weight:bold;';
                            b.addEventListener('click', function() {
                                val = val ? 0 : 1;
                                b.textContent = val.toString();
                                b.style.background = val ? '#3fb95033' : '#1a1a40';
                                b.style.color = val ? '#3fb950' : '#c9d1d9';
                                onChange(val);
                            });
                            g.appendChild(s); g.appendChild(b);
                            toggleDiv.appendChild(g);
                        }
                        makeToggle('A:', 0, function(v) { inputA = v; draw(); });
                        makeToggle('B:', 0, function(v) { inputB = v; draw(); });
                        makeToggle('Cin:', 0, function(v) { inputCin = v; draw(); });
                        controls.appendChild(toggleDiv);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Full adder logic
                            var xor1 = inputA ^ inputB;
                            var and1 = inputA & inputB;
                            var sum = xor1 ^ inputCin;
                            var and2 = xor1 & inputCin;
                            var cout = and1 | and2;

                            viz.screenText('Full Adder (Two Half Adders + OR)', viz.width / 2, 20, viz.colors.white, 15);
                            viz.screenText('S = A \u2295 B \u2295 Cin,  Cout = AB + Cin(A \u2295 B)', viz.width / 2, 42, viz.colors.teal, 11);

                            // Half Adder 1
                            var ha1x = 130, ha1y = 100, haw = 100, hah = 80;
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1.5;
                            ctx.strokeRect(ha1x, ha1y, haw, hah);
                            ctx.fillStyle = viz.colors.blue + '11';
                            ctx.fillRect(ha1x, ha1y, haw, hah);
                            ctx.fillStyle = viz.colors.blue; ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('HA 1', ha1x + haw / 2, ha1y + hah / 2);

                            // Half Adder 2
                            var ha2x = 300, ha2y = 100;
                            ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 1.5;
                            ctx.strokeRect(ha2x, ha2y, haw, hah);
                            ctx.fillStyle = viz.colors.purple + '11';
                            ctx.fillRect(ha2x, ha2y, haw, hah);
                            ctx.fillStyle = viz.colors.purple; ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.fillText('HA 2', ha2x + haw / 2, ha2y + hah / 2);

                            // OR gate box
                            var orx = 300, ory = 230, orw = 100, orh = 40;
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5;
                            ctx.strokeRect(orx, ory, orw, orh);
                            ctx.fillStyle = viz.colors.orange + '11';
                            ctx.fillRect(orx, ory, orw, orh);
                            ctx.fillStyle = viz.colors.orange; ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.fillText('OR', orx + orw / 2, ory + orh / 2);

                            // Input wires
                            ctx.strokeStyle = inputA ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(40, ha1y + hah * 0.33); ctx.lineTo(ha1x, ha1y + hah * 0.33); ctx.stroke();
                            viz.screenText('A=' + inputA, 25, ha1y + hah * 0.33, inputA ? viz.colors.green : viz.colors.text, 11);

                            ctx.strokeStyle = inputB ? viz.colors.green : viz.colors.text;
                            ctx.beginPath(); ctx.moveTo(40, ha1y + hah * 0.67); ctx.lineTo(ha1x, ha1y + hah * 0.67); ctx.stroke();
                            viz.screenText('B=' + inputB, 25, ha1y + hah * 0.67, inputB ? viz.colors.green : viz.colors.text, 11);

                            // HA1 outputs: XOR1 -> HA2 input, AND1 -> OR input
                            // XOR1 wire (top) to HA2 top input
                            ctx.strokeStyle = xor1 ? viz.colors.green : viz.colors.text; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(ha1x + haw, ha1y + hah * 0.33); ctx.lineTo(ha2x, ha2y + hah * 0.33); ctx.stroke();
                            viz.screenText(xor1.toString(), (ha1x + haw + ha2x) / 2, ha1y + hah * 0.33 - 10, xor1 ? viz.colors.green : viz.colors.text, 9);

                            // Cin wire to HA2 bottom input
                            ctx.strokeStyle = inputCin ? viz.colors.green : viz.colors.text;
                            ctx.beginPath();
                            ctx.moveTo(40, ha2y + hah * 0.67);
                            ctx.lineTo(ha2x, ha2y + hah * 0.67);
                            ctx.stroke();
                            viz.screenText('Cin=' + inputCin, 20, ha2y + hah * 0.67, inputCin ? viz.colors.green : viz.colors.text, 11);

                            // AND1 wire (bottom of HA1) to OR bottom input
                            ctx.strokeStyle = and1 ? viz.colors.green : viz.colors.text;
                            ctx.beginPath();
                            ctx.moveTo(ha1x + haw, ha1y + hah * 0.67);
                            ctx.lineTo(ha1x + haw + 20, ha1y + hah * 0.67);
                            ctx.lineTo(ha1x + haw + 20, ory + orh * 0.67);
                            ctx.lineTo(orx, ory + orh * 0.67);
                            ctx.stroke();

                            // AND2 wire (bottom of HA2) to OR top input
                            ctx.strokeStyle = and2 ? viz.colors.green : viz.colors.text;
                            ctx.beginPath();
                            ctx.moveTo(ha2x + haw / 2, ha2y + hah);
                            ctx.lineTo(ha2x + haw / 2, ory);
                            ctx.stroke();

                            // Sum output
                            ctx.strokeStyle = sum ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(ha2x + haw, ha2y + hah * 0.33); ctx.lineTo(ha2x + haw + 60, ha2y + hah * 0.33); ctx.stroke();

                            ctx.fillStyle = sum ? viz.colors.green : '#333';
                            ctx.beginPath(); ctx.arc(ha2x + haw + 76, ha2y + hah * 0.33, 14, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = sum ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(ha2x + haw + 76, ha2y + hah * 0.33, 14, 0, Math.PI * 2); ctx.stroke();
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(sum.toString(), ha2x + haw + 76, ha2y + hah * 0.33);
                            viz.screenText('S', ha2x + haw + 76, ha2y + hah * 0.33 - 20, viz.colors.blue, 11);

                            // Cout output
                            ctx.strokeStyle = cout ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(orx + orw, ory + orh / 2); ctx.lineTo(orx + orw + 60, ory + orh / 2); ctx.stroke();

                            ctx.fillStyle = cout ? viz.colors.green : '#333';
                            ctx.beginPath(); ctx.arc(orx + orw + 76, ory + orh / 2, 14, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = cout ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(orx + orw + 76, ory + orh / 2, 14, 0, Math.PI * 2); ctx.stroke();
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(cout.toString(), orx + orw + 76, ory + orh / 2);
                            viz.screenText('Cout', orx + orw + 76, ory + orh / 2 - 20, viz.colors.orange, 11);

                            // Binary summary
                            var total = inputA + inputB + inputCin;
                            viz.screenText(inputA + ' + ' + inputB + ' + ' + inputCin + ' = ' + total + ' (binary: ' + cout + sum + ')', viz.width / 2, viz.height - 20, viz.colors.white, 13);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-multiplexer',
                    title: 'Multiplexer (MUX)',
                    description: 'A 2-to-1 and 4-to-1 multiplexer. Toggle the data inputs and selection lines to see which input is routed to the output.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var muxType = '2to1';
                        var selBits = [0, 0];
                        var dataInputs = [0, 1, 0, 1];

                        var btnDiv = document.createElement('div');
                        btnDiv.style.cssText = 'display:flex;gap:6px;margin-bottom:4px;';
                        var muxBtns = [];
                        ['2to1', '4to1'].forEach(function(mt) {
                            var b = document.createElement('button');
                            b.textContent = mt === '2to1' ? '2-to-1 MUX' : '4-to-1 MUX';
                            b.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                            b.addEventListener('click', function() { muxType = mt; updateBtns(); draw(); });
                            btnDiv.appendChild(b);
                            muxBtns.push({btn: b, type: mt});
                        });
                        controls.appendChild(btnDiv);

                        function updateBtns() {
                            muxBtns.forEach(function(mb) {
                                mb.btn.style.background = (mb.type === muxType) ? '#58a6ff33' : '#1a1a40';
                                mb.btn.style.borderColor = (mb.type === muxType) ? '#58a6ff' : '#30363d';
                            });
                        }
                        updateBtns();

                        var toggleDiv = document.createElement('div');
                        toggleDiv.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;';

                        function makeToggle(lbl, initVal, onChange) {
                            var g = document.createElement('div');
                            g.style.cssText = 'display:flex;align-items:center;gap:4px;';
                            var s = document.createElement('span');
                            s.className = 'viz-slider-label'; s.textContent = lbl;
                            s.style.fontSize = '0.75rem';
                            var val = initVal;
                            var b = document.createElement('button');
                            b.textContent = val.toString();
                            b.style.cssText = 'width:32px;padding:3px;border:1px solid #30363d;border-radius:4px;background:' + (val ? '#3fb95033' : '#1a1a40') + ';color:' + (val ? '#3fb950' : '#c9d1d9') + ';font-size:0.8rem;cursor:pointer;font-weight:bold;';
                            b.addEventListener('click', function() {
                                val = val ? 0 : 1;
                                b.textContent = val.toString();
                                b.style.background = val ? '#3fb95033' : '#1a1a40';
                                b.style.color = val ? '#3fb950' : '#c9d1d9';
                                onChange(val);
                            });
                            g.appendChild(s); g.appendChild(b);
                            toggleDiv.appendChild(g);
                        }
                        makeToggle('D0:', dataInputs[0], function(v) { dataInputs[0] = v; draw(); });
                        makeToggle('D1:', dataInputs[1], function(v) { dataInputs[1] = v; draw(); });
                        makeToggle('D2:', dataInputs[2], function(v) { dataInputs[2] = v; draw(); });
                        makeToggle('D3:', dataInputs[3], function(v) { dataInputs[3] = v; draw(); });
                        makeToggle('S0:', selBits[0], function(v) { selBits[0] = v; draw(); });
                        makeToggle('S1:', selBits[1], function(v) { selBits[1] = v; draw(); });
                        controls.appendChild(toggleDiv);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var is4 = muxType === '4to1';
                            var nData = is4 ? 4 : 2;
                            var selIdx = is4 ? selBits[1] * 2 + selBits[0] : selBits[0];
                            var output = dataInputs[selIdx];

                            viz.screenText((is4 ? '4-to-1' : '2-to-1') + ' Multiplexer', viz.width / 2, 22, viz.colors.white, 16);

                            // MUX trapezoid
                            var mx = 220, my = 70, mw = 120, mh = is4 ? 220 : 160;
                            ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(mx, my);
                            ctx.lineTo(mx + mw, my + 20);
                            ctx.lineTo(mx + mw, my + mh - 20);
                            ctx.lineTo(mx, my + mh);
                            ctx.closePath();
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fill(); ctx.stroke();

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('MUX', mx + mw / 2, my + mh / 2);

                            // Data inputs
                            var inputSpacing = mh / (nData + 1);
                            for (var i = 0; i < nData; i++) {
                                var iy = my + inputSpacing * (i + 1);
                                var isSelected = (i === selIdx);
                                var wireCol = isSelected ? (dataInputs[i] ? viz.colors.green : viz.colors.red) : viz.colors.text + '44';

                                ctx.strokeStyle = wireCol; ctx.lineWidth = isSelected ? 2.5 : 1;
                                ctx.beginPath(); ctx.moveTo(80, iy); ctx.lineTo(mx, iy); ctx.stroke();

                                // Input label
                                ctx.fillStyle = isSelected ? viz.colors.white : viz.colors.text;
                                ctx.font = (isSelected ? 'bold ' : '') + '12px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText('D' + i + ' = ' + dataInputs[i], 74, iy);

                                // Mark inside MUX
                                ctx.fillStyle = isSelected ? viz.colors.teal : viz.colors.text + '44';
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('D' + i, mx + 6, iy);
                            }

                            // Selection lines (bottom)
                            var selY = my + mh + 30;
                            ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(mx + mw / 2, my + mh); ctx.lineTo(mx + mw / 2, selY); ctx.stroke();

                            ctx.fillStyle = viz.colors.purple;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            if (is4) {
                                ctx.fillText('S1=' + selBits[1] + ', S0=' + selBits[0] + ' (select=' + selIdx + ')', mx + mw / 2, selY + 4);
                            } else {
                                ctx.fillText('S=' + selBits[0] + ' (select=' + selIdx + ')', mx + mw / 2, selY + 4);
                            }

                            // Output wire
                            var outY = my + mh / 2;
                            ctx.strokeStyle = output ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(mx + mw, outY); ctx.lineTo(mx + mw + 80, outY); ctx.stroke();

                            // Output indicator
                            ctx.fillStyle = output ? viz.colors.green : '#333';
                            ctx.beginPath(); ctx.arc(mx + mw + 98, outY, 16, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = output ? viz.colors.green : viz.colors.text; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(mx + mw + 98, outY, 16, 0, Math.PI * 2); ctx.stroke();
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(output.toString(), mx + mw + 98, outY);
                            viz.screenText('f', mx + mw + 98, outY - 24, viz.colors.teal, 12);

                            // Formula
                            var formulaY = viz.height - 20;
                            viz.screenText('Output = D' + selIdx + ' = ' + output, viz.width / 2, formulaY, viz.colors.white, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Design a 4-bit ripple-carry adder using full adders. If A = 1011 and B = 0110, trace through the carry chain and compute the sum.',
                    hint: 'Start from the LSB. The carry-out of each bit position becomes the carry-in of the next.',
                    solution: 'Bit 0: \\(1+0+0 = 1\\), carry 0. Bit 1: \\(1+1+0 = 0\\), carry 1. Bit 2: \\(0+1+1 = 0\\), carry 1. Bit 3: \\(1+0+1 = 0\\), carry 1. Result: \\(10001_2 = 17_{10}\\). Check: \\(11 + 6 = 17\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Implement \\(f(A, B, C) = \\sum m(1, 3, 5, 6)\\) using a single 8-to-1 multiplexer. What are the data inputs?',
                    hint: 'Use A, B, C as the select lines S2, S1, S0. Set data input \\(D_i = 1\\) if minterm \\(i\\) is in the function, and \\(D_i = 0\\) otherwise.',
                    solution: 'Connect A, B, C to S2, S1, S0. Set \\(D_0 = 0, D_1 = 1, D_2 = 0, D_3 = 1, D_4 = 0, D_5 = 1, D_6 = 1, D_7 = 0\\). When the select lines equal minterm \\(i\\), the output is \\(D_i\\), which matches the truth table.'
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

<p>This chapter has taken us from abstract Boolean identities to physical circuit realizations. The key ideas to carry forward:</p>

<ol>
    <li><strong>Boolean algebra provides the mathematical foundation for digital design.</strong> Every circuit simplification, every verification of equivalence, every synthesis from specification uses the axioms and theorems of Boolean algebra.</li>
    <li><strong>Universality.</strong> A single gate type (NAND or NOR) can build any circuit. This remarkable fact underlies VLSI manufacturing: billions of identical transistor structures on a chip implement arbitrary computations.</li>
    <li><strong>Systematic minimization.</strong> K-maps (and their algorithmic generalization, the Quine-McCluskey method) ensure that circuits use the minimum number of gates, reducing cost, power, and delay.</li>
    <li><strong>Modular design.</strong> Complex circuits (adders, multiplexers, decoders) are built by composing simpler components. This compositional approach scales from individual gates to entire processors.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">What Comes Next</div>
    <div class="env-body">
        <p>Combinational circuits have no memory: their output depends only on current inputs. Adding memory elements (flip-flops, latches) gives us <strong>sequential circuits</strong>, which can store state and change behavior over time. Registers, counters, and finite state machines are all sequential circuits. The interplay between combinational and sequential logic forms the foundation of computer architecture.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Connections</div>
    <div class="env-body">
        <p><strong>To propositional logic (Ch. 1):</strong> Boolean algebra and propositional logic are the same structure viewed from different angles. Every tautology is a Boolean identity; every Boolean simplification is a logical equivalence.</p>
        <p><strong>To graph theory:</strong> Circuit diagrams are directed acyclic graphs (DAGs). Circuit minimization is closely related to DAG compression and common subexpression elimination.</p>
        <p><strong>To complexity theory:</strong> The Boolean circuit model is fundamental in computational complexity. The class P/poly consists of problems solvable by polynomial-size Boolean circuits.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        }
    ]
});
