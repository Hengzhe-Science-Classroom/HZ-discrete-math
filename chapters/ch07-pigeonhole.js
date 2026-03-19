window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch07',
    number: 7,
    title: 'Pigeonhole & Inclusion-Exclusion',
    subtitle: 'When counting gets clever',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Motivation</h2>

<div class="env-block intuition">
    <div class="env-title">A Simple Observation with Deep Consequences</div>
    <div class="env-body">
        <p>If 13 people are in a room, at least two share a birth month. This is obvious when you think about it: 13 people, 12 months, so some month must be "used" twice. But this trivial-sounding fact is the engine behind some of the most elegant arguments in combinatorics.</p>
    </div>
</div>

<p>In the previous chapter we developed the basic counting toolkit: multiplication rule, addition rule, permutations, and combinations. Those tools answer "how many?" by building counts from scratch. This chapter introduces two techniques that answer a different style of question:</p>

<ol>
    <li><strong>The Pigeonhole Principle:</strong> guaranteeing that something <em>must</em> exist, even when we cannot point to it explicitly. It proves existence without construction.</li>
    <li><strong>Inclusion-Exclusion:</strong> counting elements in overlapping sets by systematically correcting for overcounting. It generalizes the addition rule to non-disjoint unions.</li>
</ol>

<p>Together, these two ideas represent a shift from direct enumeration to <em>structural reasoning</em> about counting. The pigeonhole principle leverages the simple fact that you cannot distribute more objects than containers without doubling up. Inclusion-exclusion leverages the algebra of set intersections.</p>

<h3>What to Expect</h3>

<p>We will build from the basic pigeonhole principle through its generalized form, explore applications including the birthday problem and Ramsey theory, develop the full inclusion-exclusion formula, and apply it to count derangements and compute Euler's totient function.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The pigeonhole principle is attributed to Dirichlet (1834), who called it the <em>Schubfachprinzip</em> (drawer principle). Despite its simplicity, it remains one of the most useful tools in combinatorics, number theory, and computer science. Inclusion-exclusion traces back to Abraham de Moivre (1718) and has been refined by many mathematicians since.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: The Pigeonhole Principle
        // ================================================================
        {
            id: 'sec-pigeonhole',
            title: 'The Pigeonhole Principle',
            content: `
<h2>The Pigeonhole Principle</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Pigeonhole Principle, Basic Form)</div>
    <div class="env-body">
        <p>If \\(n\\) objects are placed into \\(k\\) containers and \\(n > k\\), then at least one container holds more than one object.</p>
    </div>
</div>

<p>The proof is by contradiction: if every container held at most one object, there would be at most \\(k\\) objects total, contradicting \\(n > k\\).</p>

<div class="viz-placeholder" data-viz="viz-pigeonhole"></div>

<div class="env-block example">
    <div class="env-title">Example: Socks in the Dark</div>
    <div class="env-body">
        <p>A drawer contains red, blue, and green socks. How many socks must you pull out (in the dark) to guarantee a matching pair?</p>
        <p>With 3 colors (containers) and needing 2 of the same (more than 1 per container), you need \\(3 + 1 = 4\\) socks. The first 3 could all be different; the 4th must match one.</p>
    </div>
</div>

<h3>The Generalized Pigeonhole Principle</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.1 (Generalized Pigeonhole Principle)</div>
    <div class="env-body">
        <p>If \\(n\\) objects are placed into \\(k\\) containers, then at least one container holds at least \\(\\lceil n/k \\rceil\\) objects.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Suppose every container holds fewer than \\(\\lceil n/k \\rceil\\) objects, i.e., at most \\(\\lceil n/k \\rceil - 1\\). Then the total number of objects is at most \\(k(\\lceil n/k \\rceil - 1) < k \\cdot n/k = n\\), a contradiction. \\(\\square\\)</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Divisibility</div>
    <div class="env-body">
        <p>Among any 5 integers, at least two have the same remainder when divided by 4.</p>
        <p>There are only 4 possible remainders (0, 1, 2, 3). With 5 integers and 4 containers, the pigeonhole principle gives \\(\\lceil 5/4 \\rceil = 2\\), so at least one remainder class has at least 2 integers. Their difference is divisible by 4.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Lattice Points</div>
    <div class="env-body">
        <p>Given 5 lattice points (points with integer coordinates) in the plane, at least two of them have a midpoint that is also a lattice point.</p>
        <p>Each coordinate is either even or odd. So each point has a parity pair \\((\\text{even/odd}, \\text{even/odd})\\), giving 4 possibilities: (E,E), (E,O), (O,E), (O,O). With 5 points and 4 parity classes, at least two share the same parity pair. Their midpoint \\(\\bigl(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\bigr)\\) has integer coordinates since each sum is even.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-pigeonhole',
                    title: 'Pigeonhole Principle: Pigeons into Holes',
                    description: 'Watch pigeons fly into holes. When there are more pigeons than holes, at least one hole must hold multiple pigeons. Adjust the counts and press Animate to see it in action.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nPigeons = 6;
                        var nHoles = 4;
                        var animProgress = 1;
                        var animating = false;
                        var assignment = [];

                        VizEngine.createSlider(controls, 'Pigeons', 2, 12, nPigeons, 1, function(v) {
                            nPigeons = Math.round(v);
                            animProgress = 1;
                            assign();
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Holes', 2, 8, nHoles, 1, function(v) {
                            nHoles = Math.round(v);
                            animProgress = 1;
                            assign();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animProgress = 0;
                            assign();
                            var step = 0;
                            function tick() {
                                step++;
                                animProgress = Math.min(step / nPigeons, 1);
                                draw();
                                if (animProgress < 1) setTimeout(tick, 400);
                                else animating = false;
                            }
                            tick();
                        });

                        function assign() {
                            assignment = [];
                            var counts = [];
                            for (var i = 0; i < nHoles; i++) counts.push(0);
                            for (var p = 0; p < nPigeons; p++) {
                                var best = 0;
                                for (var h = 1; h < nHoles; h++) {
                                    if (counts[h] < counts[best]) best = h;
                                }
                                assignment.push(best);
                                counts[best]++;
                            }
                        }
                        assign();

                        var pigeonColors = [
                            viz.colors.blue, viz.colors.teal, viz.colors.orange,
                            viz.colors.purple, viz.colors.green, viz.colors.red,
                            viz.colors.yellow, viz.colors.pink, viz.colors.blue,
                            viz.colors.teal, viz.colors.orange, viz.colors.purple
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            viz.screenText('Pigeonhole Principle', W / 2, 20, viz.colors.white, 15);

                            // Draw holes at bottom
                            var holeW = Math.min(60, (W - 40) / nHoles - 8);
                            var holeH = 50;
                            var holesY = H - 60;
                            var holesStartX = (W - nHoles * (holeW + 8)) / 2;

                            // Count pigeons per hole
                            var holeCounts = [];
                            for (var i = 0; i < nHoles; i++) holeCounts.push(0);

                            var shown = Math.floor(animProgress * nPigeons);

                            for (var p = 0; p < shown; p++) {
                                holeCounts[assignment[p]]++;
                            }

                            // Draw boxes
                            var maxInHole = 0;
                            for (var h = 0; h < nHoles; h++) {
                                if (holeCounts[h] > maxInHole) maxInHole = holeCounts[h];
                                var hx = holesStartX + h * (holeW + 8);
                                var isOverflow = holeCounts[h] > 1;
                                ctx.strokeStyle = isOverflow ? viz.colors.red : viz.colors.axis;
                                ctx.lineWidth = isOverflow ? 2.5 : 1.5;
                                // Draw U-shaped hole
                                ctx.beginPath();
                                ctx.moveTo(hx, holesY - holeH);
                                ctx.lineTo(hx, holesY);
                                ctx.lineTo(hx + holeW, holesY);
                                ctx.lineTo(hx + holeW, holesY - holeH);
                                ctx.stroke();
                                // Label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Hole ' + (h + 1), hx + holeW / 2, holesY + 14);
                            }

                            // Draw pigeons: waiting at top row, then placed in holes
                            var pigeonR = Math.min(14, holeW / 3);
                            var waitY = 55;

                            // Pigeons not yet placed
                            for (var p2 = shown; p2 < nPigeons; p2++) {
                                var wx = 30 + (p2 - shown) * (pigeonR * 2 + 6);
                                ctx.fillStyle = pigeonColors[p2 % pigeonColors.length];
                                ctx.beginPath();
                                ctx.arc(wx + pigeonR, waitY, pigeonR, 0, Math.PI * 2);
                                ctx.fill();
                                // Eye
                                ctx.fillStyle = '#000';
                                ctx.beginPath();
                                ctx.arc(wx + pigeonR + 3, waitY - 3, 2, 0, Math.PI * 2);
                                ctx.fill();
                                // Beak
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.beginPath();
                                ctx.moveTo(wx + pigeonR + pigeonR * 0.7, waitY);
                                ctx.lineTo(wx + pigeonR + pigeonR + 4, waitY + 2);
                                ctx.lineTo(wx + pigeonR + pigeonR * 0.7, waitY + 4);
                                ctx.closePath();
                                ctx.fill();
                            }

                            // Pigeons placed in holes
                            var perHole = [];
                            for (var i2 = 0; i2 < nHoles; i2++) perHole.push(0);
                            for (var p3 = 0; p3 < shown; p3++) {
                                var holeIdx = assignment[p3];
                                var stack = perHole[holeIdx];
                                perHole[holeIdx]++;
                                var hx2 = holesStartX + holeIdx * (holeW + 8);
                                var py = holesY - 10 - stack * (pigeonR * 2 + 2) - pigeonR;
                                var px = hx2 + holeW / 2;
                                ctx.fillStyle = pigeonColors[p3 % pigeonColors.length];
                                ctx.beginPath();
                                ctx.arc(px, py, pigeonR, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = '#000';
                                ctx.beginPath();
                                ctx.arc(px + 3, py - 3, 2, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.beginPath();
                                ctx.moveTo(px + pigeonR * 0.7, py);
                                ctx.lineTo(px + pigeonR + 4, py + 2);
                                ctx.lineTo(px + pigeonR * 0.7, py + 4);
                                ctx.closePath();
                                ctx.fill();
                            }

                            // Status text
                            var statusText = nPigeons + ' pigeons, ' + nHoles + ' holes';
                            if (nPigeons > nHoles) {
                                statusText += '  =>  at least one hole has >= ' + Math.ceil(nPigeons / nHoles) + ' pigeons';
                            }
                            viz.screenText(statusText, W / 2, H - 20, nPigeons > nHoles ? viz.colors.red : viz.colors.teal, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A drawer has 10 red socks, 10 blue socks, and 10 green socks. What is the minimum number of socks you must draw to guarantee at least 4 of the same color?',
                    hint: 'Use the generalized pigeonhole principle with \\(k = 3\\) colors. You need \\(\\lceil n/3 \\rceil \\ge 4\\).',
                    solution: 'By the generalized pigeonhole principle, with 3 colors and \\(n\\) draws, at least one color appears \\(\\lceil n/3 \\rceil\\) times. We need \\(\\lceil n/3 \\rceil \\ge 4\\), so \\(n \\ge 10\\). But \\(n = 9\\) gives \\(\\lceil 9/3 \\rceil = 3\\), which is not enough. With \\(n = 10\\), \\(\\lceil 10/3 \\rceil = 4\\). Answer: \\(\\boxed{10}\\).'
                },
                {
                    question: 'Show that among any 6 people, either 3 mutually know each other, or 3 mutually do not know each other.',
                    hint: 'Pick one person. They have 5 relationships. By pigeonhole, at least 3 are of the same type. Then examine those 3.',
                    solution: 'Pick person \\(A\\). Of the other 5, at least \\(\\lceil 5/2 \\rceil = 3\\) are either all friends or all strangers to \\(A\\). Say \\(B, C, D\\) are all friends of \\(A\\). If any pair among \\(B, C, D\\) are friends, that pair with \\(A\\) forms a mutual-friends triple. If none are friends, then \\(B, C, D\\) are mutual strangers. Either way we are done. This proves \\(R(3,3) \\le 6\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Applications
        // ================================================================
        {
            id: 'sec-applications',
            title: 'Applications',
            content: `
<h2>Applications of the Pigeonhole Principle</h2>

<h3>The Birthday Problem</h3>

<div class="env-block intuition">
    <div class="env-title">The Birthday Paradox</div>
    <div class="env-body">
        <p>How many people must be in a room before there is a 50% chance that two share a birthday? Most people guess around 183 (half of 365). The actual answer is just 23, a striking illustration of how our intuitions about coincidences fail.</p>
    </div>
</div>

<p>The pigeonhole principle guarantees a shared birthday with 366 people (for 365 days). But probability asks: how likely is a match with fewer people?</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.2 (Birthday Problem)</div>
    <div class="env-body">
        <p>The probability that all \\(n\\) people in a room have distinct birthdays (assuming 365 equally likely days) is</p>
        \\[P(\\text{all distinct}) = \\frac{365}{365} \\cdot \\frac{364}{365} \\cdot \\frac{363}{365} \\cdots \\frac{365 - n + 1}{365} = \\prod_{i=0}^{n-1} \\frac{365 - i}{365}.\\]
        <p>The probability of at least one shared birthday is \\(1 - P(\\text{all distinct})\\).</p>
    </div>
</div>

<p>At \\(n = 23\\), this probability crosses 50%. At \\(n = 50\\) it exceeds 97%. At \\(n = 70\\) it is 99.9%.</p>

<div class="viz-placeholder" data-viz="viz-birthday-problem"></div>

<h3>Ramsey Numbers</h3>

<p>The Ramsey number \\(R(s, t)\\) is the smallest \\(n\\) such that every 2-coloring of the edges of the complete graph \\(K_n\\) contains either a red \\(K_s\\) or a blue \\(K_t\\). We showed above that \\(R(3,3) \\le 6\\). In fact \\(R(3,3) = 6\\) exactly, since \\(K_5\\) can be 2-colored with no monochromatic triangle (the cycle \\(C_5\\) in one color, its complement in the other).</p>

<div class="viz-placeholder" data-viz="viz-ramsey"></div>

<div class="env-block remark">
    <div class="env-title">Why Ramsey Theory is Hard</div>
    <div class="env-body">
        <p>Erdos famously said: "Suppose aliens invade the earth and threaten to obliterate it in a year's time unless human beings can find \\(R(5,5)\\). In that case, we should marshal all our computers and mathematicians and attempt to find the value. But suppose, instead, that they ask for \\(R(6,6)\\). In that case, we should attempt to destroy the aliens." Currently, we know only that \\(43 \\le R(5,5) \\le 48\\).</p>
    </div>
</div>

<h3>Lattice Points and the Midpoint Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.3 (Midpoint Theorem)</div>
    <div class="env-body">
        <p>Among any 5 lattice points in \\(\\mathbb{Z}^2\\), at least two have a midpoint with integer coordinates.</p>
    </div>
</div>

<p>This follows from the pigeonhole argument given above: 5 points, 4 parity classes. The generalization to \\(\\mathbb{Z}^d\\) requires \\(2^d + 1\\) points.</p>
`,
            visualizations: [
                {
                    id: 'viz-birthday-problem',
                    title: 'The Birthday Problem',
                    description: 'The probability of a shared birthday as people are added to the room. Watch it cross 50% at just 23 people.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 330, scale: 1
                        });

                        var maxN = 70;
                        var currentN = 0;
                        var animating = false;

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            currentN = 0;
                            function tick() {
                                currentN++;
                                draw();
                                if (currentN < maxN) setTimeout(tick, 60);
                                else animating = false;
                            }
                            tick();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            currentN = 0;
                            draw();
                        });

                        function birthdayProb(n) {
                            var p = 1;
                            for (var i = 0; i < n; i++) p *= (365 - i) / 365;
                            return 1 - p;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            viz.screenText('Birthday Problem: P(shared birthday)', W / 2, 18, viz.colors.white, 14);

                            // Chart area
                            var left = 60, right = W - 30, top = 40, bottom = 330;
                            var cw = right - left, ch = bottom - top;

                            // Grid
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var p = 0; p <= 100; p += 25) {
                                var yy = bottom - (p / 100) * ch;
                                ctx.beginPath(); ctx.moveTo(left, yy); ctx.lineTo(right, yy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(p + '%', left - 6, yy);
                            }
                            for (var n = 0; n <= maxN; n += 10) {
                                var xx = left + (n / maxN) * cw;
                                ctx.beginPath(); ctx.moveTo(xx, top); ctx.lineTo(xx, bottom); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(n, xx, bottom + 4);
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();

                            // Label
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Number of people', (left + right) / 2, bottom + 22);

                            // 50% line
                            var y50 = bottom - 0.5 * ch;
                            ctx.strokeStyle = viz.colors.red + '66';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(left, y50); ctx.lineTo(right, y50); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.red;
                            ctx.textAlign = 'left';
                            ctx.fillText('50%', right + 2, y50);

                            // Full curve (faded)
                            ctx.strokeStyle = viz.colors.blue + '33';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 1; i <= maxN; i++) {
                                var px = left + (i / maxN) * cw;
                                var py = bottom - birthdayProb(i) * ch;
                                if (i === 1) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Animated portion
                            if (currentN > 0) {
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                for (var j = 1; j <= currentN; j++) {
                                    var px2 = left + (j / maxN) * cw;
                                    var py2 = bottom - birthdayProb(j) * ch;
                                    if (j === 1) ctx.moveTo(px2, py2);
                                    else ctx.lineTo(px2, py2);
                                }
                                ctx.stroke();

                                // Current point
                                var cx = left + (currentN / maxN) * cw;
                                var cy = bottom - birthdayProb(currentN) * ch;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(cx, cy, 5, 0, Math.PI * 2);
                                ctx.fill();

                                // Label current
                                var prob = birthdayProb(currentN);
                                viz.screenText(
                                    'n = ' + currentN + ': P = ' + (prob * 100).toFixed(1) + '%',
                                    W / 2, H - 15, viz.colors.white, 13
                                );
                            }

                            // Mark n=23
                            var x23 = left + (23 / maxN) * cw;
                            ctx.strokeStyle = viz.colors.teal + '88';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath(); ctx.moveTo(x23, top); ctx.lineTo(x23, bottom); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('n=23', x23, top - 6);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-ramsey',
                    title: 'R(3,3) = 6: Coloring Edges of K\u2086',
                    description: 'Every 2-coloring of the edges of K\u2086 contains a monochromatic triangle. Click "Random Coloring" to try different colorings; the highlighted triangle shows the monochromatic one that must exist.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 6;
                        var edgeColors = {};
                        var monoTriangle = null;

                        function edgeKey(i, j) { return Math.min(i,j) + '-' + Math.max(i,j); }

                        function randomColoring() {
                            edgeColors = {};
                            for (var i = 0; i < n; i++)
                                for (var j = i + 1; j < n; j++)
                                    edgeColors[edgeKey(i,j)] = Math.random() < 0.5 ? 'red' : 'blue';
                            findMonoTriangle();
                            draw();
                        }

                        function findMonoTriangle() {
                            monoTriangle = null;
                            for (var a = 0; a < n; a++) {
                                for (var b = a+1; b < n; b++) {
                                    for (var c = b+1; c < n; c++) {
                                        var c1 = edgeColors[edgeKey(a,b)];
                                        var c2 = edgeColors[edgeKey(a,c)];
                                        var c3 = edgeColors[edgeKey(b,c)];
                                        if (c1 === c2 && c2 === c3) {
                                            monoTriangle = {verts: [a,b,c], color: c1};
                                            return;
                                        }
                                    }
                                }
                            }
                        }

                        VizEngine.createButton(controls, 'Random Coloring', randomColoring);

                        function vertexPos(i) {
                            var cx = viz.width / 2, cy = viz.height / 2;
                            var r = 140;
                            var angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
                            return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('R(3,3) = 6: Every 2-coloring of K\u2086 has a monochromatic triangle',
                                viz.width / 2, 18, viz.colors.white, 12);

                            // Draw edges
                            for (var i = 0; i < n; i++) {
                                for (var j = i+1; j < n; j++) {
                                    var p1 = vertexPos(i), p2 = vertexPos(j);
                                    var col = edgeColors[edgeKey(i,j)];
                                    var isTriEdge = monoTriangle &&
                                        monoTriangle.verts.indexOf(i) >= 0 &&
                                        monoTriangle.verts.indexOf(j) >= 0;
                                    ctx.strokeStyle = col === 'red' ? viz.colors.red : viz.colors.blue;
                                    ctx.lineWidth = isTriEdge ? 4 : 1.5;
                                    ctx.globalAlpha = isTriEdge ? 1 : 0.5;
                                    ctx.beginPath();
                                    ctx.moveTo(p1[0], p1[1]);
                                    ctx.lineTo(p2[0], p2[1]);
                                    ctx.stroke();
                                    ctx.globalAlpha = 1;
                                }
                            }

                            // Highlight monochromatic triangle
                            if (monoTriangle) {
                                var vt = monoTriangle.verts;
                                var triColor = monoTriangle.color === 'red' ? viz.colors.red : viz.colors.blue;
                                ctx.fillStyle = triColor + '22';
                                ctx.beginPath();
                                var pp0 = vertexPos(vt[0]);
                                ctx.moveTo(pp0[0], pp0[1]);
                                for (var t = 1; t < 3; t++) {
                                    var pp = vertexPos(vt[t]);
                                    ctx.lineTo(pp[0], pp[1]);
                                }
                                ctx.closePath();
                                ctx.fill();
                            }

                            // Draw vertices
                            for (var v = 0; v < n; v++) {
                                var pos = vertexPos(v);
                                var isTri = monoTriangle && monoTriangle.verts.indexOf(v) >= 0;
                                ctx.fillStyle = isTri ? viz.colors.white : viz.colors.text;
                                ctx.beginPath();
                                ctx.arc(pos[0], pos[1], isTri ? 8 : 6, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                var labelAngle = -Math.PI / 2 + (2 * Math.PI * v) / n;
                                ctx.fillText('v' + (v+1),
                                    pos[0] + 20 * Math.cos(labelAngle),
                                    pos[1] + 20 * Math.sin(labelAngle));
                            }

                            // Status
                            if (monoTriangle) {
                                var label = monoTriangle.color.charAt(0).toUpperCase() + monoTriangle.color.slice(1);
                                viz.screenText(
                                    label + ' triangle: {v' + (monoTriangle.verts[0]+1) +
                                    ', v' + (monoTriangle.verts[1]+1) +
                                    ', v' + (monoTriangle.verts[2]+1) + '}',
                                    viz.width / 2, viz.height - 20,
                                    monoTriangle.color === 'red' ? viz.colors.red : viz.colors.blue, 13);
                            }
                        }

                        randomColoring();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a group of 25 people, at least how many were born in the same month?',
                    hint: 'Apply the generalized pigeonhole principle with 12 months.',
                    solution: 'By the generalized pigeonhole principle, \\(\\lceil 25/12 \\rceil = 3\\). At least 3 people share a birth month.'
                },
                {
                    question: 'How many people must be in a room so the probability of a shared birthday exceeds 99%?',
                    hint: 'Compute \\(1 - \\prod_{i=0}^{n-1} \\frac{365-i}{365}\\) for increasing \\(n\\).',
                    solution: 'At \\(n = 57\\), the probability of a shared birthday is approximately 99.01%. So \\(\\boxed{57}\\) people suffice.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Inclusion-Exclusion
        // ================================================================
        {
            id: 'sec-inclusion-exclusion',
            title: 'Inclusion-Exclusion',
            content: `
<h2>The Inclusion-Exclusion Principle</h2>

<div class="env-block intuition">
    <div class="env-title">The Overcounting Problem</div>
    <div class="env-body">
        <p>How many students study French or Spanish, if 30 study French, 20 study Spanish, and 10 study both? If you add \\(30 + 20 = 50\\), you have counted the 10 bilingual students twice. The correct count is \\(30 + 20 - 10 = 40\\). This is inclusion-exclusion at its simplest.</p>
    </div>
</div>

<h3>Two Sets</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.4 (Inclusion-Exclusion, Two Sets)</div>
    <div class="env-body">
        <p>For finite sets \\(A\\) and \\(B\\),</p>
        \\[|A \\cup B| = |A| + |B| - |A \\cap B|.\\]
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-inclusion-exclusion-2"></div>

<h3>Three Sets</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.5 (Inclusion-Exclusion, Three Sets)</div>
    <div class="env-body">
        <p>For finite sets \\(A\\), \\(B\\), and \\(C\\),</p>
        \\[|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|.\\]
    </div>
</div>

<p>The pattern: add singles, subtract pairs, add triples. Each correction fixes the over- or under-counting of the previous step.</p>

<div class="viz-placeholder" data-viz="viz-inclusion-exclusion-3"></div>

<h3>The General Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.6 (Inclusion-Exclusion, General)</div>
    <div class="env-body">
        <p>For finite sets \\(A_1, A_2, \\ldots, A_n\\),</p>
        \\[\\left|\\bigcup_{i=1}^{n} A_i\\right| = \\sum_{k=1}^{n} (-1)^{k+1} \\sum_{1 \\le i_1 < \\cdots < i_k \\le n} |A_{i_1} \\cap \\cdots \\cap A_{i_k}|.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>Consider an element \\(x\\) that belongs to exactly \\(m\\) of the sets. It is counted \\(\\binom{m}{1}\\) times in the singles sum, subtracted \\(\\binom{m}{2}\\) times in the pairs sum, added \\(\\binom{m}{3}\\) times, and so on. Its net contribution is</p>
        \\[\\sum_{k=1}^{m} (-1)^{k+1} \\binom{m}{k} = 1 - \\sum_{k=0}^{m} (-1)^{k} \\binom{m}{k} = 1 - (1-1)^m = 1.\\]
        <p>So each element in the union is counted exactly once. \\(\\square\\)</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Integers Divisible by 2, 3, or 5</div>
    <div class="env-body">
        <p>How many integers from 1 to 100 are divisible by 2, 3, or 5?</p>
        <p>Let \\(A_2, A_3, A_5\\) be the sets of multiples. Using \\(|A_d| = \\lfloor 100/d \\rfloor\\):</p>
        \\[|A_2 \\cup A_3 \\cup A_5| = 50 + 33 + 20 - 16 - 10 - 6 + 3 = 74.\\]
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-inclusion-exclusion-2',
                    title: 'Inclusion-Exclusion with Two Sets',
                    description: 'See how adding |A| + |B| overcounts the intersection. The correction subtracts |A \\(\\cap\\) B| to get the right answer. Drag the sliders to change set sizes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var sizeA = 30, sizeB = 20, sizeAB = 10;

                        VizEngine.createSlider(controls, '|A|', 5, 50, sizeA, 1, function(v) {
                            sizeA = Math.round(v);
                            if (sizeAB > Math.min(sizeA, sizeB)) sizeAB = Math.min(sizeA, sizeB);
                            draw();
                        });
                        VizEngine.createSlider(controls, '|B|', 5, 50, sizeB, 1, function(v) {
                            sizeB = Math.round(v);
                            if (sizeAB > Math.min(sizeA, sizeB)) sizeAB = Math.min(sizeA, sizeB);
                            draw();
                        });
                        VizEngine.createSlider(controls, '|A\u2229B|', 0, 30, sizeAB, 1, function(v) {
                            sizeAB = Math.min(Math.round(v), Math.min(sizeA, sizeB));
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var cx = W / 2, cy = H / 2 + 10;
                            var r = 90;
                            var sep = 55;

                            // Draw circles
                            // A (left)
                            ctx.beginPath();
                            ctx.arc(cx - sep, cy, r, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.fill();
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            // B (right)
                            ctx.beginPath();
                            ctx.arc(cx + sep, cy, r, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.teal + '22';
                            ctx.fill();
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            // Intersection highlight
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(cx - sep, cy, r, 0, Math.PI * 2);
                            ctx.clip();
                            ctx.beginPath();
                            ctx.arc(cx + sep, cy, r, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.orange + '44';
                            ctx.fill();
                            ctx.restore();

                            // Labels
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('A', cx - sep - r/2, cy - r - 8);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('B', cx + sep + r/2, cy - r - 8);

                            // Numbers inside regions
                            var onlyA = sizeA - sizeAB;
                            var onlyB = sizeB - sizeAB;

                            ctx.font = 'bold 18px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText(onlyA, cx - sep - 30, cy);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText(sizeAB, cx, cy);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText(onlyB, cx + sep + 30, cy);

                            // Formula
                            var union = sizeA + sizeB - sizeAB;
                            viz.screenText(
                                '|A \u222A B| = |A| + |B| - |A \u2229 B| = ' + sizeA + ' + ' + sizeB + ' - ' + sizeAB + ' = ' + union,
                                W / 2, H - 20, viz.colors.white, 13
                            );
                            viz.screenText('|A \u222A B| = ' + union, W / 2, 18, viz.colors.white, 15);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-inclusion-exclusion-3',
                    title: 'Inclusion-Exclusion with Three Sets',
                    description: 'Animated: add singles, subtract pairwise intersections, add back the triple intersection. Watch each step fix the count.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var step = 0;
                        var maxStep = 3;
                        var animating = false;

                        VizEngine.createButton(controls, 'Step Through', function() {
                            step = (step + 1) % (maxStep + 1);
                            draw();
                        });
                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            step = 0;
                            draw();
                            function tick() {
                                step++;
                                draw();
                                if (step < maxStep) setTimeout(tick, 1200);
                                else animating = false;
                            }
                            setTimeout(tick, 1200);
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0; draw();
                        });

                        // Fixed set sizes for illustration
                        var counts = {
                            A: 30, B: 25, C: 20,
                            AB: 8, AC: 6, BC: 5,
                            ABC: 2
                        };

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var cx = W / 2, cy = H / 2 + 10;
                            var r = 80;

                            // Three circle positions (equilateral triangle arrangement)
                            var off = 40;
                            var centers = [
                                [cx, cy - off - 10],
                                [cx - off * 1.2, cy + off * 0.6],
                                [cx + off * 1.2, cy + off * 0.6]
                            ];
                            var setColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange];
                            var setNames = ['A', 'B', 'C'];

                            // Draw circles
                            for (var i = 0; i < 3; i++) {
                                ctx.beginPath();
                                ctx.arc(centers[i][0], centers[i][1], r, 0, Math.PI * 2);
                                ctx.fillStyle = setColors[i] + '18';
                                ctx.fill();
                                ctx.strokeStyle = setColors[i];
                                ctx.lineWidth = 2;
                                ctx.stroke();
                            }

                            // Labels
                            var labelOff = r + 14;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var j = 0; j < 3; j++) {
                                var angle = -Math.PI / 2 + (2 * Math.PI * j) / 3;
                                ctx.fillStyle = setColors[j];
                                ctx.fillText(setNames[j] + '=' + [counts.A, counts.B, counts.C][j],
                                    centers[j][0] + labelOff * Math.cos(angle) * 0.4,
                                    centers[j][1] + labelOff * Math.sin(angle) * 0.5 - 10);
                            }

                            // Step logic
                            var total = 0;
                            var desc = '';

                            if (step >= 0) {
                                // Add singles
                                total = counts.A + counts.B + counts.C;
                                desc = '+|A|+|B|+|C| = ' + total;
                            }
                            if (step >= 1) {
                                // Subtract pairs
                                total -= counts.AB + counts.AC + counts.BC;
                                desc = '+' + counts.A + '+' + counts.B + '+' + counts.C +
                                       ' - ' + counts.AB + ' - ' + counts.AC + ' - ' + counts.BC + ' = ' + total;
                            }
                            if (step >= 2) {
                                // Add triple
                                total += counts.ABC;
                                desc = '+' + counts.A + '+' + counts.B + '+' + counts.C +
                                       ' - ' + counts.AB + ' - ' + counts.AC + ' - ' + counts.BC +
                                       ' + ' + counts.ABC + ' = ' + total;
                            }
                            if (step >= 3) {
                                desc = '|A\u222AB\u222AC| = ' + total + '  (final)';
                            }

                            var steps = [
                                'Step 1: Add individual sets',
                                'Step 2: Subtract pairwise intersections',
                                'Step 3: Add back triple intersection',
                                'Done! Each element counted exactly once.'
                            ];

                            viz.screenText(steps[Math.min(step, 3)], W / 2, 18, viz.colors.white, 13);

                            // Highlight current operation regions
                            if (step === 0) {
                                for (var s = 0; s < 3; s++) {
                                    ctx.beginPath();
                                    ctx.arc(centers[s][0], centers[s][1], r, 0, Math.PI * 2);
                                    ctx.fillStyle = setColors[s] + '33';
                                    ctx.fill();
                                }
                            } else if (step === 1) {
                                // Highlight intersections in red
                                for (var a = 0; a < 3; a++) {
                                    for (var b = a+1; b < 3; b++) {
                                        ctx.save();
                                        ctx.beginPath();
                                        ctx.arc(centers[a][0], centers[a][1], r, 0, Math.PI * 2);
                                        ctx.clip();
                                        ctx.beginPath();
                                        ctx.arc(centers[b][0], centers[b][1], r, 0, Math.PI * 2);
                                        ctx.fillStyle = viz.colors.red + '44';
                                        ctx.fill();
                                        ctx.restore();
                                    }
                                }
                            } else if (step >= 2) {
                                // Highlight triple intersection
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(centers[0][0], centers[0][1], r, 0, Math.PI * 2);
                                ctx.clip();
                                ctx.beginPath();
                                ctx.arc(centers[1][0], centers[1][1], r, 0, Math.PI * 2);
                                ctx.clip();
                                ctx.beginPath();
                                ctx.arc(centers[2][0], centers[2][1], r, 0, Math.PI * 2);
                                ctx.fillStyle = viz.colors.green + '66';
                                ctx.fill();
                                ctx.restore();
                            }

                            viz.screenText(desc, W / 2, H - 20, viz.colors.teal, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many integers from 1 to 1000 are divisible by 3, 5, or 7?',
                    hint: 'Let \\(A_3, A_5, A_7\\) be sets of multiples. Compute \\(|A_d| = \\lfloor 1000/d \\rfloor\\) for each \\(d\\) and each pairwise/triple product.',
                    solution: '\\(|A_3| = 333\\), \\(|A_5| = 200\\), \\(|A_7| = 142\\). \\(|A_{15}| = 66\\), \\(|A_{21}| = 47\\), \\(|A_{35}| = 28\\). \\(|A_{105}| = 9\\). By I-E: \\(333 + 200 + 142 - 66 - 47 - 28 + 9 = 543\\).'
                },
                {
                    question: 'How many surjections (onto functions) are there from a 4-element set to a 3-element set?',
                    hint: 'Total functions minus those missing at least one element of the codomain. Use I-E where \\(A_i\\) = functions that miss element \\(i\\).',
                    solution: 'Total functions: \\(3^4 = 81\\). Missing at least one: \\(\\binom{3}{1} 2^4 - \\binom{3}{2} 1^4 + \\binom{3}{3} 0^4 = 48 - 3 + 0 = 45\\). Surjections: \\(81 - 45 = 36\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Derangements
        // ================================================================
        {
            id: 'sec-derangements',
            title: 'Derangements',
            content: `
<h2>Derangements: No Fixed Points</h2>

<div class="env-block intuition">
    <div class="env-title">The Hat Problem</div>
    <div class="env-body">
        <p>At a party, \\(n\\) people check their hats. A prankster returns the hats at random. A <strong>derangement</strong> is a permutation where nobody gets their own hat back. How many derangements are there?</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Derangement)</div>
    <div class="env-body">
        <p>A <strong>derangement</strong> of \\(\\{1, 2, \\ldots, n\\}\\) is a permutation \\(\\sigma\\) such that \\(\\sigma(i) \\neq i\\) for all \\(i\\). The number of derangements of \\(n\\) elements is denoted \\(D_n\\).</p>
    </div>
</div>

<h3>Counting Derangements via Inclusion-Exclusion</h3>

<p>Let \\(A_i\\) be the set of permutations that fix element \\(i\\). We want the number of permutations in none of the \\(A_i\\):</p>

\\[D_n = n! - |A_1 \\cup A_2 \\cup \\cdots \\cup A_n|.\\]

<p>By inclusion-exclusion:</p>

<ul>
    <li>\\(|A_i| = (n-1)!\\) (fix one element, permute the rest)</li>
    <li>\\(|A_i \\cap A_j| = (n-2)!\\) (fix two elements)</li>
    <li>In general, \\(|A_{i_1} \\cap \\cdots \\cap A_{i_k}| = (n-k)!\\)</li>
</ul>

<p>There are \\(\\binom{n}{k}\\) ways to choose which \\(k\\) elements are fixed, so:</p>

\\[|A_1 \\cup \\cdots \\cup A_n| = \\sum_{k=1}^{n} (-1)^{k+1} \\binom{n}{k}(n-k)! = \\sum_{k=1}^{n} (-1)^{k+1} \\frac{n!}{k!}.\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 7.7 (Derangement Formula)</div>
    <div class="env-body">
        <p>The number of derangements of \\(n\\) elements is</p>
        \\[D_n = n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!} = n! \\left(1 - 1 + \\frac{1}{2!} - \\frac{1}{3!} + \\cdots + \\frac{(-1)^n}{n!}\\right).\\]
        <p>As \\(n \\to \\infty\\), \\(D_n / n! \\to 1/e \\approx 0.3679\\). So roughly 36.8% of all permutations are derangements, regardless of \\(n\\) (for large \\(n\\)).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-derangements"></div>

<div class="env-block example">
    <div class="env-title">Example: Small Cases</div>
    <div class="env-body">
        <p>\\(D_1 = 0\\) (one person must get their own hat).</p>
        <p>\\(D_2 = 1\\): the only derangement of \\(\\{1,2\\}\\) is \\((2,1)\\).</p>
        <p>\\(D_3 = 2\\): the derangements of \\(\\{1,2,3\\}\\) are \\((2,3,1)\\) and \\((3,1,2)\\).</p>
        <p>\\(D_4 = 9\\), \\(D_5 = 44\\), \\(D_6 = 265\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Derangement Recurrence</div>
    <div class="env-body">
        <p>Derangements also satisfy the recurrence \\(D_n = (n-1)(D_{n-1} + D_{n-2})\\) with \\(D_0 = 1, D_1 = 0\\). The argument: element 1 goes to some position \\(k \\neq 1\\) (\\(n-1\\) choices). If \\(k\\) goes to position 1, the remaining \\(n-2\\) elements form a derangement (\\(D_{n-2}\\)). If \\(k\\) does not go to position 1, it is like a derangement of \\(n-1\\) elements (\\(D_{n-1}\\)).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-derangements',
                    title: 'Derangements: Permutations with No Fixed Points',
                    description: 'For small n, see all permutations color-coded: derangements (no element stays in place) are highlighted. Watch D_n/n! converge to 1/e.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 4;

                        VizEngine.createSlider(controls, 'n', 1, 6, n, 1, function(v) {
                            n = Math.round(v);
                            draw();
                        });

                        function permute(arr) {
                            if (arr.length <= 1) return [arr.slice()];
                            var result = [];
                            for (var i = 0; i < arr.length; i++) {
                                var rest = arr.slice(0, i).concat(arr.slice(i + 1));
                                var sub = permute(rest);
                                for (var j = 0; j < sub.length; j++) {
                                    result.push([arr[i]].concat(sub[j]));
                                }
                            }
                            return result;
                        }

                        function isDerangement(perm) {
                            for (var i = 0; i < perm.length; i++) {
                                if (perm[i] === i) return false;
                            }
                            return true;
                        }

                        function factorial(m) { var r = 1; for (var i = 2; i <= m; i++) r *= i; return r; }

                        function derangementCount(m) {
                            var sum = 0;
                            for (var k = 0; k <= m; k++) {
                                sum += (k % 2 === 0 ? 1 : -1) / factorial(k);
                            }
                            return Math.round(factorial(m) * sum);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            var arr = [];
                            for (var i = 0; i < n; i++) arr.push(i);
                            var perms = permute(arr);
                            var dn = derangementCount(n);

                            viz.screenText('Derangements of {1, ..., ' + n + '}', W / 2, 18, viz.colors.white, 14);
                            viz.screenText(
                                'D_' + n + ' = ' + dn + ' out of ' + n + '! = ' + factorial(n) +
                                '   (ratio = ' + (dn / factorial(n)).toFixed(4) + ', 1/e \u2248 0.3679)',
                                W / 2, 38, viz.colors.teal, 11
                            );

                            if (n <= 5) {
                                // Show all permutations in a grid
                                var cols = Math.min(Math.ceil(Math.sqrt(perms.length * 2)), 10);
                                var cellW = Math.min(70, (W - 20) / cols);
                                var cellH = 22;
                                var startX = (W - cols * cellW) / 2;
                                var startY = 60;

                                for (var p = 0; p < perms.length; p++) {
                                    var row = Math.floor(p / cols);
                                    var col = p % cols;
                                    var px = startX + col * cellW;
                                    var py = startY + row * cellH;

                                    var isDer = isDerangement(perms[p]);

                                    if (isDer) {
                                        ctx.fillStyle = viz.colors.teal + '33';
                                        ctx.fillRect(px - 2, py - 8, cellW - 4, cellH - 4);
                                    }

                                    var label = '(';
                                    for (var k = 0; k < perms[p].length; k++) {
                                        label += (perms[p][k] + 1);
                                        if (k < perms[p].length - 1) label += ',';
                                    }
                                    label += ')';

                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillStyle = isDer ? viz.colors.teal : viz.colors.text + '66';
                                    ctx.fillText(label, px, py);
                                }
                            } else {
                                // For n=6, just show the count and the ratio convergence
                                viz.screenText('Too many permutations to list (720). Showing convergence instead.', W / 2, 80, viz.colors.text, 11);
                            }

                            // Convergence chart at bottom
                            var chartTop = n <= 4 ? H - 120 : 110;
                            var chartBottom = H - 30;
                            var chartLeft = 60;
                            var chartRight = W - 30;
                            var ch = chartBottom - chartTop;
                            var cw = chartRight - chartLeft;

                            viz.screenText('D_n / n! vs 1/e', (chartLeft + chartRight) / 2, chartTop - 10, viz.colors.white, 11);

                            // 1/e line
                            var eInv = 1 / Math.E;
                            var eY = chartBottom - eInv * ch / 0.6;
                            ctx.strokeStyle = viz.colors.red + '66';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath(); ctx.moveTo(chartLeft, eY); ctx.lineTo(chartRight, eY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.red;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('1/e', chartRight + 2, eY);

                            // Plot D_k/k! for k=1..10
                            var maxK = 10;
                            for (var kk = 1; kk <= maxK; kk++) {
                                var ratio = derangementCount(kk) / factorial(kk);
                                var bx = chartLeft + ((kk - 1) / (maxK - 1)) * cw;
                                var by = chartBottom - ratio * ch / 0.6;
                                var isCurrent = (kk === n);
                                ctx.fillStyle = isCurrent ? viz.colors.teal : viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(bx, by, isCurrent ? 5 : 3, 0, Math.PI * 2);
                                ctx.fill();
                                if (kk <= 8 || isCurrent) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(kk, bx, chartBottom + 10);
                                }
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(D_5\\) using the formula \\(D_n = n! \\sum_{k=0}^{n} (-1)^k / k!\\).',
                    hint: 'Compute \\(5!(1 - 1 + 1/2 - 1/6 + 1/24 - 1/120)\\).',
                    solution: '\\(D_5 = 120(1 - 1 + 0.5 - 0.1\\overline{6} + 0.041\\overline{6} - 0.008\\overline{3}) = 120 \\cdot \\frac{11}{30} = 44\\).'
                },
                {
                    question: 'What fraction of all permutations of 10 elements are derangements? Give your answer to 4 decimal places.',
                    hint: 'Use \\(D_{10}/10! = \\sum_{k=0}^{10} (-1)^k/k!\\).',
                    solution: 'The sum \\(\\sum_{k=0}^{10} (-1)^k/k!\\) converges very quickly to \\(1/e\\). Computing: \\(D_{10}/10! \\approx 0.3679\\). The exact value is \\(D_{10} = 1{,}334{,}961\\) and \\(10! = 3{,}628{,}800\\), giving \\(0.3679\\).'
                },
                {
                    question: 'A secretary has 5 letters and 5 envelopes. How many ways can the letters be placed so that exactly 2 letters are in the correct envelope?',
                    hint: 'Choose 2 letters to be correct, and derange the remaining 3.',
                    solution: 'Choose which 2 are correct: \\(\\binom{5}{2} = 10\\). Derange the other 3: \\(D_3 = 2\\). Total: \\(10 \\times 2 = 20\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to Next Chapter
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Bridge: From Clever Counting to Recurrences</h2>

<h3>Euler's Totient via Inclusion-Exclusion</h3>

<p>As a final powerful application, inclusion-exclusion gives an elegant formula for Euler's totient function \\(\\varphi(n)\\), which counts integers from 1 to \\(n\\) that are coprime to \\(n\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.8 (Euler's Totient via I-E)</div>
    <div class="env-body">
        <p>If \\(n = p_1^{a_1} p_2^{a_2} \\cdots p_r^{a_r}\\), then</p>
        \\[\\varphi(n) = n \\prod_{i=1}^{r} \\left(1 - \\frac{1}{p_i}\\right).\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Let \\(A_i\\) be the set of integers from 1 to \\(n\\) divisible by \\(p_i\\). Then \\(|A_i| = n/p_i\\), \\(|A_i \\cap A_j| = n/(p_ip_j)\\), and so on. By inclusion-exclusion:</p>
        \\[\\varphi(n) = n - |A_1 \\cup \\cdots \\cup A_r| = n\\left(1 - \\sum \\frac{1}{p_i} + \\sum \\frac{1}{p_ip_j} - \\cdots\\right) = n\\prod_{i=1}^{r}\\left(1 - \\frac{1}{p_i}\\right). \\quad \\square\\]
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euler-totient-ie"></div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>\\(\\varphi(12) = 12(1 - 1/2)(1 - 1/3) = 12 \\cdot 1/2 \\cdot 2/3 = 4\\). Indeed, the integers coprime to 12 in \\(\\{1,\\ldots,12\\}\\) are \\(\\{1, 5, 7, 11\\}\\).</p>
    </div>
</div>

<h3>What Comes Next</h3>

<p>The pigeonhole principle and inclusion-exclusion gave us tools for existence proofs and exact counts in overlapping settings. The derangement formula hinted at a deep pattern: the answer involves a sum with alternating signs and factorials, closely related to the Taylor expansion of \\(e^{-1}\\).</p>

<p>In Chapter 8, we develop <strong>recurrence relations</strong>, which capture counting sequences by describing how each term relates to previous ones. The derangement recurrence \\(D_n = (n-1)(D_{n-1} + D_{n-2})\\) is a preview. We will learn systematic methods to solve such recurrences, connecting discrete counting to continuous mathematics through characteristic equations and generating functions.</p>

<div class="env-block remark">
    <div class="env-title">Connections</div>
    <div class="env-body">
        <p>Inclusion-exclusion is one of the fundamental tools of analytic combinatorics. It connects to M&ouml;bius inversion on posets (a vast generalization), the sieve of Eratosthenes (which is inclusion-exclusion applied to primes), and the principle of complementary counting that we met in Chapter 6. The Ramsey-theoretic ideas from this chapter resurface in graph theory (Chapters 10-13).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-euler-totient-ie',
                    title: 'Euler\'s Totient via Inclusion-Exclusion',
                    description: 'Visualize which integers from 1 to n are coprime to n by sieving out multiples of each prime factor. The remaining numbers (highlighted) give \\(\\varphi(n)\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nVal = 30;

                        VizEngine.createSlider(controls, 'n', 2, 60, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            draw();
                        });

                        function primeFactors(m) {
                            var factors = [];
                            for (var p = 2; p * p <= m; p++) {
                                if (m % p === 0) {
                                    factors.push(p);
                                    while (m % p === 0) m /= p;
                                }
                            }
                            if (m > 1) factors.push(m);
                            return factors;
                        }

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function eulerTotient(m) {
                            var result = m;
                            var pf = primeFactors(m);
                            for (var i = 0; i < pf.length; i++) {
                                result = result / pf[i] * (pf[i] - 1);
                            }
                            return result;
                        }

                        var sieveColors = [
                            viz.colors.red, viz.colors.orange, viz.colors.purple,
                            viz.colors.yellow, viz.colors.pink
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            var pf = primeFactors(nVal);
                            var phi = eulerTotient(nVal);

                            viz.screenText(
                                'phi(' + nVal + ') = ' + phi +
                                '   Prime factors: {' + pf.join(', ') + '}',
                                W / 2, 18, viz.colors.white, 13
                            );

                            // Formula
                            var formula = 'phi(' + nVal + ') = ' + nVal;
                            for (var f = 0; f < pf.length; f++) {
                                formula += '(1 - 1/' + pf[f] + ')';
                            }
                            formula += ' = ' + phi;
                            viz.screenText(formula, W / 2, 38, viz.colors.teal, 11);

                            // Grid of numbers 1..n
                            var cols = Math.min(Math.ceil(Math.sqrt(nVal * 1.5)), 15);
                            var rows = Math.ceil(nVal / cols);
                            var cellW = Math.min(36, (W - 40) / cols);
                            var cellH = Math.min(28, (H - 90) / rows);
                            var startX = (W - cols * cellW) / 2;
                            var startY = 60;

                            for (var num = 1; num <= nVal; num++) {
                                var row = Math.floor((num - 1) / cols);
                                var col = (num - 1) % cols;
                                var px = startX + col * cellW;
                                var py = startY + row * cellH;

                                var coprime = (gcd(num, nVal) === 1);
                                var divisorIdx = -1;
                                for (var d = 0; d < pf.length; d++) {
                                    if (num % pf[d] === 0) { divisorIdx = d; break; }
                                }

                                if (coprime) {
                                    ctx.fillStyle = viz.colors.teal + '33';
                                    ctx.fillRect(px, py - cellH/2 + 2, cellW - 2, cellH - 2);
                                } else if (divisorIdx >= 0) {
                                    ctx.fillStyle = sieveColors[divisorIdx % sieveColors.length] + '22';
                                    ctx.fillRect(px, py - cellH/2 + 2, cellW - 2, cellH - 2);
                                }

                                ctx.font = (nVal > 40 ? '9' : '11') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = coprime ? viz.colors.teal : viz.colors.text + '55';
                                ctx.fillText(num, px + cellW / 2 - 1, py + 2);
                            }

                            // Legend
                            var legY = H - 25;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Highlighted = coprime to ' + nVal, W / 2 - 80, legY);
                            for (var ll = 0; ll < pf.length; ll++) {
                                ctx.fillStyle = sieveColors[ll % sieveColors.length];
                                ctx.fillText('div by ' + pf[ll], W / 2 + 60 + ll * 70, legY);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\varphi(60)\\) using the product formula.',
                    hint: '\\(60 = 2^2 \\cdot 3 \\cdot 5\\). Apply \\(\\varphi(n) = n(1-1/p_1)(1-1/p_2)\\cdots\\).',
                    solution: '\\(\\varphi(60) = 60(1 - 1/2)(1 - 1/3)(1 - 1/5) = 60 \\cdot 1/2 \\cdot 2/3 \\cdot 4/5 = 16\\).'
                },
                {
                    question: 'Use inclusion-exclusion to count the number of permutations of \\(\\{1,2,\\ldots,6\\}\\) that fix at least one element.',
                    hint: 'This is \\(6! - D_6\\). Alternatively, compute \\(|A_1 \\cup \\cdots \\cup A_6|\\) directly.',
                    solution: 'Permutations fixing at least one element = \\(6! - D_6 = 720 - 265 = 455\\). Alternatively, by I-E: \\(\\binom{6}{1}5! - \\binom{6}{2}4! + \\binom{6}{3}3! - \\binom{6}{4}2! + \\binom{6}{5}1! - \\binom{6}{6}0! = 720 - 360 + 120 - 30 + 6 - 1 = 455\\).'
                }
            ]
        }
    ]
});
