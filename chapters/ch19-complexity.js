window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch19',
    number: 19,
    title: 'Computational Complexity',
    subtitle: 'What computers can and cannot do efficiently',
    sections: [
        // ================================================================
        // SECTION 1: The P vs NP Question
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'The P vs NP Question',
            content: `
<h2>The P vs NP Question</h2>

<div class="env-block intuition">
    <div class="env-title">A Tale of Two Tasks</div>
    <div class="env-body">
        <p>Suppose someone hands you a Sudoku puzzle and asks you to solve it. You might struggle for a long time. But if someone hands you a <em>completed</em> Sudoku and asks "is this solution correct?", you can check it in seconds: just verify each row, column, and 3&times;3 box contains 1 through 9.</p>
        <p>This asymmetry, where <strong>finding</strong> a solution is hard but <strong>checking</strong> a solution is easy, lies at the heart of the most important open problem in all of computer science and mathematics: <strong>P vs NP</strong>.</p>
    </div>
</div>

<p>Throughout this course, we have built up the tools of discrete mathematics: logic, sets, relations, functions, counting, graphs, number theory, and automata. Computational complexity theory asks a foundational question that connects all of these:</p>

\\[\\textbf{Which problems can be solved efficiently, and which cannot?}\\]

<p>By "efficiently," we mean in a number of steps that grows polynomially with the input size, not exponentially. This distinction matters enormously in practice: a polynomial-time algorithm on an input of size 1000 might take a billion steps (\\(1000^3\\)), which a modern computer handles in about a second. An exponential-time algorithm might take \\(2^{1000}\\) steps, a number so large it exceeds the number of atoms in the observable universe.</p>

<h3>Why This Matters</h3>

<p>Computational complexity is not just abstract theory. It underlies:</p>
<ul>
    <li><strong>Cryptography</strong>: The security of RSA (Chapter 16) depends on the assumption that factoring large numbers is <em>not</em> in P.</li>
    <li><strong>Optimization</strong>: Scheduling, routing, and resource allocation problems in industry are often NP-hard.</li>
    <li><strong>Verification</strong>: Software verification, circuit design, and automated theorem proving all encounter NP-complete problems.</li>
    <li><strong>Science</strong>: Protein folding, phylogenetic tree construction, and statistical model selection involve computationally hard problems.</li>
</ul>

<h3>A Brief History</h3>

<p>The formal study of computational complexity began in the 1960s with the work of Hartmanis and Stearns (1965), who defined complexity classes based on time and space bounds. The concept of NP-completeness was independently discovered by Stephen Cook (1971) and Leonid Levin (1973). Richard Karp (1972) demonstrated that 21 important combinatorial problems are NP-complete, establishing the practical significance of the theory.</p>

<p>In 2000, the Clay Mathematics Institute named P vs NP as one of seven <strong>Millennium Prize Problems</strong>, offering a $1,000,000 reward for its resolution. It remains unsolved.</p>

<div class="env-block remark">
    <div class="env-title">The Stakes</div>
    <div class="env-body">
        <p>If P = NP, then every problem whose solution can be quickly <em>checked</em> can also be quickly <em>found</em>. This would revolutionize mathematics (proofs could be found automatically), break all current cryptography, and solve countless optimization problems. Most experts believe P &ne; NP, but nobody has been able to prove it.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-millennium-prize"></div>
`,
            visualizations: [
                {
                    id: 'viz-millennium-prize',
                    title: 'The Millennium Prize Problems',
                    description: 'P vs NP is one of seven problems for which the Clay Mathematics Institute offers a million-dollar prize. Click each tile to learn more.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var problems = [
                            { name: 'P vs NP', year: '2000', status: 'Open', color: viz.colors.blue,
                              desc: 'Can every problem whose solution is quickly verifiable also be quickly solved?' },
                            { name: 'Riemann\nHypothesis', year: '1859', status: 'Open', color: viz.colors.purple,
                              desc: 'All non-trivial zeros of the Riemann zeta function have real part 1/2.' },
                            { name: 'Yang-Mills\nExistence', year: '1954', status: 'Open', color: viz.colors.teal,
                              desc: 'Prove that Yang-Mills theory exists and has a mass gap.' },
                            { name: 'Navier-Stokes\nExistence', year: '1845', status: 'Open', color: viz.colors.orange,
                              desc: 'Do smooth solutions to the Navier-Stokes equations always exist in 3D?' },
                            { name: 'Hodge\nConjecture', year: '1950', status: 'Open', color: viz.colors.pink,
                              desc: 'Certain cohomology classes on algebraic varieties are combinations of subvarieties.' },
                            { name: 'Birch &\nSwinnerton-Dyer', year: '1965', status: 'Open', color: viz.colors.yellow,
                              desc: 'The rank of an elliptic curve equals the order of vanishing of its L-function at s=1.' },
                            { name: 'Poincar\u00e9\nConjecture', year: '1904', status: 'Solved\n(2003)', color: viz.colors.green,
                              desc: 'Every simply connected, closed 3-manifold is homeomorphic to S\u00B3. Solved by Perelman.' }
                        ];

                        var selected = 0;

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var tileW = 88, tileH = 88, gap = 8;
                            var totalW = 7 * tileW + 6 * gap;
                            var startX = (viz.width - totalW) / 2;
                            var startY = 30;
                            for (var i = 0; i < 7; i++) {
                                var tx = startX + i * (tileW + gap);
                                if (mx >= tx && mx <= tx + tileW && my >= startY && my <= startY + tileH) {
                                    selected = i;
                                    draw();
                                    return;
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('The Seven Millennium Prize Problems', viz.width / 2, 16, viz.colors.white, 15);

                            var tileW = 88, tileH = 88, gap = 8;
                            var totalW = 7 * tileW + 6 * gap;
                            var startX = (viz.width - totalW) / 2;
                            var startY = 30;

                            for (var i = 0; i < 7; i++) {
                                var p = problems[i];
                                var tx = startX + i * (tileW + gap);

                                // Tile background
                                ctx.fillStyle = i === selected ? p.color + '55' : p.color + '22';
                                ctx.strokeStyle = i === selected ? p.color : p.color + '66';
                                ctx.lineWidth = i === selected ? 2.5 : 1;
                                ctx.beginPath();
                                ctx.roundRect(tx, startY, tileW, tileH, 6);
                                ctx.fill();
                                ctx.stroke();

                                // Name (handle newlines)
                                ctx.fillStyle = i === selected ? viz.colors.white : viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                var lines = p.name.split('\n');
                                for (var li = 0; li < lines.length; li++) {
                                    ctx.fillText(lines[li], tx + tileW / 2, startY + tileH / 2 - (lines.length - 1) * 7 + li * 14);
                                }
                            }

                            // Detail card for selected
                            var sp = problems[selected];
                            var cardY = startY + tileH + 25;
                            var cardW = 500, cardH = 200;
                            var cardX = (viz.width - cardW) / 2;

                            ctx.fillStyle = sp.color + '15';
                            ctx.strokeStyle = sp.color + '44';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.roundRect(cardX, cardY, cardW, cardH, 8);
                            ctx.fill();
                            ctx.stroke();

                            // Problem name
                            ctx.fillStyle = sp.color;
                            ctx.font = 'bold 18px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillText(sp.name.replace('\n', ' '), cardX + 20, cardY + 16);

                            // Year posed
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('First posed: ' + sp.year, cardX + 20, cardY + 44);

                            // Status
                            var statusColor = sp.status.includes('Solved') ? viz.colors.green : viz.colors.orange;
                            ctx.fillStyle = statusColor;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.fillText('Status: ' + sp.status.replace('\n', ' '), cardX + 20, cardY + 64);

                            // Description
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            var desc = sp.desc;
                            // Word wrap
                            var words = desc.split(' ');
                            var line = '';
                            var lineY = cardY + 95;
                            var maxLineW = cardW - 40;
                            for (var w = 0; w < words.length; w++) {
                                var test = line + (line ? ' ' : '') + words[w];
                                if (ctx.measureText(test).width > maxLineW && line) {
                                    ctx.fillText(line, cardX + 20, lineY);
                                    line = words[w];
                                    lineY += 20;
                                } else {
                                    line = test;
                                }
                            }
                            if (line) ctx.fillText(line, cardX + 20, lineY);

                            // Prize
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('$1,000,000 prize', cardX + cardW - 20, cardY + 16);

                            // Highlight P vs NP
                            if (selected === 0) {
                                ctx.fillStyle = viz.colors.blue + '88';
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('This is the subject of Chapter 19', viz.width / 2, cardY + cardH + 20);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Give an example from everyday life where <em>checking</em> a solution is much easier than <em>finding</em> one. Explain why the asymmetry exists.',
                    hint: 'Think about jigsaw puzzles, passwords, or Sudoku.',
                    solution: 'A jigsaw puzzle: checking that every piece fits takes a quick visual scan, but finding the right placement for each piece can take hours. The asymmetry exists because verification leverages the structure of the solution (every piece fits its neighbors), while search must navigate a huge space of possibilities (each of \\(n\\) pieces could go in any of \\(n\\) positions).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Big-O Notation
        // ================================================================
        {
            id: 'sec-big-o',
            title: 'Big-O Notation',
            content: `
<h2>Big-O Notation</h2>

<div class="env-block intuition">
    <div class="env-title">Ignoring Constants</div>
    <div class="env-body">
        <p>Suppose one algorithm takes \\(3n^2 + 7n + 15\\) steps and another takes \\(100n\\) steps. For small inputs, the first might be faster. But as \\(n\\) grows, the \\(3n^2\\) term dominates, and the second algorithm wins. Big-O notation captures this by focusing on the <strong>growth rate</strong>, ignoring constant factors and lower-order terms.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Big-O)</div>
    <div class="env-body">
        <p>Let \\(f, g: \\mathbb{N} \\to \\mathbb{R}^+\\). We write \\(f(n) = O(g(n))\\) if there exist constants \\(c > 0\\) and \\(n_0 \\in \\mathbb{N}\\) such that</p>
        \\[f(n) \\leq c \\cdot g(n) \\quad \\text{for all } n \\geq n_0.\\]
        <p>Informally, \\(f\\) grows <strong>no faster than</strong> \\(g\\) up to a constant factor, for sufficiently large \\(n\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Big-\\(\\Omega\\) and Big-\\(\\Theta\\))</div>
    <div class="env-body">
        <p><strong>Big-\\(\\Omega\\) (lower bound):</strong> \\(f(n) = \\Omega(g(n))\\) if there exist \\(c > 0\\) and \\(n_0\\) such that \\(f(n) \\geq c \\cdot g(n)\\) for all \\(n \\geq n_0\\).</p>
        <p><strong>Big-\\(\\Theta\\) (tight bound):</strong> \\(f(n) = \\Theta(g(n))\\) if \\(f(n) = O(g(n))\\) and \\(f(n) = \\Omega(g(n))\\). This means \\(f\\) and \\(g\\) grow at the <strong>same rate</strong>.</p>
    </div>
</div>

<h3>Common Growth Rates</h3>

<p>The following growth rates appear constantly in algorithm analysis, listed from slowest to fastest growth:</p>

\\[O(1) \\subset O(\\log n) \\subset O(n) \\subset O(n \\log n) \\subset O(n^2) \\subset O(n^3) \\subset O(2^n) \\subset O(n!)\\]

<div class="env-block example">
    <div class="env-title">Example: Growth Rate Comparison</div>
    <div class="env-body">
        <p>For \\(n = 100\\):</p>
        <ul>
            <li>\\(\\log_2 n \\approx 7\\)</li>
            <li>\\(n = 100\\)</li>
            <li>\\(n \\log_2 n \\approx 664\\)</li>
            <li>\\(n^2 = 10{,}000\\)</li>
            <li>\\(n^3 = 1{,}000{,}000\\)</li>
            <li>\\(2^n \\approx 1.27 \\times 10^{30}\\) (larger than the number of grains of sand on Earth)</li>
            <li>\\(n! \\approx 9.3 \\times 10^{157}\\) (incomprehensibly vast)</li>
        </ul>
    </div>
</div>

<h3>The "Exponential Wall"</h3>

<p>The most important boundary in computational complexity is between <strong>polynomial</strong> growth (\\(n^k\\) for some fixed \\(k\\)) and <strong>exponential</strong> growth (\\(c^n\\) for some \\(c > 1\\)). No matter how large the polynomial exponent or how small the exponential base, exponential eventually dominates:</p>

\\[\\lim_{n \\to \\infty} \\frac{n^k}{c^n} = 0 \\quad \\text{for any fixed } k \\text{ and } c > 1.\\]

<p>This is the <strong>exponential wall</strong>: problems requiring exponential time become intractable for even moderate input sizes, regardless of hardware improvements.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 19.1 (Polynomial vs Exponential)</div>
    <div class="env-body">
        <p>For any polynomial \\(p(n)\\) and any exponential \\(c^n\\) with \\(c > 1\\), there exists \\(n_0\\) such that \\(p(n) < c^n\\) for all \\(n > n_0\\). Equivalently, \\(p(n) = o(c^n)\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-growth-rates"></div>
`,
            visualizations: [
                {
                    id: 'viz-growth-rates',
                    title: 'Growth Rate Comparison',
                    description: 'Watch how different growth rates compare. Use the scale slider to zoom in or out. The exponential wall becomes dramatically visible as n increases.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 70, originY: 380, scale: 1
                        });

                        var maxN = 15;
                        VizEngine.createSlider(controls, 'Max n', 5, 50, maxN, 1, function(v) {
                            maxN = Math.round(v);
                            draw();
                        });

                        var funcs = [
                            { name: 'n', fn: function(x) { return x; }, color: viz.colors.green },
                            { name: 'n log n', fn: function(x) { return x > 0 ? x * Math.log2(x) : 0; }, color: viz.colors.teal },
                            { name: 'n\u00B2', fn: function(x) { return x * x; }, color: viz.colors.blue },
                            { name: 'n\u00B3', fn: function(x) { return x * x * x; }, color: viz.colors.purple },
                            { name: '2\u207F', fn: function(x) { return Math.pow(2, x); }, color: viz.colors.orange },
                            { name: 'n!', fn: function(x) { var r = 1; for (var i = 2; i <= Math.floor(x); i++) r *= i; return r; }, color: viz.colors.red }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Determine y range (use log scale if needed)
                            var maxY = 0;
                            for (var fi = 0; fi < funcs.length; fi++) {
                                var fy = funcs[fi].fn(maxN);
                                if (isFinite(fy)) maxY = Math.max(maxY, fy);
                            }
                            var useLog = maxY > 10000;
                            var plotW = viz.width - 100;
                            var plotH = 330;
                            var plotX = 70;
                            var plotY = 10;

                            // Background
                            ctx.fillStyle = viz.colors.grid;
                            ctx.fillRect(plotX, plotY, plotW, plotH);

                            // Y axis
                            var yLabel = useLog ? 'log\u2081\u2080(steps)' : 'steps';
                            var logMax = useLog ? Math.log10(Math.max(maxY, 10)) : maxY;
                            if (!useLog && logMax === 0) logMax = 1;

                            // Grid lines
                            ctx.strokeStyle = viz.colors.bg + '88';
                            ctx.lineWidth = 0.5;
                            var numGridY = 5;
                            for (var gi = 0; gi <= numGridY; gi++) {
                                var gy = plotY + plotH - (gi / numGridY) * plotH;
                                ctx.beginPath(); ctx.moveTo(plotX, gy); ctx.lineTo(plotX + plotW, gy); ctx.stroke();
                                var labelVal = useLog ? (gi / numGridY * logMax).toFixed(1) : Math.round(gi / numGridY * logMax);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(String(labelVal), plotX - 5, gy);
                            }

                            // X axis labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var step = Math.max(1, Math.floor(maxN / 10));
                            for (var xi = 0; xi <= maxN; xi += step) {
                                var xx = plotX + (xi / maxN) * plotW;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(String(xi), xx, plotY + plotH + 4);
                            }
                            viz.screenText('n', plotX + plotW + 15, plotY + plotH, viz.colors.text, 12);
                            viz.screenText(yLabel, plotX - 35, plotY - 5, viz.colors.text, 10, 'center', 'bottom');

                            // Draw functions
                            var resolution = 200;
                            for (var fi = 0; fi < funcs.length; fi++) {
                                var f = funcs[fi];
                                ctx.strokeStyle = f.color;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                var started = false;
                                for (var s = 0; s <= resolution; s++) {
                                    var xv = (s / resolution) * maxN;
                                    var yv = f.fn(xv);
                                    if (!isFinite(yv) || yv < 0) { started = false; continue; }
                                    var yPlot = useLog ? (yv > 0 ? Math.log10(yv) : 0) : yv;
                                    var sx = plotX + (xv / maxN) * plotW;
                                    var sy = plotY + plotH - (yPlot / logMax) * plotH;
                                    if (sy < plotY - 5) { started = false; continue; }
                                    sy = Math.max(plotY, sy);
                                    if (!started) { ctx.moveTo(sx, sy); started = true; }
                                    else ctx.lineTo(sx, sy);
                                }
                                ctx.stroke();
                            }

                            // Legend
                            var legX = plotX + plotW - 160;
                            var legY = plotY + 15;
                            for (var li = 0; li < funcs.length; li++) {
                                ctx.fillStyle = funcs[li].color;
                                ctx.fillRect(legX, legY + li * 16, 12, 3);
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(funcs[li].name, legX + 18, legY + li * 16 + 1);
                            }

                            // Scale mode indicator
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText(useLog ? 'Log scale (exponential wall visible)' : 'Linear scale', plotX + 5, plotY + plotH - 8);

                            // Exponential wall annotation
                            if (maxN > 15) {
                                ctx.fillStyle = viz.colors.red + '88';
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('EXPONENTIAL WALL', plotX + plotW * 0.7, plotY + 15);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that \\(3n^2 + 7n + 15 = O(n^2)\\). Find explicit values of \\(c\\) and \\(n_0\\).',
                    hint: 'For \\(n \\geq 1\\), bound each term: \\(7n \\leq 7n^2\\) and \\(15 \\leq 15n^2\\).',
                    solution: 'For \\(n \\geq 1\\): \\(3n^2 + 7n + 15 \\leq 3n^2 + 7n^2 + 15n^2 = 25n^2\\). So we can take \\(c = 25\\) and \\(n_0 = 1\\). Thus \\(3n^2 + 7n + 15 = O(n^2)\\).'
                },
            ]
        },

        // ================================================================
        // SECTION 3: The Class P
        // ================================================================
        {
            id: 'sec-p',
            title: 'The Class P',
            content: `
<h2>The Class P</h2>

<div class="env-block intuition">
    <div class="env-title">Efficiently Solvable Problems</div>
    <div class="env-body">
        <p>When we say a problem is "efficiently solvable," we mean there exists an algorithm that solves it in polynomial time: \\(O(n^k)\\) for some fixed constant \\(k\\), where \\(n\\) is the size of the input. The class P collects all such problems.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Decision Problem)</div>
    <div class="env-body">
        <p>A <strong>decision problem</strong> is a problem whose answer is "yes" or "no." For example: "Given a graph \\(G\\), does it contain a Hamiltonian cycle?" Complexity theory focuses on decision problems because they are the simplest to classify, and optimization problems can typically be reduced to them.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (The Class P)</div>
    <div class="env-body">
        <p><strong>P</strong> is the class of decision problems solvable by a deterministic Turing machine in polynomial time. Equivalently, a problem \\(L\\) is in P if there exists an algorithm \\(A\\) and a constant \\(k\\) such that for every input \\(x\\) of length \\(n\\), \\(A\\) decides whether \\(x \\in L\\) in at most \\(O(n^k)\\) steps.</p>
    </div>
</div>

<h3>Examples of Problems in P</h3>

<div class="env-block example">
    <div class="env-title">Example: Sorting</div>
    <div class="env-body">
        <p>Given a list of \\(n\\) numbers, sort them in increasing order. Merge sort runs in \\(O(n \\log n)\\) time, which is polynomial. In fact, comparison-based sorting has a lower bound of \\(\\Omega(n \\log n)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Shortest Path</div>
    <div class="env-body">
        <p>Given a weighted graph with \\(n\\) vertices and \\(m\\) edges, find the shortest path from \\(s\\) to \\(t\\). Dijkstra's algorithm runs in \\(O(m + n \\log n)\\), which is polynomial. (We studied graphs in Chapters 10-13.)</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Primality Testing</div>
    <div class="env-body">
        <p>Given an integer \\(n\\), determine whether \\(n\\) is prime. The AKS algorithm (Agrawal, Kayal, Saxena, 2002) runs in polynomial time \\(O((\\log n)^{6+\\varepsilon})\\). This was a major breakthrough: for decades it was unknown whether primality testing was in P. Note: the input size is \\(\\log n\\) (the number of digits), so the algorithm is polynomial in the input length.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: 2-Coloring a Graph</div>
    <div class="env-body">
        <p>Given a graph \\(G\\), can we color its vertices with 2 colors such that no two adjacent vertices share a color? This is equivalent to checking if \\(G\\) is bipartite, which BFS can determine in \\(O(n + m)\\) time. (Contrast this with 3-coloring, which is NP-complete.)</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why Polynomial?</div>
    <div class="env-body">
        <p>The choice of "polynomial time" as the threshold for efficiency is somewhat arbitrary but well-motivated. Polynomial-time algorithms are <strong>closed under composition</strong>: if you feed the output of one polynomial-time algorithm into another, the result is still polynomial-time. This makes P a robust class, independent of the computational model (Turing machine, RAM machine, etc.) up to polynomial factors.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-sorting-race"></div>
`,
            visualizations: [
                {
                    id: 'viz-sorting-race',
                    title: 'Sorting Race: O(n\u00B2) vs O(n log n)',
                    description: 'Watch bubble sort (O(n\u00B2)) race against merge sort (O(n log n)). The difference becomes dramatic for larger inputs. Click Start to begin.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 40;
                        var bubbleArr = [], mergeArr = [];
                        var bubbleSteps = 0, mergeSteps = 0;
                        var bubbleDone = false, mergeDone = false;
                        var animating = false;
                        var bubbleI = 0, bubbleJ = 0;
                        var mergeOps = [];
                        var mergeOpIdx = 0;

                        VizEngine.createSlider(controls, 'Array size', 10, 80, n, 1, function(v) {
                            n = Math.round(v);
                            resetArrays();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Start Race', function() {
                            if (animating) return;
                            resetArrays();
                            prepareMergeOps();
                            animating = true;
                            race();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            animating = false;
                            resetArrays();
                            draw();
                        });

                        function resetArrays() {
                            bubbleArr = [];
                            mergeArr = [];
                            for (var i = 0; i < n; i++) {
                                var val = Math.random() * 0.9 + 0.05;
                                bubbleArr.push(val);
                                mergeArr.push(val);
                            }
                            bubbleSteps = 0; mergeSteps = 0;
                            bubbleDone = false; mergeDone = false;
                            bubbleI = 0; bubbleJ = 0;
                            mergeOps = []; mergeOpIdx = 0;
                        }

                        function prepareMergeOps() {
                            mergeOps = [];
                            var arr = mergeArr.slice();

                            function mergeSort(a, lo, hi) {
                                if (hi - lo <= 1) return;
                                var mid = Math.floor((lo + hi) / 2);
                                mergeSort(a, lo, mid);
                                mergeSort(a, mid, hi);
                                // Merge
                                var left = a.slice(lo, mid);
                                var right = a.slice(mid, hi);
                                var i = 0, j = 0, k = lo;
                                while (i < left.length && j < right.length) {
                                    if (left[i] <= right[j]) {
                                        a[k] = left[i]; i++;
                                    } else {
                                        a[k] = right[j]; j++;
                                    }
                                    mergeOps.push({ idx: k, val: a[k] });
                                    k++;
                                }
                                while (i < left.length) { a[k] = left[i]; mergeOps.push({ idx: k, val: a[k] }); i++; k++; }
                                while (j < right.length) { a[k] = right[j]; mergeOps.push({ idx: k, val: a[k] }); j++; k++; }
                            }
                            mergeSort(arr, 0, arr.length);
                        }

                        function bubbleStep() {
                            if (bubbleDone) return;
                            if (bubbleJ >= n - 1 - bubbleI) {
                                bubbleI++;
                                bubbleJ = 0;
                                if (bubbleI >= n - 1) { bubbleDone = true; return; }
                            }
                            if (bubbleArr[bubbleJ] > bubbleArr[bubbleJ + 1]) {
                                var tmp = bubbleArr[bubbleJ];
                                bubbleArr[bubbleJ] = bubbleArr[bubbleJ + 1];
                                bubbleArr[bubbleJ + 1] = tmp;
                            }
                            bubbleJ++;
                            bubbleSteps++;
                        }

                        function mergeStep() {
                            if (mergeDone) return;
                            if (mergeOpIdx >= mergeOps.length) { mergeDone = true; return; }
                            var op = mergeOps[mergeOpIdx];
                            mergeArr[op.idx] = op.val;
                            mergeOpIdx++;
                            mergeSteps++;
                        }

                        function race() {
                            if (!animating) return;
                            // Bubble sort does more steps per frame to keep it visible
                            var bubblePerFrame = Math.max(1, Math.floor(n / 5));
                            var mergePerFrame = 1;
                            for (var b = 0; b < bubblePerFrame; b++) bubbleStep();
                            for (var m = 0; m < mergePerFrame; m++) mergeStep();
                            draw();
                            if (bubbleDone && mergeDone) {
                                animating = false;
                                draw();
                                return;
                            }
                            requestAnimationFrame(race);
                        }

                        function drawBars(arr, x, y, w, h, label, steps, done, highlightColor) {
                            var ctx = viz.ctx;
                            var barW = w / arr.length;

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText(label, x + w / 2, y - 5);

                            for (var i = 0; i < arr.length; i++) {
                                var barH = arr[i] * h;
                                ctx.fillStyle = done ? viz.colors.green : highlightColor;
                                ctx.fillRect(x + i * barW, y + h - barH, Math.max(1, barW - 1), barH);
                            }

                            ctx.fillStyle = done ? viz.colors.green : viz.colors.white;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Steps: ' + steps, x + w / 2, y + h + 5);
                            if (done) ctx.fillText('DONE', x + w / 2, y + h + 20);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Sorting Race', viz.width / 2, 18, viz.colors.white, 16);

                            var halfW = (viz.width - 40) / 2;
                            drawBars(bubbleArr, 15, 50, halfW, 280, 'Bubble Sort  O(n\u00B2)', bubbleSteps, bubbleDone, viz.colors.orange);
                            drawBars(mergeArr, 25 + halfW, 50, halfW, 280, 'Merge Sort  O(n log n)', mergeSteps, mergeDone, viz.colors.blue);

                            // Comparison
                            if (bubbleDone && mergeDone) {
                                var ratio = bubbleSteps > 0 ? (bubbleSteps / Math.max(mergeSteps, 1)).toFixed(1) : '?';
                                viz.screenText('Bubble sort took ' + ratio + 'x more steps than merge sort', viz.width / 2, viz.height - 30, viz.colors.teal, 13);
                            }
                        }

                        resetArrays();
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Is the problem "given a graph \\(G\\) with \\(n\\) vertices, does \\(G\\) have an Euler circuit?" in P? Justify your answer by giving the complexity of an algorithm that solves it.',
                    hint: 'Recall the characterization of Euler circuits from Chapter 12: a connected graph has an Euler circuit if and only if every vertex has even degree.',
                    solution: 'Yes, it is in P. Check two conditions: (1) the graph is connected (BFS/DFS in \\(O(n + m)\\)), and (2) every vertex has even degree (scan the adjacency list in \\(O(n + m)\\)). Total: \\(O(n + m)\\), which is polynomial.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Class NP
        // ================================================================
        {
            id: 'sec-np',
            title: 'The Class NP',
            content: `
<h2>The Class NP</h2>

<div class="env-block intuition">
    <div class="env-title">The Verifier Perspective</div>
    <div class="env-body">
        <p>NP does <strong>not</strong> stand for "not polynomial." It stands for <strong>Nondeterministic Polynomial</strong>, meaning solvable in polynomial time by a nondeterministic Turing machine. But the most useful way to think about NP is through <em>verification</em>:</p>
        <p>A problem is in NP if, whenever the answer is "yes," there exists a short <strong>certificate</strong> (proof) that can be <strong>checked in polynomial time</strong>.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (The Class NP)</div>
    <div class="env-body">
        <p>A decision problem \\(L\\) is in <strong>NP</strong> if there exists a polynomial-time verifier \\(V\\) and a polynomial \\(p\\) such that:</p>
        <ul>
            <li><strong>Completeness:</strong> If \\(x \\in L\\), then there exists a certificate \\(c\\) with \\(|c| \\leq p(|x|)\\) such that \\(V(x, c)\\) accepts.</li>
            <li><strong>Soundness:</strong> If \\(x \\notin L\\), then for <em>every</em> string \\(c\\), \\(V(x, c)\\) rejects.</li>
        </ul>
    </div>
</div>

<h3>P \\(\\subseteq\\) NP</h3>

<p>Every problem in P is also in NP. Why? If you can <em>solve</em> a problem in polynomial time, you can certainly <em>verify</em> a solution in polynomial time (just solve it from scratch and compare). The certificate can be empty.</p>

<p>The open question is whether NP \\(\\subseteq\\) P, which would mean P = NP.</p>

<h3>Examples of Problems in NP</h3>

<div class="env-block example">
    <div class="env-title">Example: Hamiltonian Cycle</div>
    <div class="env-body">
        <p><strong>Problem:</strong> Given a graph \\(G\\), does it contain a cycle that visits every vertex exactly once?</p>
        <p><strong>Certificate:</strong> A sequence of vertices \\((v_1, v_2, \\ldots, v_n)\\).</p>
        <p><strong>Verification:</strong> Check that (1) every vertex appears exactly once, (2) consecutive vertices are connected by an edge, and (3) \\(v_n\\) is adjacent to \\(v_1\\). This takes \\(O(n)\\) time.</p>
        <p>Finding a Hamiltonian cycle, however, has no known polynomial-time algorithm.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Boolean Satisfiability (SAT)</div>
    <div class="env-body">
        <p><strong>Problem:</strong> Given a Boolean formula \\(\\varphi(x_1, \\ldots, x_n)\\), is there an assignment of truth values that makes \\(\\varphi\\) true?</p>
        <p><strong>Certificate:</strong> A truth assignment \\((x_1 = T, x_2 = F, \\ldots)\\).</p>
        <p><strong>Verification:</strong> Substitute the values into \\(\\varphi\\) and evaluate. This takes \\(O(|\\varphi|)\\) time.</p>
        <p>This connects directly to the propositional logic of Chapter 0.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Subset Sum</div>
    <div class="env-body">
        <p><strong>Problem:</strong> Given a set \\(S = \\{a_1, \\ldots, a_n\\}\\) of integers and a target \\(t\\), is there a subset of \\(S\\) that sums to \\(t\\)?</p>
        <p><strong>Certificate:</strong> The subset itself.</p>
        <p><strong>Verification:</strong> Sum the elements and check against \\(t\\). \\(O(n)\\) time.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-sat-solver"></div>
`,
            visualizations: [
                {
                    id: 'viz-sat-solver',
                    title: 'Brute-Force SAT Solver',
                    description: 'Enter a Boolean formula in CNF (conjunctive normal form) or use the default. Watch the solver try all 2^n assignments. Each row is one assignment; green means the formula is satisfied.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var numVars = 4;
                        // Default CNF: (x1 v x2) ^ (~x2 v x3) ^ (~x1 v ~x3 v x4) ^ (x2 v ~x4)
                        var clauses = [
                            [1, 2],
                            [-2, 3],
                            [-1, -3, 4],
                            [2, -4]
                        ];
                        var checkedUpTo = -1;
                        var satisfyingIdx = -1;
                        var animating = false;

                        VizEngine.createSlider(controls, 'Variables', 2, 6, numVars, 1, function(v) {
                            numVars = Math.round(v);
                            generateRandomCNF();
                            checkedUpTo = -1;
                            satisfyingIdx = -1;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Solve (Animate)', function() {
                            if (animating) return;
                            checkedUpTo = -1;
                            satisfyingIdx = -1;
                            animating = true;
                            solveStep();
                        });

                        VizEngine.createButton(controls, 'New Formula', function() {
                            animating = false;
                            generateRandomCNF();
                            checkedUpTo = -1;
                            satisfyingIdx = -1;
                            draw();
                        });

                        function generateRandomCNF() {
                            var numClauses = numVars + Math.floor(Math.random() * numVars);
                            clauses = [];
                            for (var c = 0; c < numClauses; c++) {
                                var clauseSize = 2 + Math.floor(Math.random() * 2); // 2 or 3 literals
                                var clause = [];
                                var usedVars = {};
                                for (var l = 0; l < clauseSize; l++) {
                                    var v;
                                    do { v = 1 + Math.floor(Math.random() * numVars); } while (usedVars[v]);
                                    usedVars[v] = true;
                                    clause.push(Math.random() < 0.5 ? v : -v);
                                }
                                clauses.push(clause);
                            }
                        }

                        function evaluate(assignment) {
                            for (var c = 0; c < clauses.length; c++) {
                                var clauseSat = false;
                                for (var l = 0; l < clauses[c].length; l++) {
                                    var lit = clauses[c][l];
                                    var v = Math.abs(lit) - 1;
                                    var val = assignment[v];
                                    if (lit > 0 && val) clauseSat = true;
                                    if (lit < 0 && !val) clauseSat = true;
                                }
                                if (!clauseSat) return false;
                            }
                            return true;
                        }

                        function getAssignment(idx) {
                            var a = [];
                            for (var i = numVars - 1; i >= 0; i--) {
                                a.unshift(!!(idx & (1 << i)));
                            }
                            return a;
                        }

                        function solveStep() {
                            if (!animating) return;
                            checkedUpTo++;
                            var total = Math.pow(2, numVars);
                            if (checkedUpTo >= total) {
                                animating = false;
                                draw();
                                return;
                            }
                            var a = getAssignment(checkedUpTo);
                            if (evaluate(a)) {
                                satisfyingIdx = checkedUpTo;
                                animating = false;
                                draw();
                                return;
                            }
                            draw();
                            var delay = Math.max(20, 300 / total * 10);
                            setTimeout(solveStep, delay);
                        }

                        function formatClause(clause) {
                            return '(' + clause.map(function(l) {
                                return (l < 0 ? '\u00ACx' : 'x') + Math.abs(l);
                            }).join(' \u2228 ') + ')';
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Formula display
                            var formulaStr = clauses.map(formatClause).join(' \u2227 ');
                            viz.screenText('CNF Formula:', 50, 18, viz.colors.text, 11, 'left');
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            // Word wrap formula
                            var fWords = formulaStr.split(' ');
                            var fLine = '', fY = 34;
                            for (var fw = 0; fw < fWords.length; fw++) {
                                var fTest = fLine + (fLine ? ' ' : '') + fWords[fw];
                                if (ctx.measureText(fTest).width > viz.width - 60 && fLine) {
                                    ctx.fillText(fLine, 30, fY);
                                    fLine = fWords[fw]; fY += 16;
                                } else fLine = fTest;
                            }
                            if (fLine) ctx.fillText(fLine, 30, fY);

                            // Assignment table
                            var total = Math.pow(2, numVars);
                            var tableY = fY + 30;
                            var rowH = Math.min(18, (viz.height - tableY - 40) / Math.min(total, 40));
                            var colW = 35;
                            var tableX = 30;

                            // Header
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var v = 0; v < numVars; v++) {
                                ctx.fillText('x' + (v + 1), tableX + v * colW + colW / 2, tableY);
                            }
                            ctx.fillText('Result', tableX + numVars * colW + 30, tableY);

                            var maxDisplay = Math.min(total, Math.floor((viz.height - tableY - 20) / rowH));

                            for (var r = 0; r < maxDisplay; r++) {
                                var ry = tableY + 14 + r * rowH;
                                var a = getAssignment(r);
                                var sat = evaluate(a);

                                // Row background
                                if (r === satisfyingIdx) {
                                    ctx.fillStyle = viz.colors.green + '33';
                                    ctx.fillRect(tableX - 5, ry - rowH / 2 - 2, numVars * colW + 80, rowH);
                                } else if (r <= checkedUpTo) {
                                    ctx.fillStyle = r === checkedUpTo ? viz.colors.blue + '22' : '#ffffff08';
                                    ctx.fillRect(tableX - 5, ry - rowH / 2 - 2, numVars * colW + 80, rowH);
                                }

                                // Values
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                for (var vi = 0; vi < numVars; vi++) {
                                    ctx.fillStyle = r <= checkedUpTo ? (a[vi] ? viz.colors.green : viz.colors.red) : viz.colors.text + '44';
                                    ctx.fillText(a[vi] ? 'T' : 'F', tableX + vi * colW + colW / 2, ry);
                                }

                                // Result
                                if (r <= checkedUpTo) {
                                    ctx.fillStyle = sat ? viz.colors.green : viz.colors.red;
                                    ctx.font = 'bold 10px -apple-system,sans-serif';
                                    ctx.fillText(sat ? 'SAT' : 'UNSAT', tableX + numVars * colW + 30, ry);
                                }
                            }

                            if (total > maxDisplay) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('... (' + (total - maxDisplay) + ' more rows)', viz.width / 2, viz.height - 30);
                            }

                            // Status
                            var statusY = 18;
                            ctx.textAlign = 'right';
                            if (satisfyingIdx >= 0) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.fillText('SATISFIABLE (found at row ' + satisfyingIdx + ' of ' + total + ')', viz.width - 20, statusY);
                            } else if (checkedUpTo >= total - 1) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.fillText('UNSATISFIABLE (checked all ' + total + ' assignments)', viz.width - 20, statusY);
                            } else if (checkedUpTo >= 0) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('Checking: ' + (checkedUpTo + 1) + ' / ' + total + ' assignments', viz.width - 20, statusY);
                            } else {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('2^' + numVars + ' = ' + total + ' total assignments to check', viz.width - 20, statusY);
                            }
                        }

                        generateRandomCNF();
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the CLIQUE problem (given a graph \\(G\\) and integer \\(k\\), does \\(G\\) contain a complete subgraph on \\(k\\) vertices?) is in NP.',
                    hint: 'What would the certificate be? How would you verify it?',
                    solution: 'Certificate: a set \\(S\\) of \\(k\\) vertices. Verification: check that \\(|S| = k\\) and that every pair of vertices in \\(S\\) is connected by an edge. The verification checks \\(\\binom{k}{2}\\) pairs, each in \\(O(1)\\) with an adjacency matrix, so verification takes \\(O(k^2) \\leq O(n^2)\\) time. Since \\(|S| \\leq n\\), the certificate has polynomial size. Therefore CLIQUE is in NP.'
                },
            ]
        },

        // ================================================================
        // SECTION 5: Reductions & NP-Completeness
        // ================================================================
        {
            id: 'sec-reductions',
            title: 'Reductions & NP-Completeness',
            content: `
<h2>Reductions and NP-Completeness</h2>

<div class="env-block intuition">
    <div class="env-title">Reducing One Problem to Another</div>
    <div class="env-body">
        <p>Suppose you know how to solve problem B but need to solve problem A. If you can transform any instance of A into an instance of B (in polynomial time), then A is "no harder than" B. This transformation is called a <strong>reduction</strong>.</p>
        <p>Reductions are the primary tool for proving that problems are hard. If A reduces to B and B is easy, then A is easy. Contrapositively, if A is hard and A reduces to B, then B is hard.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Polynomial-Time Reduction)</div>
    <div class="env-body">
        <p>Problem \\(A\\) is <strong>polynomial-time reducible</strong> to problem \\(B\\), written \\(A \\leq_p B\\), if there exists a polynomial-time computable function \\(f\\) such that for every input \\(x\\):</p>
        \\[x \\in A \\iff f(x) \\in B.\\]
        <p>The function \\(f\\) is called a <strong>reduction</strong>. Intuitively, \\(A \\leq_p B\\) means "A is no harder than B" (up to polynomial factors).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (NP-Hard and NP-Complete)</div>
    <div class="env-body">
        <p>A problem \\(B\\) is <strong>NP-hard</strong> if every problem in NP reduces to \\(B\\): \\(A \\leq_p B\\) for all \\(A \\in \\text{NP}\\).</p>
        <p>A problem \\(B\\) is <strong>NP-complete</strong> if it is both NP-hard and in NP.</p>
        <p>NP-complete problems are the "hardest" problems in NP: if <em>any one</em> of them can be solved in polynomial time, then <em>every</em> problem in NP can be, and P = NP.</p>
    </div>
</div>

<h3>The Cook-Levin Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 19.2 (Cook-Levin, 1971/73)</div>
    <div class="env-body">
        <p><strong>SAT is NP-complete.</strong></p>
        <p>Every problem in NP can be reduced to the Boolean satisfiability problem in polynomial time.</p>
    </div>
</div>

<p>The proof (which we state without giving in full) encodes the computation of any NP verifier as a Boolean formula. The variables represent the state of the Turing machine at each time step, and the clauses enforce that the computation follows the transition rules. The formula is satisfiable if and only if the verifier accepts.</p>

<h3>The Cascade of Reductions</h3>

<p>Once SAT was shown NP-complete, other problems could be proven NP-complete by reduction <em>from</em> SAT (or from any known NP-complete problem). Richard Karp showed 21 such reductions in his 1972 paper. Here are the key ones:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 19.3 (Karp's Key Reductions)</div>
    <div class="env-body">
        <p>The following problems are NP-complete:</p>
        <ol>
            <li><strong>3-SAT:</strong> SAT restricted to formulas where each clause has exactly 3 literals. (SAT \\(\\leq_p\\) 3-SAT)</li>
            <li><strong>Independent Set:</strong> Given graph \\(G\\) and integer \\(k\\), does \\(G\\) have \\(k\\) pairwise non-adjacent vertices? (3-SAT \\(\\leq_p\\) Independent Set)</li>
            <li><strong>Vertex Cover:</strong> Given graph \\(G\\) and integer \\(k\\), can we select \\(k\\) vertices that touch every edge? (Independent Set \\(\\leq_p\\) Vertex Cover)</li>
            <li><strong>Hamiltonian Cycle:</strong> Does \\(G\\) have a cycle visiting every vertex exactly once? (Vertex Cover \\(\\leq_p\\) Hamiltonian Cycle)</li>
        </ol>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Independent Set \\(\\leq_p\\) Vertex Cover</div>
    <div class="env-body">
        <p>A set \\(S\\) is independent (no two vertices in \\(S\\) are adjacent) if and only if \\(V \\setminus S\\) is a vertex cover (every edge has at least one endpoint in \\(V \\setminus S\\)). So \\(G\\) has an independent set of size \\(k\\) if and only if \\(G\\) has a vertex cover of size \\(n - k\\). This is a polynomial-time reduction (in fact, it takes \\(O(1)\\) to transform the problem).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-np-reductions"></div>
`,
            visualizations: [
                {
                    id: 'viz-np-reductions',
                    title: 'The Chain of NP-Completeness Reductions',
                    description: 'Click on any problem to see its description and which problem it reduces from. The chain shows how NP-completeness propagates through reductions.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var problems = [
                            { name: 'SAT', x: 100, y: 80, color: viz.colors.blue,
                              desc: 'Boolean satisfiability: is there a truth assignment making the formula true?',
                              from: 'Cook-Levin theorem (encodes any NP computation)' },
                            { name: '3-SAT', x: 280, y: 80, color: viz.colors.teal,
                              desc: 'SAT restricted to clauses with exactly 3 literals.',
                              from: 'SAT: replace each long clause with multiple 3-literal clauses using new variables.' },
                            { name: 'Independent\nSet', x: 460, y: 80, color: viz.colors.orange,
                              desc: 'Does the graph have k pairwise non-adjacent vertices?',
                              from: '3-SAT: build a graph from clauses where satisfying = selecting independent literals.' },
                            { name: 'Vertex\nCover', x: 460, y: 230, color: viz.colors.purple,
                              desc: 'Can we cover all edges with k vertices?',
                              from: 'Independent Set: S is independent iff V\\S is a vertex cover.' },
                            { name: 'Hamiltonian\nCycle', x: 280, y: 230, color: viz.colors.red,
                              desc: 'Does the graph have a cycle visiting every vertex exactly once?',
                              from: 'Vertex Cover: construct a graph where a Ham. cycle must "cover" every edge gadget.' },
                            { name: 'Subset\nSum', x: 100, y: 230, color: viz.colors.green,
                              desc: 'Does a subset of integers sum to target t?',
                              from: '3-SAT: encode clauses as digits in large integers.' }
                        ];

                        var arrows = [
                            [0, 1], [1, 2], [2, 3], [3, 4], [1, 5]
                        ];

                        var selected = 0;
                        var animPhase = 0;

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            for (var i = 0; i < problems.length; i++) {
                                var p = problems[i];
                                if (Math.abs(mx - p.x) < 55 && Math.abs(my - p.y) < 30) {
                                    selected = i;
                                    draw();
                                    return;
                                }
                            }
                        });

                        function drawArrow(ctx, x1, y1, x2, y2, color) {
                            var dx = x2 - x1, dy = y2 - y1;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            var sx = x1 + ux * 55, sy = y1 + uy * 25;
                            var ex = x2 - ux * 55, ey = y2 - uy * 25;
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
                            ctx.moveTo(ex, ey);
                            ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
                            ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
                            ctx.closePath();
                            ctx.fill();
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('NP-Completeness Reduction Chain', viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('A \u2192 B means "A reduces to B"', viz.width / 2, 36, viz.colors.text, 11);

                            // Draw arrows
                            for (var a = 0; a < arrows.length; a++) {
                                var from = problems[arrows[a][0]];
                                var to = problems[arrows[a][1]];
                                var arrowColor = (arrows[a][1] === selected) ? viz.colors.white : viz.colors.text + '66';
                                drawArrow(ctx, from.x, from.y, to.x, to.y, arrowColor);
                            }

                            // Draw problem nodes
                            for (var i = 0; i < problems.length; i++) {
                                var p = problems[i];
                                var isSel = (i === selected);

                                ctx.fillStyle = isSel ? p.color + '44' : p.color + '1a';
                                ctx.strokeStyle = isSel ? p.color : p.color + '66';
                                ctx.lineWidth = isSel ? 2.5 : 1;
                                ctx.beginPath();
                                ctx.roundRect(p.x - 50, p.y - 24, 100, 48, 8);
                                ctx.fill();
                                ctx.stroke();

                                ctx.fillStyle = isSel ? viz.colors.white : viz.colors.text;
                                ctx.font = (isSel ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                var pLines = p.name.split('\n');
                                for (var pl = 0; pl < pLines.length; pl++) {
                                    ctx.fillText(pLines[pl], p.x, p.y - (pLines.length - 1) * 7 + pl * 14);
                                }
                            }

                            // Detail card
                            var sp = problems[selected];
                            var cardY = 310;
                            ctx.fillStyle = sp.color + '15';
                            ctx.strokeStyle = sp.color + '33';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.roundRect(30, cardY, viz.width - 60, 90, 6);
                            ctx.fill();
                            ctx.stroke();

                            ctx.fillStyle = sp.color;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText(sp.name.replace('\n', ' '), 50, cardY + 18);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText(sp.desc, 50, cardY + 40);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Reduced from: ' + sp.from, 50, cardY + 62);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that if problem A is NP-complete and \\(A \\leq_p B\\), and \\(B \\in\\) NP, then \\(B\\) is NP-complete.',
                    hint: 'Use the transitivity of polynomial-time reductions.',
                    solution: 'Since \\(A\\) is NP-complete, every problem \\(C \\in\\) NP satisfies \\(C \\leq_p A\\). Since \\(A \\leq_p B\\), by transitivity of polynomial reductions, \\(C \\leq_p B\\). So \\(B\\) is NP-hard. Combined with \\(B \\in\\) NP, \\(B\\) is NP-complete.'
                },
                {
                    question: 'The CLIQUE problem asks: does graph \\(G\\) have a clique of size \\(k\\)? Show that Independent Set \\(\\leq_p\\) CLIQUE.',
                    hint: 'Consider the complement graph \\(\\bar{G}\\).',
                    solution: 'Given an instance \\((G, k)\\) of Independent Set, construct the complement graph \\(\\bar{G}\\) (same vertices; edge \\(\\{u,v\\}\\) in \\(\\bar{G}\\) iff \\(\\{u,v\\} \\notin G\\)). Then \\(S\\) is an independent set in \\(G\\) iff \\(S\\) is a clique in \\(\\bar{G}\\). So \\((G, k)\\) is a yes-instance of Independent Set iff \\((\\bar{G}, k)\\) is a yes-instance of CLIQUE. Computing \\(\\bar{G}\\) takes \\(O(n^2)\\) time. \\(\\square\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Beyond NP
        // ================================================================
        {
            id: 'sec-beyond',
            title: 'Beyond NP',
            content: `
<h2>Beyond NP</h2>

<div class="env-block intuition">
    <div class="env-title">A Hierarchy of Difficulty</div>
    <div class="env-body">
        <p>NP captures problems with efficiently verifiable "yes" answers. But what about problems where the "no" answers are hard to verify? What about problems that need even more computational resources? And what about problems that <em>no</em> computer can ever solve?</p>
    </div>
</div>

<h3>co-NP</h3>

<div class="env-block definition">
    <div class="env-title">Definition (co-NP)</div>
    <div class="env-body">
        <p><strong>co-NP</strong> is the class of problems whose complement is in NP. A problem \\(L\\) is in co-NP if whenever \\(x \\notin L\\), there exists a polynomial-size certificate that \\(x \\notin L\\), verifiable in polynomial time.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Tautology</div>
    <div class="env-body">
        <p>The <strong>TAUTOLOGY</strong> problem asks: is a given Boolean formula true under <em>every</em> assignment? This is the complement of SAT (which asks if there exists a <em>satisfying</em> assignment). TAUTOLOGY is in co-NP: if the formula is <em>not</em> a tautology, the certificate is a falsifying assignment.</p>
        <p>It is unknown whether TAUTOLOGY is in NP.</p>
    </div>
</div>

<p>It is believed that NP &ne; co-NP, but this is unproven. If NP = co-NP, it would imply that for every NP-complete problem, "no" answers also have short, efficiently checkable proofs.</p>

<h3>PSPACE</h3>

<div class="env-block definition">
    <div class="env-title">Definition (PSPACE)</div>
    <div class="env-body">
        <p><strong>PSPACE</strong> is the class of problems solvable using polynomial <em>space</em> (memory), with no restriction on time. Since a machine using \\(s\\) space can be in at most \\(2^{O(s)}\\) distinct configurations before repeating, PSPACE algorithms use at most exponential time.</p>
    </div>
</div>

<p>The known relationships are:</p>
\\[\\text{P} \\subseteq \\text{NP} \\subseteq \\text{PSPACE} \\subseteq \\text{EXPTIME}\\]
<p>and</p>
\\[\\text{P} \\subseteq \\text{co-NP} \\subseteq \\text{PSPACE} \\subseteq \\text{EXPTIME}.\\]

<p>We know P &ne; EXPTIME (by the time hierarchy theorem), but incredibly, it is open whether <em>any</em> of the other inclusions are strict.</p>

<div class="env-block example">
    <div class="env-title">Example: Quantified Boolean Formulas (QBF)</div>
    <div class="env-body">
        <p>QBF extends SAT with universal quantifiers: \\(\\forall x_1 \\exists x_2 \\forall x_3 \\ldots \\varphi(x_1, \\ldots, x_n)\\). This is the canonical PSPACE-complete problem, proven by Stockmeyer and Meyer (1973). It arises naturally in game theory: "for every move of player 1, does player 2 have a winning response?"</p>
    </div>
</div>

<h3>Undecidability: The Halting Problem</h3>

<p>Beyond all complexity classes lies the realm of <strong>undecidable</strong> problems: problems that no algorithm can solve, regardless of how much time or space is available.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 19.4 (Turing, 1936)</div>
    <div class="env-body">
        <p>The <strong>Halting Problem</strong> is undecidable: there is no algorithm that, given a program \\(P\\) and input \\(x\\), correctly determines whether \\(P\\) halts on \\(x\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (by Diagonalization)</div>
    <div class="env-body">
        <p>Suppose for contradiction that a halting decider \\(H(P, x)\\) exists, outputting "halts" or "loops."</p>
        <p>Construct a new program \\(D\\) that, on input \\(P\\):</p>
        <ol>
            <li>Runs \\(H(P, P)\\) (asks: does \\(P\\) halt when given its own source code?)</li>
            <li>If \\(H\\) says "halts," then \\(D\\) enters an infinite loop.</li>
            <li>If \\(H\\) says "loops," then \\(D\\) halts immediately.</li>
        </ol>
        <p>Now ask: does \\(D\\) halt on input \\(D\\)?</p>
        <ul>
            <li>If \\(D(D)\\) halts, then \\(H(D, D)\\) says "halts," so \\(D\\) loops. Contradiction.</li>
            <li>If \\(D(D)\\) loops, then \\(H(D, D)\\) says "loops," so \\(D\\) halts. Contradiction.</li>
        </ul>
        <p>Either way, we reach a contradiction. Therefore \\(H\\) cannot exist.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">Connection to Logic</div>
    <div class="env-body">
        <p>The halting problem proof is a computational version of the <strong>liar paradox</strong> ("this sentence is false") and is intimately connected to G&ouml;del's incompleteness theorem. The diagonal argument, which we also saw in Cantor's proof that \\(\\mathbb{R}\\) is uncountable (Chapter 5), is one of the deepest techniques in mathematics.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-p-vs-np"></div>
<div class="viz-placeholder" data-viz="viz-halting-problem"></div>
`,
            visualizations: [
                {
                    id: 'viz-p-vs-np',
                    title: 'Complexity Class Diagram',
                    description: 'The known (and conjectured) relationships between complexity classes. Solid containments are proven; dashed boundaries represent open questions.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var showConjectured = true;
                        VizEngine.createButton(controls, 'Toggle Conjectured/Known', function() {
                            showConjectured = !showConjectured;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cx = viz.width / 2, cy = viz.height / 2 + 10;

                            viz.screenText('Complexity Class Hierarchy', cx, 18, viz.colors.white, 15);
                            viz.screenText(showConjectured ? '(Conjectured: P \u2260 NP)' : '(What we can actually prove)', cx, 36, viz.colors.text, 11);

                            if (showConjectured) {
                                // EXPTIME
                                ctx.strokeStyle = viz.colors.text + '44';
                                ctx.lineWidth = 1.5;
                                ctx.setLineDash([]);
                                ctx.beginPath();
                                ctx.ellipse(cx, cy, 300, 170, 0, 0, Math.PI * 2);
                                ctx.stroke();
                                viz.screenText('EXPTIME', cx + 240, cy - 150, viz.colors.text, 11);

                                // Undecidable arrow
                                ctx.fillStyle = viz.colors.red + '44';
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('Undecidable problems (Halting, etc.) are OUTSIDE all classes', cx + 290, cy + 175);

                                // PSPACE
                                ctx.strokeStyle = viz.colors.purple + '66';
                                ctx.beginPath();
                                ctx.ellipse(cx, cy, 230, 140, 0, 0, Math.PI * 2);
                                ctx.stroke();
                                viz.screenText('PSPACE', cx + 170, cy - 115, viz.colors.purple, 12);

                                // NP
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.ellipse(cx - 30, cy, 150, 100, 0, 0, Math.PI * 2);
                                ctx.stroke();
                                viz.screenText('NP', cx + 80, cy - 70, viz.colors.orange, 13);

                                // co-NP
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.setLineDash([6, 4]);
                                ctx.beginPath();
                                ctx.ellipse(cx + 30, cy, 150, 100, 0, 0, Math.PI * 2);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('co-NP', cx - 80, cy - 70, viz.colors.teal, 13);

                                // P (inside both NP and co-NP)
                                ctx.fillStyle = viz.colors.green + '22';
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.ellipse(cx, cy + 10, 70, 50, 0, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.stroke();
                                viz.screenText('P', cx, cy + 10, viz.colors.green, 16);

                                // NP-complete region
                                ctx.fillStyle = viz.colors.red + '22';
                                ctx.beginPath();
                                ctx.ellipse(cx - 80, cy - 30, 40, 25, -0.3, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.red + '88';
                                ctx.lineWidth = 1;
                                ctx.stroke();
                                viz.screenText('NP-C', cx - 80, cy - 30, viz.colors.red, 10);

                                // Problem examples
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('Sorting, Shortest Path', cx, cy + 40);
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText('SAT, Clique, Ham. Cycle', cx - 80, cy - 8);
                                ctx.fillStyle = viz.colors.purple;
                                ctx.fillText('QBF', cx + 185, cy + 20);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('Factoring (?)', cx + 50, cy + 70);

                            } else {
                                // What we actually know
                                // EXPTIME (big)
                                ctx.strokeStyle = viz.colors.text + '66';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.ellipse(cx, cy, 290, 165, 0, 0, Math.PI * 2);
                                ctx.stroke();
                                viz.screenText('EXPTIME', cx + 230, cy - 140, viz.colors.text, 12);

                                // PSPACE
                                ctx.strokeStyle = viz.colors.purple + '88';
                                ctx.setLineDash([6, 4]);
                                ctx.beginPath();
                                ctx.ellipse(cx, cy, 210, 130, 0, 0, Math.PI * 2);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('PSPACE', cx + 155, cy - 105, viz.colors.purple, 12);

                                // NP = co-NP? (single region)
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.setLineDash([6, 4]);
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.ellipse(cx, cy, 130, 85, 0, 0, Math.PI * 2);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('NP (= co-NP?)', cx, cy - 65, viz.colors.orange, 13);

                                // P
                                ctx.fillStyle = viz.colors.green + '22';
                                ctx.strokeStyle = viz.colors.green;
                                ctx.setLineDash([6, 4]);
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.ellipse(cx, cy + 15, 65, 45, 0, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('P', cx, cy + 15, viz.colors.green, 16);

                                viz.screenText('PROVEN: P \u2260 EXPTIME', cx, cy + 130, viz.colors.white, 12);
                                viz.screenText('All other separations are OPEN', cx, cy + 148, viz.colors.red, 11);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Dashed = could collapse', cx, cy + 85);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-halting-problem',
                    title: 'The Halting Problem: Diagonal Argument',
                    description: 'Try to build a program H that decides halting. The diagonal construction shows why this always leads to contradiction. Click through the steps of the proof.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var step = 0;
                        var maxStep = 5;

                        VizEngine.createButton(controls, 'Next Step', function() {
                            if (step < maxStep) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0; draw();
                        });

                        var steps = [
                            { title: 'Step 0: Assume H exists',
                              desc: 'Suppose there exists a program H(P, x) that correctly decides\nwhether program P halts on input x.' },
                            { title: 'Step 1: Build the diagonal program D',
                              desc: 'D(P) = { if H(P, P) says "halts" then loop forever;\n              if H(P, P) says "loops" then halt. }' },
                            { title: 'Step 2: Feed D to itself',
                              desc: 'Ask: what does D(D) do?\nD runs H(D, D) to decide if D halts on input D.' },
                            { title: 'Step 3: Case 1 — suppose D(D) halts',
                              desc: 'If D(D) halts, then H(D,D) must have said "halts."\nBut then D\'s code says to loop forever. Contradiction!' },
                            { title: 'Step 4: Case 2 — suppose D(D) loops',
                              desc: 'If D(D) loops, then H(D,D) must have said "loops."\nBut then D\'s code says to halt. Contradiction!' },
                            { title: 'Step 5: Conclusion',
                              desc: 'Both cases lead to contradiction.\nTherefore our assumption is wrong: H cannot exist.\nThe Halting Problem is UNDECIDABLE.' }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('The Halting Problem Proof', viz.width / 2, 18, viz.colors.white, 15);

                            // Progress bar
                            var barY = 38, barW = 400, barH = 6;
                            var barX = (viz.width - barW) / 2;
                            ctx.fillStyle = viz.colors.grid;
                            ctx.fillRect(barX, barY, barW, barH);
                            ctx.fillStyle = step === maxStep ? viz.colors.red : viz.colors.blue;
                            ctx.fillRect(barX, barY, barW * (step / maxStep), barH);

                            // Step circles
                            for (var i = 0; i <= maxStep; i++) {
                                var sx = barX + (i / maxStep) * barW;
                                ctx.fillStyle = i <= step ? (i === maxStep ? viz.colors.red : viz.colors.blue) : viz.colors.text + '44';
                                ctx.beginPath();
                                ctx.arc(sx, barY + barH / 2, 8, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(String(i), sx, barY + barH / 2);
                            }

                            // Current step display
                            var s = steps[step];
                            var cardY = 70;

                            ctx.fillStyle = step === maxStep ? viz.colors.red + '15' : viz.colors.blue + '15';
                            ctx.strokeStyle = step === maxStep ? viz.colors.red + '44' : viz.colors.blue + '44';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.roundRect(40, cardY, viz.width - 80, 100, 8);
                            ctx.fill();
                            ctx.stroke();

                            ctx.fillStyle = step === maxStep ? viz.colors.red : viz.colors.blue;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillText(s.title, 60, cardY + 12);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px monospace';
                            var descLines = s.desc.split('\n');
                            for (var dl = 0; dl < descLines.length; dl++) {
                                ctx.fillText(descLines[dl], 60, cardY + 38 + dl * 16);
                            }

                            // Visual diagram
                            var diagY = 195;

                            // Draw H box
                            if (step >= 0) {
                                ctx.fillStyle = viz.colors.blue + '22';
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.roundRect(100, diagY, 120, 60, 6);
                                ctx.fill();
                                ctx.stroke();
                                viz.screenText('H(P, x)', 160, diagY + 30, viz.colors.blue, 14);
                                viz.screenText('"halts" or "loops"', 160, diagY + 70, viz.colors.text, 10);
                            }

                            // Draw D box
                            if (step >= 1) {
                                ctx.fillStyle = viz.colors.orange + '22';
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.roundRect(350, diagY, 200, 60, 6);
                                ctx.fill();
                                ctx.stroke();
                                viz.screenText('D(P)', 450, diagY + 15, viz.colors.orange, 14);
                                viz.screenText('if H(P,P)="halts" \u2192 loop', 450, diagY + 35, viz.colors.red, 10);
                                viz.screenText('if H(P,P)="loops" \u2192 halt', 450, diagY + 50, viz.colors.green, 10);

                                // Arrow from H to D
                                ctx.strokeStyle = viz.colors.text + '88';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(220, diagY + 30);
                                ctx.lineTo(350, diagY + 30);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.text + '88';
                                ctx.beginPath();
                                ctx.moveTo(350, diagY + 30);
                                ctx.lineTo(340, diagY + 25);
                                ctx.lineTo(340, diagY + 35);
                                ctx.closePath();
                                ctx.fill();
                            }

                            // Self-reference: D(D)
                            if (step >= 2) {
                                ctx.strokeStyle = viz.colors.yellow;
                                ctx.lineWidth = 2;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.moveTo(450, diagY + 60);
                                ctx.quadraticCurveTo(450, diagY + 110, 350, diagY + 100);
                                ctx.quadraticCurveTo(280, diagY + 90, 350, diagY + 60);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('D feeds itself: D(D)', 450, diagY + 110, viz.colors.yellow, 11);
                            }

                            // Contradiction arrows
                            if (step >= 3) {
                                ctx.fillStyle = viz.colors.red + '33';
                                ctx.beginPath();
                                ctx.roundRect(80, diagY + 130, 240, 55, 6);
                                ctx.fill();
                                viz.screenText('If D(D) halts', 200, diagY + 145, viz.colors.white, 12);
                                viz.screenText('\u2192 H says "halts" \u2192 D loops', 200, diagY + 165, viz.colors.red, 11);
                                viz.screenText('CONTRADICTION', 200, diagY + 180, viz.colors.red, 9);
                            }

                            if (step >= 4) {
                                ctx.fillStyle = viz.colors.red + '33';
                                ctx.beginPath();
                                ctx.roundRect(380, diagY + 130, 240, 55, 6);
                                ctx.fill();
                                viz.screenText('If D(D) loops', 500, diagY + 145, viz.colors.white, 12);
                                viz.screenText('\u2192 H says "loops" \u2192 D halts', 500, diagY + 165, viz.colors.red, 11);
                                viz.screenText('CONTRADICTION', 500, diagY + 180, viz.colors.red, 9);
                            }

                            if (step >= 5) {
                                ctx.fillStyle = viz.colors.red + '44';
                                ctx.beginPath();
                                ctx.roundRect(150, diagY + 195, 400, 30, 6);
                                ctx.fill();
                                viz.screenText('H cannot exist. The Halting Problem is undecidable.', viz.width / 2, diagY + 210, viz.colors.red, 13);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Is the complement of an NP-complete problem necessarily NP-complete? What complexity class does it belong to?',
                    hint: 'Think about the definition of co-NP.',
                    solution: 'No. The complement of an NP-complete problem is co-NP-complete (complete for co-NP under polynomial reductions). If NP &ne; co-NP (which is widely believed), then the complement of an NP-complete problem is not even in NP, let alone NP-complete.'
                },
            ]
        },

        // ================================================================
        // SECTION 7: The Big Picture (Course Synthesis)
        // ================================================================
        {
            id: 'sec-coda',
            title: 'The Big Picture',
            content: `
<h2>The Big Picture: Course Synthesis</h2>

<div class="env-block intuition">
    <div class="env-title">Connecting the Threads</div>
    <div class="env-body">
        <p>We have traveled from propositional logic (Chapter 0) to computational complexity (this chapter). Along the way, every topic has connected to every other. This final section maps those connections and reflects on what discrete mathematics reveals about the nature of computation.</p>
    </div>
</div>

<h3>The Web of Connections</h3>

<p>Computational complexity draws on <em>every</em> topic in this course:</p>

<ul>
    <li><strong>Logic (Chapters 0-1):</strong> SAT, the first NP-complete problem, is a question about propositional logic. Quantified Boolean formulas (PSPACE-complete) add predicate logic.</li>
    <li><strong>Proof Techniques (Chapter 2):</strong> The halting problem proof uses diagonalization. NP-completeness proofs use reduction, which is a form of constructive proof.</li>
    <li><strong>Sets &amp; Functions (Chapters 3-5):</strong> Complexity classes are sets of languages. Reductions are functions between problem instances. Cantor's diagonal argument (uncountability of \\(\\mathbb{R}\\)) is the template for the halting problem proof.</li>
    <li><strong>Counting (Chapters 6-9):</strong> The exponential blowup in brute-force search (\\(2^n\\) subsets, \\(n!\\) permutations) is why NP problems are hard. Generating functions appear in the analysis of algorithms.</li>
    <li><strong>Graph Theory (Chapters 10-13):</strong> Many NP-complete problems are graph problems: Hamiltonian cycle, graph coloring, clique, vertex cover, independent set. Graph algorithms like BFS and Dijkstra are in P.</li>
    <li><strong>Number Theory (Chapters 14-16):</strong> Primality testing is in P (AKS), but factoring's complexity is unknown. RSA security depends on the assumption that factoring is hard.</li>
    <li><strong>Boolean Algebra (Chapter 17):</strong> Circuit complexity is an alternative framework for studying P vs NP. Boolean circuits compute decision problems.</li>
    <li><strong>Automata (Chapter 18):</strong> The complexity hierarchy extends the automata hierarchy: regular languages (finite automata) \\(\\subset\\) context-free languages (pushdown automata) \\(\\subset\\) decidable languages (Turing machines).</li>
</ul>

<h3>What We Know and Don't Know</h3>

<div class="env-block theorem">
    <div class="env-title">Summary of Known Results</div>
    <div class="env-body">
        <p><strong>Proven:</strong></p>
        <ul>
            <li>P \\(\\subseteq\\) NP \\(\\subseteq\\) PSPACE \\(\\subseteq\\) EXPTIME</li>
            <li>P \\(\\neq\\) EXPTIME (time hierarchy theorem)</li>
            <li>The Halting Problem is undecidable (Turing, 1936)</li>
            <li>SAT is NP-complete (Cook-Levin, 1971)</li>
            <li>Thousands of natural problems are NP-complete</li>
        </ul>
        <p><strong>Open (as of 2026):</strong></p>
        <ul>
            <li>P vs NP (the central question)</li>
            <li>NP vs co-NP</li>
            <li>P vs PSPACE</li>
            <li>NP vs PSPACE</li>
            <li>Is factoring NP-complete? Is it in P?</li>
        </ul>
    </div>
</div>

<h3>Practical Implications</h3>

<p>Even though we cannot prove P &ne; NP, the theory has enormous practical value:</p>
<ul>
    <li><strong>When you encounter an NP-complete problem,</strong> stop looking for an exact polynomial-time algorithm. Instead, use approximation algorithms, heuristics, or special-case solutions.</li>
    <li><strong>Reductions are a design tool:</strong> if you can reduce your problem to a well-studied one, you inherit decades of algorithmic research.</li>
    <li><strong>Average-case vs worst-case:</strong> SAT solvers work remarkably well in practice despite worst-case exponential time, because real-world instances have structure that solvers exploit.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Unreasonable Effectiveness of NP-Completeness</div>
    <div class="env-body">
        <p>Since Karp's 21 problems in 1972, thousands of problems from scheduling, biology, physics, economics, and pure mathematics have been shown NP-complete. The fact that such diverse problems are all computationally equivalent (under polynomial reductions) is one of the most striking phenomena in mathematics. It suggests that there is a deep, natural boundary between "easy" and "hard" computation.</p>
    </div>
</div>

<h3>Where to Go from Here</h3>

<p>This course has given you the mathematical foundations. Here are some directions for further study:</p>
<ul>
    <li><strong>Algorithms:</strong> The design and analysis of efficient algorithms (Cormen et al., <em>Introduction to Algorithms</em>).</li>
    <li><strong>Complexity Theory:</strong> Deeper study of complexity classes, circuit complexity, and communication complexity (Arora &amp; Barak, <em>Computational Complexity: A Modern Approach</em>).</li>
    <li><strong>Cryptography:</strong> The interplay between hardness assumptions and security (Katz &amp; Lindell, <em>Introduction to Modern Cryptography</em>).</li>
    <li><strong>Quantum Computing:</strong> Shor's algorithm factors integers in polynomial time on a quantum computer. Does this break the P vs NP picture? (Not exactly, since quantum computers define a different class, BQP.)</li>
</ul>

<p>The story of computation is the story of what mathematics can and cannot do. Every proof technique, every combinatorial identity, every graph algorithm you have learned is a piece of this larger picture. The P vs NP question remains open, waiting for the next great idea.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Explain, in your own words and in 2-3 paragraphs, why the P vs NP question matters beyond computer science. Give at least two concrete examples from other fields.',
                    hint: 'Think about cryptography, optimization in industry, drug discovery, and mathematical proof.',
                    solution: 'This is an essay question. A strong answer should discuss: (1) <strong>Cryptography</strong>: If P = NP, then RSA and all public-key cryptography would be broken, undermining internet security, banking, and national defense. (2) <strong>Drug discovery</strong>: Protein folding (predicting 3D structure from amino acid sequence) involves NP-hard optimization. A polynomial-time algorithm would accelerate pharmaceutical research. (3) <strong>Mathematical proof</strong>: Determining whether a mathematical statement has a proof of length at most \\(n\\) is NP-complete. If P = NP, proofs could be found mechanically, fundamentally changing the nature of mathematics. (4) <strong>Operations research</strong>: Scheduling, routing (traveling salesman), and resource allocation problems are NP-hard. Airlines, logistics companies, and manufacturers would benefit enormously from exact polynomial-time solutions.'
                }
            ]
        }
    ]
});
