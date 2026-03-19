window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch18',
    number: 18,
    title: 'Automata & Formal Languages',
    subtitle: 'Machines that recognize patterns',
    sections: [
        // ================================================================
        // SECTION 1: Why Study Automata?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Study Automata?',
            content: `
<h2>Why Study Automata?</h2>

<div class="env-block intuition">
    <div class="env-title">Machines That Read</div>
    <div class="env-body">
        <p>Every time you type a search query, validate a password, or compile a program, a machine must <em>read</em> a sequence of symbols and decide whether it matches a pattern. Automata theory gives us the simplest possible models of such machines, letting us understand exactly what can and cannot be recognized by finite means.</p>
    </div>
</div>

<p>An <strong>automaton</strong> (plural: <em>automata</em>) is an abstract machine that processes an input string one symbol at a time, transitioning between internal states according to fixed rules. When the input is exhausted, the machine either <strong>accepts</strong> or <strong>rejects</strong> the string. The set of all strings a machine accepts is called its <strong>language</strong>.</p>

<p>Why should we care? Three compelling reasons:</p>

<ol>
    <li><strong>Pattern matching.</strong> Regular expressions, which power every text editor's "find" feature, are exactly equivalent to finite automata. Understanding automata means understanding what regex can and cannot do.</li>
    <li><strong>Compiler design.</strong> The first phase of any compiler (lexical analysis) is a finite automaton that breaks source code into tokens: keywords, identifiers, numbers, operators.</li>
    <li><strong>Limits of computation.</strong> Finite automata cannot count arbitrarily. This limitation, made precise by the pumping lemma, tells us when we need more powerful computational models (pushdown automata, Turing machines).</li>
</ol>

<h3>The Landscape</h3>

<p>Automata theory organizes computational models into a hierarchy of increasing power:</p>

<div class="env-block definition">
    <div class="env-title">Definition (Chomsky Hierarchy, Simplified)</div>
    <div class="env-body">
        <ul>
            <li><strong>Regular languages</strong> \\(\\leftrightarrow\\) Finite automata (DFA/NFA) \\(\\leftrightarrow\\) Regular expressions</li>
            <li><strong>Context-free languages</strong> \\(\\leftrightarrow\\) Pushdown automata \\(\\leftrightarrow\\) Context-free grammars</li>
            <li><strong>Recursively enumerable languages</strong> \\(\\leftrightarrow\\) Turing machines</li>
        </ul>
    </div>
</div>

<p>This chapter focuses on the first level: <strong>regular languages</strong> and the finite automata that recognize them. We will build DFAs and NFAs, prove they are equivalent, connect them to regular expressions, and then use the pumping lemma to show what lies beyond their reach.</p>

<h3>Alphabet, Strings, and Languages</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Basic Terminology)</div>
    <div class="env-body">
        <ul>
            <li>An <strong>alphabet</strong> \\(\\Sigma\\) is a finite, nonempty set of symbols. Example: \\(\\Sigma = \\{0, 1\\}\\).</li>
            <li>A <strong>string</strong> (or <strong>word</strong>) over \\(\\Sigma\\) is a finite sequence of symbols from \\(\\Sigma\\). The <strong>empty string</strong> is denoted \\(\\varepsilon\\).</li>
            <li>\\(\\Sigma^*\\) is the set of <em>all</em> strings over \\(\\Sigma\\), including \\(\\varepsilon\\).</li>
            <li>A <strong>language</strong> \\(L\\) over \\(\\Sigma\\) is any subset \\(L \\subseteq \\Sigma^*\\).</li>
        </ul>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Over \\(\\Sigma = \\{0, 1\\}\\), consider the language \\(L = \\{w \\in \\Sigma^* : w \\text{ contains an even number of 1s}\\}\\). Then \\(\\varepsilon \\in L\\) (zero 1s is even), \\(0 \\in L\\), \\(11 \\in L\\), but \\(1 \\notin L\\) and \\(01 \\notin L\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Warren McCulloch and Walter Pitts introduced finite automata in 1943 as simplified models of neural activity. Stephen Kleene (1956) proved the equivalence between finite automata and regular expressions. Michael Rabin and Dana Scott (1959) established the equivalence of deterministic and nondeterministic models, earning the Turing Award.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Deterministic Finite Automata (DFA)
        // ================================================================
        {
            id: 'sec-dfa',
            title: 'Deterministic Finite Automata',
            content: `
<h2>Deterministic Finite Automata</h2>

<div class="env-block intuition">
    <div class="env-title">A Machine with No Memory</div>
    <div class="env-body">
        <p>Imagine a turnstile that reads tokens. It has exactly two states: <em>locked</em> and <em>unlocked</em>. Inserting a coin transitions it from locked to unlocked; pushing the arm transitions it from unlocked to locked. At any moment, the turnstile is in exactly one state, and its next state depends only on its current state and the current input. This is the essence of a DFA.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Deterministic Finite Automaton)</div>
    <div class="env-body">
        <p>A <strong>DFA</strong> is a 5-tuple \\(M = (Q, \\Sigma, \\delta, q_0, F)\\) where:</p>
        <ul>
            <li>\\(Q\\) is a finite set of <strong>states</strong>.</li>
            <li>\\(\\Sigma\\) is a finite <strong>alphabet</strong>.</li>
            <li>\\(\\delta : Q \\times \\Sigma \\to Q\\) is the <strong>transition function</strong>.</li>
            <li>\\(q_0 \\in Q\\) is the <strong>start state</strong>.</li>
            <li>\\(F \\subseteq Q\\) is the set of <strong>accept states</strong> (or <strong>final states</strong>).</li>
        </ul>
    </div>
</div>

<p>The key property of a DFA is <em>determinism</em>: for every state and every input symbol, there is <strong>exactly one</strong> next state. No choices, no ambiguity.</p>

<h3>Computation</h3>

<p>Given an input string \\(w = w_1 w_2 \\cdots w_n\\), the DFA processes it as follows:</p>
<ol>
    <li>Start in state \\(q_0\\).</li>
    <li>Read \\(w_1\\), transition to \\(\\delta(q_0, w_1) = r_1\\).</li>
    <li>Read \\(w_2\\), transition to \\(\\delta(r_1, w_2) = r_2\\).</li>
    <li>Continue until all symbols are consumed, reaching state \\(r_n\\).</li>
    <li>If \\(r_n \\in F\\), the DFA <strong>accepts</strong> \\(w\\). Otherwise it <strong>rejects</strong>.</li>
</ol>

<div class="env-block definition">
    <div class="env-title">Definition (Language of a DFA)</div>
    <div class="env-body">
        <p>The <strong>language recognized by</strong> \\(M\\), written \\(L(M)\\), is the set of all strings that \\(M\\) accepts:</p>
        \\[L(M) = \\{w \\in \\Sigma^* : \\hat{\\delta}(q_0, w) \\in F\\}\\]
        <p>where \\(\\hat{\\delta}\\) is the <strong>extended transition function</strong> defined by \\(\\hat{\\delta}(q, \\varepsilon) = q\\) and \\(\\hat{\\delta}(q, wa) = \\delta(\\hat{\\delta}(q, w), a)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Strings Ending in 01</div>
    <div class="env-body">
        <p>Consider the language \\(L = \\{w \\in \\{0,1\\}^* : w \\text{ ends with } 01\\}\\). A DFA for this language needs three states:</p>
        <ul>
            <li>\\(q_0\\): "Haven't seen the pattern yet" (start state)</li>
            <li>\\(q_1\\): "Just saw a 0"</li>
            <li>\\(q_2\\): "Just saw 01" (accept state)</li>
        </ul>
        <p>The transition function: \\(\\delta(q_0, 0) = q_1\\), \\(\\delta(q_0, 1) = q_0\\), \\(\\delta(q_1, 0) = q_1\\), \\(\\delta(q_1, 1) = q_2\\), \\(\\delta(q_2, 0) = q_1\\), \\(\\delta(q_2, 1) = q_0\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-dfa-simulator"></div>

<div class="env-block remark">
    <div class="env-title">State Diagrams</div>
    <div class="env-body">
        <p>We draw DFAs as directed graphs: each state is a circle, each transition is a labeled arrow, the start state has an incoming arrow from nowhere, and accept states have double circles. The visualization above uses exactly this convention.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-dfa-simulator',
                    title: 'DFA Simulator',
                    description: 'Watch a DFA process an input string step by step. Choose a preset language or build your own input. The current state highlights in yellow; accept states have double borders.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Preset DFAs
                        var presets = {
                            'Ends with 01': {
                                states: ['q0','q1','q2'],
                                alphabet: ['0','1'],
                                transitions: {
                                    'q0,0':'q1', 'q0,1':'q0',
                                    'q1,0':'q1', 'q1,1':'q2',
                                    'q2,0':'q1', 'q2,1':'q0'
                                },
                                start: 'q0',
                                accept: ['q2']
                            },
                            'Even number of 1s': {
                                states: ['even','odd'],
                                alphabet: ['0','1'],
                                transitions: {
                                    'even,0':'even', 'even,1':'odd',
                                    'odd,0':'odd', 'odd,1':'even'
                                },
                                start: 'even',
                                accept: ['even']
                            },
                            'Contains 110': {
                                states: ['s0','s1','s11','s110'],
                                alphabet: ['0','1'],
                                transitions: {
                                    's0,0':'s0', 's0,1':'s1',
                                    's1,0':'s0', 's1,1':'s11',
                                    's11,0':'s110', 's11,1':'s11',
                                    's110,0':'s110', 's110,1':'s110'
                                },
                                start: 's0',
                                accept: ['s110']
                            },
                            'Divisible by 3': {
                                states: ['r0','r1','r2'],
                                alphabet: ['0','1'],
                                transitions: {
                                    'r0,0':'r0', 'r0,1':'r1',
                                    'r1,0':'r2', 'r1,1':'r0',
                                    'r2,0':'r1', 'r2,1':'r2'
                                },
                                start: 'r0',
                                accept: ['r0']
                            }
                        };

                        var currentPreset = 'Ends with 01';
                        var inputStr = '1001';
                        var stepIdx = -1;
                        var animTimer = null;

                        // Controls
                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        for (var name in presets) {
                            var opt = document.createElement('option');
                            opt.value = name; opt.textContent = name;
                            sel.appendChild(opt);
                        }
                        sel.addEventListener('change', function() {
                            currentPreset = sel.value;
                            stepIdx = -1;
                            draw();
                        });
                        controls.appendChild(sel);

                        var inp = document.createElement('input');
                        inp.type = 'text'; inp.value = inputStr;
                        inp.style.cssText = 'width:80px;padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;font-family:monospace;margin-right:6px;';
                        inp.placeholder = 'Input';
                        inp.addEventListener('input', function() {
                            inputStr = inp.value.replace(/[^01]/g, '');
                            stepIdx = -1;
                            draw();
                        });
                        controls.appendChild(inp);

                        VizEngine.createButton(controls, 'Step', function() {
                            if (stepIdx < inputStr.length) { stepIdx++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Run', function() {
                            stepIdx = -1;
                            if (animTimer) clearInterval(animTimer);
                            animTimer = setInterval(function() {
                                if (stepIdx >= inputStr.length) { clearInterval(animTimer); animTimer = null; return; }
                                stepIdx++;
                                draw();
                            }, 500);
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            stepIdx = -1;
                            draw();
                        });

                        function getStatePositions(dfa) {
                            var n = dfa.states.length;
                            var cx = viz.width / 2;
                            var cy = viz.height / 2 + 10;
                            var rx = Math.min(180, viz.width / 2 - 60);
                            var ry = Math.min(130, viz.height / 2 - 50);
                            var pos = {};
                            for (var i = 0; i < n; i++) {
                                var angle = -Math.PI / 2 + (2 * Math.PI * i / n);
                                pos[dfa.states[i]] = {
                                    x: cx + rx * Math.cos(angle),
                                    y: cy + ry * Math.sin(angle)
                                };
                            }
                            return pos;
                        }

                        function getCurrentState(dfa, str, steps) {
                            var state = dfa.start;
                            for (var i = 0; i < steps && i < str.length; i++) {
                                var key = state + ',' + str[i];
                                state = dfa.transitions[key] || state;
                            }
                            return state;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var dfa = presets[currentPreset];
                            var pos = getStatePositions(dfa);
                            var R = 28;

                            var curState = getCurrentState(dfa, inputStr, Math.max(0, stepIdx));

                            // Title
                            viz.screenText('DFA: ' + currentPreset, viz.width / 2, 18, viz.colors.white, 14);

                            // Draw transitions (arrows)
                            for (var key in dfa.transitions) {
                                var parts = key.split(',');
                                var from = parts[0], sym = parts[1];
                                var to = dfa.transitions[key];
                                var p1 = pos[from], p2 = pos[to];

                                if (from === to) {
                                    // Self-loop
                                    var lx = p1.x, ly = p1.y - R - 18;
                                    ctx.strokeStyle = viz.colors.text;
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.arc(lx, ly, 14, 0.3, Math.PI - 0.3);
                                    ctx.stroke();
                                    // Arrowhead
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.beginPath();
                                    ctx.moveTo(lx + 13, ly + 4);
                                    ctx.lineTo(lx + 7, ly + 12);
                                    ctx.lineTo(lx + 15, ly + 10);
                                    ctx.closePath(); ctx.fill();
                                    // Label
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';

                                    // Merge labels for self-loops
                                    var selfLabels = [];
                                    for (var k2 in dfa.transitions) {
                                        var p2s = k2.split(',');
                                        if (p2s[0] === from && dfa.transitions[k2] === from) {
                                            selfLabels.push(p2s[1]);
                                        }
                                    }
                                    ctx.fillText(selfLabels.join(','), lx, ly - 14);
                                    continue;
                                }

                                // Check if there's a reverse edge
                                var reverseKey = to + ',' + sym;
                                var hasReverse = false;
                                for (var rk in dfa.transitions) {
                                    var rp = rk.split(',');
                                    if (rp[0] === to && dfa.transitions[rk] === from) { hasReverse = true; break; }
                                }

                                var dx = p2.x - p1.x, dy = p2.y - p1.y;
                                var dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist < 1) continue;
                                var ux = dx / dist, uy = dy / dist;

                                // Offset if bidirectional
                                var offx = hasReverse ? -uy * 8 : 0;
                                var offy = hasReverse ? ux * 8 : 0;

                                var sx = p1.x + ux * R + offx;
                                var sy = p1.y + uy * R + offy;
                                var ex = p2.x - ux * R + offx;
                                var ey = p2.y - uy * R + offy;

                                // Highlight active transition
                                var isActive = stepIdx > 0 && stepIdx <= inputStr.length &&
                                    getCurrentState(dfa, inputStr, stepIdx - 1) === from &&
                                    inputStr[stepIdx - 1] === sym &&
                                    dfa.transitions[key] === curState;

                                ctx.strokeStyle = isActive ? viz.colors.yellow : viz.colors.text;
                                ctx.lineWidth = isActive ? 2.5 : 1.5;
                                ctx.beginPath();
                                ctx.moveTo(sx, sy);
                                ctx.lineTo(ex, ey);
                                ctx.stroke();

                                // Arrowhead
                                var angle = Math.atan2(ey - sy, ex - sx);
                                ctx.fillStyle = isActive ? viz.colors.yellow : viz.colors.text;
                                ctx.beginPath();
                                ctx.moveTo(ex, ey);
                                ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
                                ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
                                ctx.closePath(); ctx.fill();

                                // Label
                                var mx = (sx + ex) / 2 + offx * 0.5;
                                var my = (sy + ey) / 2 + offy * 0.5;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(sym, mx - uy * 12, my + ux * 12);
                            }

                            // Draw states
                            for (var i = 0; i < dfa.states.length; i++) {
                                var s = dfa.states[i];
                                var p = pos[s];
                                var isCurrent = (s === curState && stepIdx >= 0);
                                var isAccept = dfa.accept.indexOf(s) >= 0;

                                // Glow for current
                                if (isCurrent) {
                                    ctx.fillStyle = viz.colors.yellow + '33';
                                    ctx.beginPath(); ctx.arc(p.x, p.y, R + 8, 0, Math.PI * 2); ctx.fill();
                                }

                                // State circle
                                ctx.fillStyle = isCurrent ? viz.colors.yellow + '22' : viz.colors.bg;
                                ctx.strokeStyle = isCurrent ? viz.colors.yellow : (isAccept ? viz.colors.green : viz.colors.blue);
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();

                                // Double circle for accept
                                if (isAccept) {
                                    ctx.beginPath(); ctx.arc(p.x, p.y, R - 5, 0, Math.PI * 2);
                                    ctx.stroke();
                                }

                                // Start arrow
                                if (s === dfa.start) {
                                    ctx.strokeStyle = viz.colors.white;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(p.x - R - 30, p.y);
                                    ctx.lineTo(p.x - R - 2, p.y);
                                    ctx.stroke();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.beginPath();
                                    ctx.moveTo(p.x - R, p.y);
                                    ctx.lineTo(p.x - R - 10, p.y - 5);
                                    ctx.lineTo(p.x - R - 10, p.y + 5);
                                    ctx.closePath(); ctx.fill();
                                }

                                // State label
                                ctx.fillStyle = isCurrent ? viz.colors.yellow : viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(s, p.x, p.y);
                            }

                            // Input string display
                            var strY = viz.height - 40;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Input:', 40, strY);

                            var strStartX = 70;
                            for (var c = 0; c < inputStr.length; c++) {
                                var cx2 = strStartX + c * 22;
                                var isRead = c < stepIdx;
                                var isReading = c === stepIdx - 1;

                                if (isReading) {
                                    ctx.fillStyle = viz.colors.yellow + '44';
                                    ctx.fillRect(cx2 - 8, strY - 10, 18, 22);
                                }

                                ctx.fillStyle = isRead ? viz.colors.text : viz.colors.white;
                                ctx.font = (isReading ? 'bold ' : '') + '14px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(inputStr[c], cx2, strY);
                            }

                            // Result
                            if (stepIdx >= inputStr.length && inputStr.length > 0) {
                                var accepted = dfa.accept.indexOf(curState) >= 0;
                                ctx.fillStyle = accepted ? viz.colors.green : viz.colors.red;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(accepted ? 'ACCEPTED' : 'REJECTED', viz.width - 20, strY);
                            } else if (stepIdx === -1) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('Press Step or Run', viz.width - 20, strY);
                            } else {
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('State: ' + curState, viz.width - 20, strY);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Design a DFA over \\(\\Sigma = \\{0,1\\}\\) that accepts exactly those strings containing an odd number of 0s. How many states does your DFA need?',
                    hint: 'You only need to track the parity of the count of 0s seen so far.',
                    solution: 'Two states suffice: \\(q_e\\) (even number of 0s, start state) and \\(q_o\\) (odd number of 0s, accept state). On input 0, toggle between states; on input 1, stay in the current state. Formally: \\(\\delta(q_e, 0) = q_o\\), \\(\\delta(q_e, 1) = q_e\\), \\(\\delta(q_o, 0) = q_e\\), \\(\\delta(q_o, 1) = q_o\\).'
                },
                {
                    question: 'Consider the DFA with states \\(\\{q_0, q_1, q_2\\}\\), start state \\(q_0\\), accept state \\(\\{q_0\\}\\), and transitions \\(\\delta(q_i, b) = q_{(2i + b) \\mod 3}\\) for \\(b \\in \\{0,1\\}\\). What language does this DFA recognize?',
                    hint: 'Track the value of the state index as you read a binary string from left to right. What does reading digit \\(b\\) do to a binary number?',
                    solution: 'The state index tracks the value of the binary string read so far, modulo 3. Reading bit \\(b\\) after value \\(v\\) gives \\(2v + b\\), and taking mod 3 keeps us in \\(\\{0,1,2\\}\\). Since the accept state is \\(q_0\\), the DFA accepts binary strings whose value is divisible by 3. For example, \\(110_2 = 6\\) is accepted, \\(101_2 = 5\\) is rejected.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Nondeterministic Finite Automata (NFA)
        // ================================================================
        {
            id: 'sec-nfa',
            title: 'Nondeterministic Finite Automata',
            content: `
<h2>Nondeterministic Finite Automata</h2>

<div class="env-block intuition">
    <div class="env-title">Guessing Machines</div>
    <div class="env-body">
        <p>A DFA has exactly one choice at each step. An NFA can have <em>several</em> choices, or even none. Think of it as a machine that can "guess" the right path. If <em>any</em> sequence of guesses leads to an accept state, the string is accepted. Equivalently, imagine the NFA exploring all possible paths in parallel.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Nondeterministic Finite Automaton)</div>
    <div class="env-body">
        <p>An <strong>NFA</strong> is a 5-tuple \\(N = (Q, \\Sigma, \\delta, q_0, F)\\) where:</p>
        <ul>
            <li>\\(Q, \\Sigma, q_0, F\\) are as in a DFA.</li>
            <li>\\(\\delta : Q \\times (\\Sigma \\cup \\{\\varepsilon\\}) \\to \\mathcal{P}(Q)\\) maps each state and symbol (or \\(\\varepsilon\\)) to a <strong>set</strong> of states.</li>
        </ul>
        <p>The two key differences from a DFA:</p>
        <ol>
            <li><strong>Multiple transitions:</strong> \\(\\delta(q, a)\\) can be a set with 0, 1, or many states.</li>
            <li><strong>\\(\\varepsilon\\)-transitions:</strong> The NFA can change state without consuming an input symbol.</li>
        </ol>
    </div>
</div>

<h3>Acceptance</h3>

<p>An NFA accepts a string \\(w\\) if there <strong>exists</strong> some sequence of transitions that reads all of \\(w\\) and ends in an accept state. The machine rejects only if <em>every</em> possible computation path leads to a non-accept state (or gets stuck).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.1 (NFA Acceptance)</div>
    <div class="env-body">
        <p>An NFA \\(N = (Q, \\Sigma, \\delta, q_0, F)\\) accepts \\(w = w_1 w_2 \\cdots w_m\\) (where each \\(w_i \\in \\Sigma \\cup \\{\\varepsilon\\}\\)) if there exists a sequence of states \\(r_0, r_1, \\ldots, r_m\\) such that:</p>
        <ol>
            <li>\\(r_0 = q_0\\),</li>
            <li>\\(r_{i+1} \\in \\delta(r_i, w_{i+1})\\) for \\(i = 0, \\ldots, m-1\\),</li>
            <li>\\(r_m \\in F\\).</li>
        </ol>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Strings Ending in 01</div>
    <div class="env-body">
        <p>An NFA for "ends with 01" is simpler than the DFA: three states \\(q_0, q_1, q_2\\). From \\(q_0\\), on 0 go to both \\(q_0\\) and \\(q_1\\); on 1 stay in \\(q_0\\). From \\(q_1\\), on 1 go to \\(q_2\\). \\(q_2\\) is the accept state. The machine "guesses" when the final 01 starts.</p>
    </div>
</div>

<h3>\\(\\varepsilon\\)-Closures</h3>

<div class="env-block definition">
    <div class="env-title">Definition (\\(\\varepsilon\\)-Closure)</div>
    <div class="env-body">
        <p>For a state \\(q\\), the <strong>\\(\\varepsilon\\)-closure</strong> \\(E(q)\\) is the set of all states reachable from \\(q\\) by following zero or more \\(\\varepsilon\\)-transitions. For a set \\(S\\) of states, \\(E(S) = \\bigcup_{q \\in S} E(q)\\).</p>
    </div>
</div>

<p>The \\(\\varepsilon\\)-closure is computed by a simple reachability search (BFS or DFS) following only \\(\\varepsilon\\)-edges.</p>

<div class="viz-placeholder" data-viz="viz-nfa-simulator"></div>
`,
            visualizations: [
                {
                    id: 'viz-nfa-simulator',
                    title: 'NFA Simulator',
                    description: 'Watch an NFA explore all paths simultaneously. Active states are highlighted; multiple states can be active at once. If any active state is an accept state when the input is exhausted, the string is accepted.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nfa = {
                            states: ['q0','q1','q2'],
                            alphabet: ['0','1'],
                            transitions: {
                                'q0,0': ['q0','q1'],
                                'q0,1': ['q0'],
                                'q1,1': ['q2']
                            },
                            epsilons: {},
                            start: 'q0',
                            accept: ['q2']
                        };

                        var presets = {
                            'Ends with 01': {
                                states: ['q0','q1','q2'],
                                transitions: { 'q0,0':['q0','q1'], 'q0,1':['q0'], 'q1,1':['q2'] },
                                epsilons: {},
                                start: 'q0', accept: ['q2']
                            },
                            'Contains 101': {
                                states: ['q0','q1','q2','q3'],
                                transitions: {
                                    'q0,0':['q0'], 'q0,1':['q0','q1'],
                                    'q1,0':['q2'],
                                    'q2,1':['q3'],
                                    'q3,0':['q3'], 'q3,1':['q3']
                                },
                                epsilons: {},
                                start: 'q0', accept: ['q3']
                            },
                            'Epsilon example': {
                                states: ['q0','q1','q2','q3'],
                                transitions: {
                                    'q1,0':['q2'],
                                    'q2,1':['q3']
                                },
                                epsilons: { 'q0': ['q1'] },
                                start: 'q0', accept: ['q3']
                            }
                        };

                        var currentPreset = 'Ends with 01';
                        var inputStr = '1001';
                        var stepIdx = -1;
                        var activeStates = [];

                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        for (var name in presets) {
                            var opt = document.createElement('option');
                            opt.value = name; opt.textContent = name;
                            sel.appendChild(opt);
                        }
                        sel.addEventListener('change', function() {
                            currentPreset = sel.value;
                            nfa = Object.assign({alphabet:['0','1']}, presets[currentPreset]);
                            resetSim();
                        });
                        controls.appendChild(sel);

                        var inp = document.createElement('input');
                        inp.type = 'text'; inp.value = inputStr;
                        inp.style.cssText = 'width:80px;padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;font-family:monospace;margin-right:6px;';
                        inp.addEventListener('input', function() {
                            inputStr = inp.value.replace(/[^01]/g, '');
                            resetSim();
                        });
                        controls.appendChild(inp);

                        VizEngine.createButton(controls, 'Step', function() {
                            if (stepIdx < inputStr.length) { stepIdx++; computeActive(); draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() { resetSim(); });

                        function epsClosure(states) {
                            var result = {};
                            var stack = states.slice();
                            for (var i = 0; i < stack.length; i++) result[stack[i]] = true;
                            while (stack.length > 0) {
                                var s = stack.pop();
                                var eps = nfa.epsilons[s] || [];
                                for (var j = 0; j < eps.length; j++) {
                                    if (!result[eps[j]]) {
                                        result[eps[j]] = true;
                                        stack.push(eps[j]);
                                    }
                                }
                            }
                            return Object.keys(result);
                        }

                        function computeActive() {
                            if (stepIdx <= 0) {
                                activeStates = epsClosure([nfa.start]);
                                return;
                            }
                            // Re-compute from start
                            var current = epsClosure([nfa.start]);
                            for (var i = 0; i < stepIdx && i < inputStr.length; i++) {
                                var sym = inputStr[i];
                                var next = [];
                                for (var j = 0; j < current.length; j++) {
                                    var key = current[j] + ',' + sym;
                                    var dests = nfa.transitions[key] || [];
                                    for (var k = 0; k < dests.length; k++) {
                                        if (next.indexOf(dests[k]) < 0) next.push(dests[k]);
                                    }
                                }
                                current = epsClosure(next);
                            }
                            activeStates = current;
                        }

                        function resetSim() {
                            stepIdx = -1;
                            activeStates = [];
                            draw();
                        }

                        function getPositions() {
                            var n = nfa.states.length;
                            var cx = viz.width / 2, cy = viz.height / 2 + 10;
                            var rx = Math.min(180, viz.width / 2 - 60);
                            var ry = Math.min(130, viz.height / 2 - 50);
                            var pos = {};
                            for (var i = 0; i < n; i++) {
                                var angle = -Math.PI / 2 + 2 * Math.PI * i / n;
                                pos[nfa.states[i]] = { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
                            }
                            return pos;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pos = getPositions();
                            var R = 28;

                            viz.screenText('NFA: ' + currentPreset, viz.width / 2, 18, viz.colors.white, 14);

                            // Draw transitions
                            var drawn = {};
                            for (var key in nfa.transitions) {
                                var parts = key.split(',');
                                var from = parts[0], sym = parts[1];
                                var targets = nfa.transitions[key];
                                for (var t = 0; t < targets.length; t++) {
                                    var to = targets[t];
                                    var edgeKey = from + '->' + to;
                                    var p1 = pos[from], p2 = pos[to];

                                    if (from === to) {
                                        // Self-loop
                                        if (!drawn[edgeKey]) {
                                            drawn[edgeKey] = [sym];
                                            ctx.strokeStyle = viz.colors.text;
                                            ctx.lineWidth = 1.5;
                                            ctx.beginPath();
                                            ctx.arc(p1.x, p1.y - R - 18, 14, 0.3, Math.PI - 0.3);
                                            ctx.stroke();
                                        } else {
                                            drawn[edgeKey].push(sym);
                                        }
                                        continue;
                                    }

                                    var hasReverse = false;
                                    for (var rk in nfa.transitions) {
                                        var rp = rk.split(',');
                                        if (rp[0] === to) {
                                            var rt = nfa.transitions[rk];
                                            if (rt.indexOf(from) >= 0) { hasReverse = true; break; }
                                        }
                                    }

                                    var dx = p2.x - p1.x, dy = p2.y - p1.y;
                                    var dist = Math.sqrt(dx * dx + dy * dy);
                                    if (dist < 1) continue;
                                    var ux = dx / dist, uy = dy / dist;
                                    var offx = hasReverse ? -uy * 8 : 0;
                                    var offy = hasReverse ? ux * 8 : 0;

                                    var sx = p1.x + ux * R + offx, sy = p1.y + uy * R + offy;
                                    var ex = p2.x - ux * R + offx, ey = p2.y - uy * R + offy;

                                    if (!drawn[edgeKey]) {
                                        drawn[edgeKey] = [sym];
                                        ctx.strokeStyle = viz.colors.text;
                                        ctx.lineWidth = 1.5;
                                        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
                                        var angle = Math.atan2(ey - sy, ex - sx);
                                        ctx.fillStyle = viz.colors.text;
                                        ctx.beginPath();
                                        ctx.moveTo(ex, ey);
                                        ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
                                        ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
                                        ctx.closePath(); ctx.fill();
                                    } else {
                                        drawn[edgeKey].push(sym);
                                    }
                                }
                            }

                            // Epsilon transitions
                            for (var from2 in nfa.epsilons) {
                                var targets2 = nfa.epsilons[from2];
                                for (var t2 = 0; t2 < targets2.length; t2++) {
                                    var to2 = targets2[t2];
                                    var edgeKey2 = from2 + '->' + to2;
                                    var p1b = pos[from2], p2b = pos[to2];
                                    var dx2 = p2b.x - p1b.x, dy2 = p2b.y - p1b.y;
                                    var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                                    if (dist2 < 1) continue;
                                    var ux2 = dx2 / dist2, uy2 = dy2 / dist2;
                                    var sx2 = p1b.x + ux2 * R, sy2 = p1b.y + uy2 * R;
                                    var ex2 = p2b.x - ux2 * R, ey2 = p2b.y - uy2 * R;

                                    ctx.strokeStyle = viz.colors.purple;
                                    ctx.lineWidth = 1.5;
                                    ctx.setLineDash([4, 3]);
                                    ctx.beginPath(); ctx.moveTo(sx2, sy2); ctx.lineTo(ex2, ey2); ctx.stroke();
                                    ctx.setLineDash([]);

                                    var angle2 = Math.atan2(ey2 - sy2, ex2 - sx2);
                                    ctx.fillStyle = viz.colors.purple;
                                    ctx.beginPath();
                                    ctx.moveTo(ex2, ey2);
                                    ctx.lineTo(ex2 - 10 * Math.cos(angle2 - 0.4), ey2 - 10 * Math.sin(angle2 - 0.4));
                                    ctx.lineTo(ex2 - 10 * Math.cos(angle2 + 0.4), ey2 - 10 * Math.sin(angle2 + 0.4));
                                    ctx.closePath(); ctx.fill();

                                    if (!drawn[edgeKey2]) drawn[edgeKey2] = [];
                                    drawn[edgeKey2].push('\u03B5');
                                }
                            }

                            // Draw edge labels
                            for (var ek in drawn) {
                                var ekParts = ek.split('->');
                                var efrom = ekParts[0], eto = ekParts[1];
                                var ep1 = pos[efrom], ep2 = pos[eto];
                                if (efrom === eto) {
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                    ctx.fillText(drawn[ek].join(','), ep1.x, ep1.y - R - 34);
                                } else {
                                    var edx = ep2.x - ep1.x, edy = ep2.y - ep1.y;
                                    var edist = Math.sqrt(edx * edx + edy * edy);
                                    if (edist < 1) continue;
                                    var eux = edx / edist, euy = edy / edist;
                                    var emx = (ep1.x + ep2.x) / 2, emy = (ep1.y + ep2.y) / 2;
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(drawn[ek].join(','), emx - euy * 14, emy + eux * 14);
                                }
                            }

                            // Draw states
                            for (var i = 0; i < nfa.states.length; i++) {
                                var s = nfa.states[i];
                                var p = pos[s];
                                var isActive = activeStates.indexOf(s) >= 0;
                                var isAccept = nfa.accept.indexOf(s) >= 0;

                                if (isActive) {
                                    ctx.fillStyle = viz.colors.teal + '33';
                                    ctx.beginPath(); ctx.arc(p.x, p.y, R + 8, 0, Math.PI * 2); ctx.fill();
                                }

                                ctx.fillStyle = isActive ? viz.colors.teal + '22' : viz.colors.bg;
                                ctx.strokeStyle = isActive ? viz.colors.teal : (isAccept ? viz.colors.green : viz.colors.blue);
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();

                                if (isAccept) {
                                    ctx.beginPath(); ctx.arc(p.x, p.y, R - 5, 0, Math.PI * 2);
                                    ctx.stroke();
                                }

                                if (s === nfa.start) {
                                    ctx.strokeStyle = viz.colors.white;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(p.x - R - 30, p.y);
                                    ctx.lineTo(p.x - R - 2, p.y);
                                    ctx.stroke();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.beginPath();
                                    ctx.moveTo(p.x - R, p.y);
                                    ctx.lineTo(p.x - R - 10, p.y - 5);
                                    ctx.lineTo(p.x - R - 10, p.y + 5);
                                    ctx.closePath(); ctx.fill();
                                }

                                ctx.fillStyle = isActive ? viz.colors.teal : viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(s, p.x, p.y);
                            }

                            // Input string display
                            var strY = viz.height - 40;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Input:', 40, strY);

                            for (var c = 0; c < inputStr.length; c++) {
                                var cx2 = 70 + c * 22;
                                var isRead = c < stepIdx;
                                ctx.fillStyle = isRead ? viz.colors.text : viz.colors.white;
                                ctx.font = '14px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(inputStr[c], cx2, strY);
                            }

                            // Active states count
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Active: {' + activeStates.join(', ') + '}', viz.width / 2, viz.height - 15);

                            if (stepIdx >= inputStr.length && inputStr.length > 0) {
                                var accepted = false;
                                for (var a = 0; a < activeStates.length; a++) {
                                    if (nfa.accept.indexOf(activeStates[a]) >= 0) { accepted = true; break; }
                                }
                                ctx.fillStyle = accepted ? viz.colors.green : viz.colors.red;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(accepted ? 'ACCEPTED' : 'REJECTED', viz.width - 20, strY);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Give an NFA with only 2 states that accepts the language of all binary strings that contain at least one 1.',
                    hint: 'The start state is non-accepting. On seeing a 1, transition to an accept state that has self-loops on both 0 and 1.',
                    solution: 'States \\(\\{q_0, q_1\\}\\), start \\(q_0\\), accept \\(\\{q_1\\}\\). Transitions: \\(\\delta(q_0, 0) = \\{q_0\\}\\), \\(\\delta(q_0, 1) = \\{q_1\\}\\), \\(\\delta(q_1, 0) = \\{q_1\\}\\), \\(\\delta(q_1, 1) = \\{q_1\\}\\). This is actually deterministic (every transition is unique), but it is a valid NFA.'
                },
                {
                    question: 'Consider an NFA with \\(\\varepsilon\\)-transitions from \\(q_0\\) to \\(q_1\\) and from \\(q_1\\) to \\(q_2\\). What is \\(E(q_0)\\), the \\(\\varepsilon\\)-closure of \\(q_0\\)?',
                    hint: 'Follow \\(\\varepsilon\\)-transitions transitively from \\(q_0\\).',
                    solution: '\\(E(q_0) = \\{q_0, q_1, q_2\\}\\). From \\(q_0\\), an \\(\\varepsilon\\)-transition reaches \\(q_1\\), and from \\(q_1\\), another \\(\\varepsilon\\)-transition reaches \\(q_2\\). The \\(\\varepsilon\\)-closure always includes the state itself.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: DFA-NFA Equivalence
        // ================================================================
        {
            id: 'sec-equivalence',
            title: 'DFA-NFA Equivalence',
            content: `
<h2>DFA-NFA Equivalence</h2>

<div class="env-block intuition">
    <div class="env-title">The Subset Construction</div>
    <div class="env-body">
        <p>Nondeterminism seems to add power: an NFA can "be in multiple states at once." But we can <em>simulate</em> this with a DFA whose states are <strong>sets</strong> of NFA states. Each DFA state records every NFA state the machine could be in. This construction, called the <strong>subset construction</strong> (or powerset construction), proves that NFAs and DFAs recognize exactly the same class of languages.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.2 (Rabin-Scott, 1959)</div>
    <div class="env-body">
        <p>For every NFA \\(N = (Q, \\Sigma, \\delta_N, q_0, F)\\), there exists a DFA \\(D = (Q', \\Sigma, \\delta_D, q_0', F')\\) such that \\(L(N) = L(D)\\).</p>
    </div>
</div>

<h3>The Construction</h3>

<p>Given NFA \\(N = (Q, \\Sigma, \\delta_N, q_0, F)\\), we build DFA \\(D\\):</p>

<ol>
    <li><strong>States:</strong> \\(Q' = \\mathcal{P}(Q)\\) (all subsets of \\(Q\\)). Each DFA state \\(S \\subseteq Q\\) represents "the NFA might be in any state in \\(S\\)."</li>
    <li><strong>Start state:</strong> \\(q_0' = E(\\{q_0\\})\\) (\\(\\varepsilon\\)-closure of the NFA start state).</li>
    <li><strong>Transition function:</strong> For \\(S \\subseteq Q\\) and \\(a \\in \\Sigma\\),
    \\[\\delta_D(S, a) = E\\!\\left(\\bigcup_{q \\in S} \\delta_N(q, a)\\right).\\]
    Move every NFA state in \\(S\\) on input \\(a\\), then take the \\(\\varepsilon\\)-closure.</li>
    <li><strong>Accept states:</strong> \\(F' = \\{S \\subseteq Q : S \\cap F \\neq \\emptyset\\}\\). A DFA state is accepting if it contains at least one NFA accept state.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Exponential Blowup</div>
    <div class="env-body">
        <p>An NFA with \\(n\\) states can produce a DFA with up to \\(2^n\\) states. In practice, most of these subsets are unreachable. The lazy approach builds only reachable DFA states, which is usually much smaller. However, there exist examples where the blowup is exactly \\(2^n\\), so the worst case is unavoidable.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Subset Construction</div>
    <div class="env-body">
        <p>Consider the NFA for "ends with 01": \\(\\delta(q_0, 0) = \\{q_0, q_1\\}\\), \\(\\delta(q_0, 1) = \\{q_0\\}\\), \\(\\delta(q_1, 1) = \\{q_2\\}\\).</p>
        <p>The DFA states (reachable only):</p>
        <ul>
            <li>\\(\\{q_0\\}\\): start. On 0 \\(\\to \\{q_0, q_1\\}\\); on 1 \\(\\to \\{q_0\\}\\).</li>
            <li>\\(\\{q_0, q_1\\}\\): on 0 \\(\\to \\{q_0, q_1\\}\\); on 1 \\(\\to \\{q_0, q_2\\}\\).</li>
            <li>\\(\\{q_0, q_2\\}\\): accept (contains \\(q_2\\)). On 0 \\(\\to \\{q_0, q_1\\}\\); on 1 \\(\\to \\{q_0\\}\\).</li>
        </ul>
        <p>Three reachable states (out of \\(2^3 = 8\\) possible), and the resulting DFA matches the one we built by hand in the previous section.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-subset-construction"></div>
`,
            visualizations: [
                {
                    id: 'viz-subset-construction',
                    title: 'Subset Construction: NFA to DFA',
                    description: 'Watch the subset construction algorithm build a DFA from an NFA. Each DFA state is a set of NFA states. Step through to see how reachable subsets are discovered.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        // NFA: ends with 01
                        var nfaStates = ['q0','q1','q2'];
                        var nfaTrans = {
                            'q0,0': ['q0','q1'], 'q0,1': ['q0'],
                            'q1,1': ['q2']
                        };
                        var nfaStart = 'q0';
                        var nfaAccept = ['q2'];

                        // Build DFA via subset construction
                        function setKey(s) { return s.slice().sort().join(','); }

                        function buildDFA() {
                            var startSet = [nfaStart];
                            var startKey = setKey(startSet);
                            var dfaStates = [{ key: startKey, states: startSet }];
                            var dfaTrans = {};
                            var queue = [startSet];
                            var visited = {};
                            visited[startKey] = true;

                            while (queue.length > 0) {
                                var current = queue.shift();
                                var currentKey = setKey(current);

                                for (var si = 0; si < 2; si++) {
                                    var sym = si === 0 ? '0' : '1';
                                    var nextStates = {};
                                    for (var i = 0; i < current.length; i++) {
                                        var key = current[i] + ',' + sym;
                                        var dests = nfaTrans[key] || [];
                                        for (var j = 0; j < dests.length; j++) {
                                            nextStates[dests[j]] = true;
                                        }
                                    }
                                    var nextArr = Object.keys(nextStates).sort();
                                    if (nextArr.length === 0) continue;
                                    var nextKey = setKey(nextArr);
                                    dfaTrans[currentKey + '|' + sym] = nextKey;

                                    if (!visited[nextKey]) {
                                        visited[nextKey] = true;
                                        dfaStates.push({ key: nextKey, states: nextArr });
                                        queue.push(nextArr);
                                    }
                                }
                            }

                            var dfaAccept = [];
                            for (var d = 0; d < dfaStates.length; d++) {
                                for (var a = 0; a < nfaAccept.length; a++) {
                                    if (dfaStates[d].states.indexOf(nfaAccept[a]) >= 0) {
                                        dfaAccept.push(dfaStates[d].key);
                                        break;
                                    }
                                }
                            }

                            return { states: dfaStates, transitions: dfaTrans, start: startKey, accept: dfaAccept };
                        }

                        var dfa = buildDFA();
                        var revealStep = 0;
                        var maxSteps = dfa.states.length;

                        VizEngine.createButton(controls, 'Step', function() {
                            if (revealStep < maxSteps) { revealStep++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Show All', function() {
                            revealStep = maxSteps;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            revealStep = 0;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Subset Construction: NFA to DFA', viz.width / 2, 18, viz.colors.white, 14);

                            // NFA side (left)
                            viz.screenText('NFA', 100, 45, viz.colors.teal, 12);
                            var nfaPos = {
                                'q0': { x: 60, y: 120 },
                                'q1': { x: 60, y: 220 },
                                'q2': { x: 60, y: 320 }
                            };
                            var nR = 22;

                            // NFA transitions
                            // q0 --0--> q0 (self), q0 --0--> q1, q0 --1--> q0 (self), q1 --1--> q2
                            // Self-loop q0
                            ctx.strokeStyle = viz.colors.text; ctx.lineWidth = 1.2;
                            ctx.beginPath();
                            ctx.arc(60, 120 - nR - 12, 10, 0.4, Math.PI - 0.4);
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.orange; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.fillText('0,1', 60, 120 - nR - 26);

                            // q0 -> q1
                            ctx.strokeStyle = viz.colors.text;
                            ctx.beginPath(); ctx.moveTo(60, 120 + nR); ctx.lineTo(60, 220 - nR); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.beginPath(); ctx.moveTo(60, 220 - nR);
                            ctx.lineTo(55, 220 - nR - 8); ctx.lineTo(65, 220 - nR - 8);
                            ctx.closePath(); ctx.fill();
                            ctx.fillStyle = viz.colors.orange; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.fillText('0', 68, 170);

                            // q1 -> q2
                            ctx.strokeStyle = viz.colors.text;
                            ctx.beginPath(); ctx.moveTo(60, 220 + nR); ctx.lineTo(60, 320 - nR); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.beginPath(); ctx.moveTo(60, 320 - nR);
                            ctx.lineTo(55, 320 - nR - 8); ctx.lineTo(65, 320 - nR - 8);
                            ctx.closePath(); ctx.fill();
                            ctx.fillStyle = viz.colors.orange; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.fillText('1', 68, 270);

                            // NFA states
                            for (var ns in nfaPos) {
                                var np = nfaPos[ns];
                                var isAcc = nfaAccept.indexOf(ns) >= 0;
                                ctx.fillStyle = viz.colors.bg;
                                ctx.strokeStyle = isAcc ? viz.colors.green : viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(np.x, np.y, nR, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();
                                if (isAcc) {
                                    ctx.beginPath(); ctx.arc(np.x, np.y, nR - 4, 0, Math.PI * 2); ctx.stroke();
                                }
                                if (ns === nfaStart) {
                                    ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 1.5;
                                    ctx.beginPath(); ctx.moveTo(np.x - nR - 20, np.y); ctx.lineTo(np.x - nR - 2, np.y); ctx.stroke();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.beginPath();
                                    ctx.moveTo(np.x - nR, np.y);
                                    ctx.lineTo(np.x - nR - 7, np.y - 4);
                                    ctx.lineTo(np.x - nR - 7, np.y + 4);
                                    ctx.closePath(); ctx.fill();
                                }
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(ns, np.x, np.y);
                            }

                            // Divider
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(140, 40); ctx.lineTo(140, viz.height); ctx.stroke();
                            ctx.setLineDash([]);

                            // DFA side (right)
                            viz.screenText('DFA (subset construction)', 350, 45, viz.colors.blue, 12);

                            if (revealStep === 0) {
                                viz.screenText('Press "Step" to begin construction', 350, viz.height / 2, viz.colors.text, 12);
                                return;
                            }

                            var dfaR = 35;
                            var revealed = dfa.states.slice(0, revealStep);
                            var dfaPos = {};
                            var startX = 250, gapX = 150;
                            for (var di = 0; di < revealed.length; di++) {
                                var col2 = di % 2;
                                var row = Math.floor(di / 2);
                                dfaPos[revealed[di].key] = {
                                    x: startX + col2 * gapX,
                                    y: 110 + row * 120
                                };
                            }

                            // DFA transitions (only between revealed states)
                            for (var tk in dfa.transitions) {
                                var tParts = tk.split('|');
                                var tFrom = tParts[0], tSym = tParts[1];
                                var tTo = dfa.transitions[tk];
                                if (!dfaPos[tFrom] || !dfaPos[tTo]) continue;

                                var dp1 = dfaPos[tFrom], dp2 = dfaPos[tTo];

                                if (tFrom === tTo) {
                                    ctx.strokeStyle = viz.colors.text; ctx.lineWidth = 1.2;
                                    ctx.beginPath();
                                    ctx.arc(dp1.x, dp1.y - dfaR - 12, 12, 0.3, Math.PI - 0.3);
                                    ctx.stroke();
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(tSym, dp1.x, dp1.y - dfaR - 28);
                                    continue;
                                }

                                var ddx = dp2.x - dp1.x, ddy = dp2.y - dp1.y;
                                var ddist = Math.sqrt(ddx * ddx + ddy * ddy);
                                if (ddist < 1) continue;
                                var dux = ddx / ddist, duy = ddy / ddist;

                                // Check reverse
                                var dHasRev = false;
                                for (var drk in dfa.transitions) {
                                    var drp = drk.split('|');
                                    if (drp[0] === tTo && dfa.transitions[drk] === tFrom) { dHasRev = true; break; }
                                }
                                var doff = dHasRev ? 6 : 0;

                                var dsx = dp1.x + dux * dfaR - duy * doff;
                                var dsy = dp1.y + duy * dfaR + dux * doff;
                                var dex = dp2.x - dux * dfaR - duy * doff;
                                var dey = dp2.y - duy * dfaR + dux * doff;

                                ctx.strokeStyle = viz.colors.text; ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.moveTo(dsx, dsy); ctx.lineTo(dex, dey); ctx.stroke();
                                var dangle = Math.atan2(dey - dsy, dex - dsx);
                                ctx.fillStyle = viz.colors.text;
                                ctx.beginPath();
                                ctx.moveTo(dex, dey);
                                ctx.lineTo(dex - 8 * Math.cos(dangle - 0.4), dey - 8 * Math.sin(dangle - 0.4));
                                ctx.lineTo(dex - 8 * Math.cos(dangle + 0.4), dey - 8 * Math.sin(dangle + 0.4));
                                ctx.closePath(); ctx.fill();

                                var dmx = (dsx + dex) / 2, dmy = (dsy + dey) / 2;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(tSym, dmx - duy * 12, dmy + dux * 12);
                            }

                            // DFA states
                            for (var dj = 0; dj < revealed.length; dj++) {
                                var ds = revealed[dj];
                                var dp = dfaPos[ds.key];
                                var dIsAccept = dfa.accept.indexOf(ds.key) >= 0;
                                var dIsNew = dj === revealStep - 1;

                                if (dIsNew) {
                                    ctx.fillStyle = viz.colors.yellow + '22';
                                    ctx.beginPath(); ctx.arc(dp.x, dp.y, dfaR + 6, 0, Math.PI * 2); ctx.fill();
                                }

                                ctx.fillStyle = viz.colors.bg;
                                ctx.strokeStyle = dIsAccept ? viz.colors.green : viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(dp.x, dp.y, dfaR, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();
                                if (dIsAccept) {
                                    ctx.beginPath(); ctx.arc(dp.x, dp.y, dfaR - 5, 0, Math.PI * 2); ctx.stroke();
                                }

                                if (ds.key === dfa.start) {
                                    ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 1.5;
                                    ctx.beginPath(); ctx.moveTo(dp.x - dfaR - 20, dp.y); ctx.lineTo(dp.x - dfaR - 2, dp.y); ctx.stroke();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.beginPath();
                                    ctx.moveTo(dp.x - dfaR, dp.y);
                                    ctx.lineTo(dp.x - dfaR - 8, dp.y - 4);
                                    ctx.lineTo(dp.x - dfaR - 8, dp.y + 4);
                                    ctx.closePath(); ctx.fill();
                                }

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText('{' + ds.states.join(',') + '}', dp.x, dp.y);
                            }

                            viz.screenText('Step ' + revealStep + '/' + maxSteps, viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Apply the subset construction to the NFA with states \\(\\{p, q\\}\\), start state \\(p\\), accept state \\(\\{q\\}\\), and transitions \\(\\delta(p, 0) = \\{p, q\\}\\), \\(\\delta(p, 1) = \\{p\\}\\), \\(\\delta(q, 0) = \\emptyset\\), \\(\\delta(q, 1) = \\{q\\}\\). List all reachable DFA states and the transition table.',
                    hint: 'Start with \\(\\{p\\}\\). Compute transitions on 0 and 1. Add any new subset to the worklist.',
                    solution: 'Start: \\(\\{p\\}\\). On 0: \\(\\{p,q\\}\\), on 1: \\(\\{p\\}\\). From \\(\\{p,q\\}\\): on 0: \\(\\{p,q\\}\\) (union of \\(\\{p,q\\}\\) and \\(\\emptyset\\)), on 1: \\(\\{p,q\\}\\) (union of \\(\\{p\\}\\) and \\(\\{q\\}\\)). Reachable states: \\(\\{p\\}\\) and \\(\\{p,q\\}\\). Accept states: \\(\\{p,q\\}\\) (contains \\(q\\)). This DFA accepts strings containing at least one 0.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Regular Expressions
        // ================================================================
        {
            id: 'sec-regular',
            title: 'Regular Expressions',
            content: `
<h2>Regular Expressions</h2>

<div class="env-block intuition">
    <div class="env-title">Patterns as Algebra</div>
    <div class="env-body">
        <p>Finite automata describe languages through <em>machines</em>. Regular expressions describe the same languages through <em>algebraic patterns</em>. The expression <code>(0|1)*01</code> means "any sequence of 0s and 1s, followed by 01" and describes exactly the language of strings ending in 01. The equivalence between these two viewpoints is one of the most elegant results in computer science.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Regular Expression)</div>
    <div class="env-body">
        <p>A <strong>regular expression</strong> over alphabet \\(\\Sigma\\) is defined recursively:</p>
        <ul>
            <li><strong>Base cases:</strong> \\(\\emptyset\\) (matches nothing), \\(\\varepsilon\\) (matches the empty string), \\(a\\) for each \\(a \\in \\Sigma\\) (matches the single symbol \\(a\\)).</li>
            <li><strong>Inductive cases:</strong> If \\(R\\) and \\(S\\) are regular expressions, then so are:
                <ul>
                    <li>\\((R \\mid S)\\) or \\((R + S)\\): <strong>union</strong>; matches anything \\(R\\) or \\(S\\) matches.</li>
                    <li>\\((RS)\\): <strong>concatenation</strong>; matches a string from \\(R\\) followed by a string from \\(S\\).</li>
                    <li>\\((R^*)\\): <strong>Kleene star</strong>; matches zero or more repetitions of \\(R\\).</li>
                </ul>
            </li>
        </ul>
        <p>The shorthand \\(R^+ = RR^*\\) means "one or more repetitions."</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <ul>
            <li>\\(0^*10^*\\): exactly one 1, surrounded by any number of 0s.</li>
            <li>\\((0 \\mid 1)^*\\): all binary strings (including \\(\\varepsilon\\)).</li>
            <li>\\((0 \\mid 1)^*01\\): binary strings ending in 01.</li>
            <li>\\(0^*1^*\\): any number of 0s followed by any number of 1s (e.g., 0001111, 00, 111, \\(\\varepsilon\\)).</li>
        </ul>
    </div>
</div>

<h3>Equivalence with Finite Automata</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.3 (Kleene's Theorem, 1956)</div>
    <div class="env-body">
        <p>A language is regular (recognized by a DFA/NFA) if and only if it can be described by a regular expression.</p>
    </div>
</div>

<p>The proof has two directions:</p>
<ol>
    <li><strong>Regex \\(\\to\\) NFA:</strong> Thompson's construction converts any regex into an equivalent NFA with \\(\\varepsilon\\)-transitions. Each operator (union, concatenation, star) has a simple NFA building block.</li>
    <li><strong>DFA \\(\\to\\) Regex:</strong> State elimination systematically removes states from the DFA, accumulating regex labels on the remaining edges until a single expression remains.</li>
</ol>

<h3>Thompson's Construction</h3>

<p>Thompson's construction builds an NFA from a regex bottom-up. Each sub-NFA has exactly one start state and one accept state:</p>

<ul>
    <li><strong>Symbol \\(a\\):</strong> Two states, one transition labeled \\(a\\).</li>
    <li><strong>Union \\(R \\mid S\\):</strong> New start state with \\(\\varepsilon\\)-transitions to the starts of \\(R\\) and \\(S\\); their accept states have \\(\\varepsilon\\)-transitions to a new accept state.</li>
    <li><strong>Concatenation \\(RS\\):</strong> Merge \\(R\\)'s accept state with \\(S\\)'s start state.</li>
    <li><strong>Star \\(R^*\\):</strong> New start/accept state with \\(\\varepsilon\\)-transitions to/from \\(R\\), plus an \\(\\varepsilon\\)-transition from \\(R\\)'s accept state back to \\(R\\)'s start state.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-regex-to-nfa"></div>
`,
            visualizations: [
                {
                    id: 'viz-regex-to-nfa',
                    title: 'Regex to NFA (Thompson\'s Construction)',
                    description: 'Enter a regular expression and see the NFA built by Thompson\'s construction. Supported operators: | (union), * (star), + (one or more), concatenation (implicit). Symbols: 0, 1, a, b.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var regexStr = '(0|1)*01';

                        var inp = document.createElement('input');
                        inp.type = 'text'; inp.value = regexStr;
                        inp.style.cssText = 'width:160px;padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.82rem;font-family:monospace;margin-right:6px;';
                        inp.placeholder = 'Regex';
                        controls.appendChild(inp);

                        VizEngine.createButton(controls, 'Build NFA', function() {
                            regexStr = inp.value;
                            draw();
                        });

                        // Simple regex parser for Thompson's construction
                        function parseRegex(str) {
                            var pos = 0;
                            function peek() { return pos < str.length ? str[pos] : null; }
                            function eat(ch) { if (peek() === ch) pos++; else throw new Error('Expected ' + ch); }

                            function parseExpr() {
                                var left = parseTerm();
                                while (peek() === '|') {
                                    eat('|');
                                    var right = parseTerm();
                                    left = { type: 'union', left: left, right: right };
                                }
                                return left;
                            }

                            function parseTerm() {
                                var factors = [];
                                while (peek() !== null && peek() !== ')' && peek() !== '|') {
                                    factors.push(parseFactor());
                                }
                                if (factors.length === 0) return { type: 'epsilon' };
                                var result = factors[0];
                                for (var i = 1; i < factors.length; i++) {
                                    result = { type: 'concat', left: result, right: factors[i] };
                                }
                                return result;
                            }

                            function parseFactor() {
                                var base = parseBase();
                                while (peek() === '*' || peek() === '+') {
                                    if (peek() === '*') { eat('*'); base = { type: 'star', child: base }; }
                                    else { eat('+'); base = { type: 'concat', left: base, right: { type: 'star', child: base } }; }
                                }
                                return base;
                            }

                            function parseBase() {
                                if (peek() === '(') {
                                    eat('(');
                                    var expr = parseExpr();
                                    eat(')');
                                    return expr;
                                }
                                var ch = peek();
                                if (ch && ch !== ')' && ch !== '|' && ch !== '*' && ch !== '+') {
                                    pos++;
                                    return { type: 'symbol', value: ch };
                                }
                                return { type: 'epsilon' };
                            }

                            var result = parseExpr();
                            return result;
                        }

                        // Build NFA from AST
                        function buildNFA(ast) {
                            var stateCount = 0;
                            function newState() { return 's' + (stateCount++); }

                            function build(node) {
                                if (node.type === 'symbol') {
                                    var s = newState(), e = newState();
                                    return { start: s, accept: e, trans: [{ from: s, to: e, label: node.value }] };
                                }
                                if (node.type === 'epsilon') {
                                    var s2 = newState(), e2 = newState();
                                    return { start: s2, accept: e2, trans: [{ from: s2, to: e2, label: '\u03B5' }] };
                                }
                                if (node.type === 'concat') {
                                    var left = build(node.left), right = build(node.right);
                                    var trans = left.trans.concat(right.trans);
                                    trans.push({ from: left.accept, to: right.start, label: '\u03B5' });
                                    return { start: left.start, accept: right.accept, trans: trans };
                                }
                                if (node.type === 'union') {
                                    var s3 = newState(), e3 = newState();
                                    var l = build(node.left), r = build(node.right);
                                    var trans2 = l.trans.concat(r.trans);
                                    trans2.push({ from: s3, to: l.start, label: '\u03B5' });
                                    trans2.push({ from: s3, to: r.start, label: '\u03B5' });
                                    trans2.push({ from: l.accept, to: e3, label: '\u03B5' });
                                    trans2.push({ from: r.accept, to: e3, label: '\u03B5' });
                                    return { start: s3, accept: e3, trans: trans2 };
                                }
                                if (node.type === 'star') {
                                    var s4 = newState(), e4 = newState();
                                    var child = build(node.child);
                                    var trans3 = child.trans.slice();
                                    trans3.push({ from: s4, to: child.start, label: '\u03B5' });
                                    trans3.push({ from: child.accept, to: e4, label: '\u03B5' });
                                    trans3.push({ from: child.accept, to: child.start, label: '\u03B5' });
                                    trans3.push({ from: s4, to: e4, label: '\u03B5' });
                                    return { start: s4, accept: e4, trans: trans3 };
                                }
                                return { start: newState(), accept: newState(), trans: [] };
                            }

                            return build(ast);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Thompson\'s Construction', viz.width / 2, 18, viz.colors.white, 14);

                            var ast, nfa;
                            try {
                                ast = parseRegex(regexStr);
                                nfa = buildNFA(ast);
                            } catch (e) {
                                viz.screenText('Parse error: ' + e.message, viz.width / 2, viz.height / 2, viz.colors.red, 14);
                                return;
                            }

                            viz.screenText('Regex: ' + regexStr, viz.width / 2, 40, viz.colors.orange, 12);

                            // Collect all states
                            var allStates = {};
                            allStates[nfa.start] = true;
                            allStates[nfa.accept] = true;
                            for (var i = 0; i < nfa.trans.length; i++) {
                                allStates[nfa.trans[i].from] = true;
                                allStates[nfa.trans[i].to] = true;
                            }
                            var stateArr = Object.keys(allStates);
                            var n = stateArr.length;

                            // Layout states in rows
                            var cols = Math.min(8, n);
                            var rows = Math.ceil(n / cols);
                            var gapX = Math.min(60, (viz.width - 60) / cols);
                            var gapY = Math.min(55, (viz.height - 120) / rows);
                            var baseX = (viz.width - (cols - 1) * gapX) / 2;
                            var baseY = 80;

                            var sPos = {};
                            for (var si = 0; si < n; si++) {
                                var col = si % cols;
                                var row = Math.floor(si / cols);
                                sPos[stateArr[si]] = { x: baseX + col * gapX, y: baseY + row * gapY };
                            }

                            // Draw transitions
                            for (var ti = 0; ti < nfa.trans.length; ti++) {
                                var tr = nfa.trans[ti];
                                var p1 = sPos[tr.from], p2 = sPos[tr.to];
                                if (!p1 || !p2) continue;

                                var isEps = tr.label === '\u03B5';
                                var dx = p2.x - p1.x, dy = p2.y - p1.y;
                                var dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist < 1) continue;
                                var ux = dx / dist, uy = dy / dist;
                                var sr = 12;
                                var sx = p1.x + ux * sr, sy = p1.y + uy * sr;
                                var ex = p2.x - ux * sr, ey = p2.y - uy * sr;

                                ctx.strokeStyle = isEps ? viz.colors.purple : viz.colors.teal;
                                ctx.lineWidth = 1.2;
                                if (isEps) ctx.setLineDash([3, 2]);
                                ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
                                if (isEps) ctx.setLineDash([]);

                                var angle = Math.atan2(ey - sy, ex - sx);
                                ctx.fillStyle = isEps ? viz.colors.purple : viz.colors.teal;
                                ctx.beginPath();
                                ctx.moveTo(ex, ey);
                                ctx.lineTo(ex - 7 * Math.cos(angle - 0.4), ey - 7 * Math.sin(angle - 0.4));
                                ctx.lineTo(ex - 7 * Math.cos(angle + 0.4), ey - 7 * Math.sin(angle + 0.4));
                                ctx.closePath(); ctx.fill();

                                var mx = (sx + ex) / 2, my = (sy + ey) / 2;
                                ctx.fillStyle = isEps ? viz.colors.purple : viz.colors.orange;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                ctx.fillText(tr.label, mx - uy * 8, my + ux * 8 - 2);
                            }

                            // Draw states
                            for (var sj = 0; sj < n; sj++) {
                                var st = stateArr[sj];
                                var p = sPos[st];
                                var isStart = st === nfa.start;
                                var isAcceptSt = st === nfa.accept;

                                ctx.fillStyle = viz.colors.bg;
                                ctx.strokeStyle = isAcceptSt ? viz.colors.green : (isStart ? viz.colors.yellow : viz.colors.blue);
                                ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();

                                if (isAcceptSt) {
                                    ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, Math.PI * 2); ctx.stroke();
                                }

                                if (isStart) {
                                    ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 1.2;
                                    ctx.beginPath(); ctx.moveTo(p.x - 12 - 14, p.y); ctx.lineTo(p.x - 12 - 2, p.y); ctx.stroke();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.beginPath();
                                    ctx.moveTo(p.x - 12, p.y);
                                    ctx.lineTo(p.x - 12 - 6, p.y - 3);
                                    ctx.lineTo(p.x - 12 - 6, p.y + 3);
                                    ctx.closePath(); ctx.fill();
                                }

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(st, p.x, p.y);
                            }

                            viz.screenText(n + ' states, ' + nfa.trans.length + ' transitions', viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write a regular expression for the language of all binary strings that contain at least two consecutive 0s.',
                    hint: 'The string can have anything before and after the "00" pattern.',
                    solution: '\\((0 \\mid 1)^* 00 (0 \\mid 1)^*\\). This matches any binary string (possibly empty prefix), followed by 00, followed by any binary string (possibly empty suffix).'
                },
                {
                    question: 'Are the regular expressions \\(0^*(0 \\mid 1)1^*\\) and \\(0^*01^* \\mid 0^*11^*\\) equivalent? Prove or give a counterexample.',
                    hint: 'Try to find a string matched by one but not the other, or argue that the union distributes.',
                    solution: 'Yes, they are equivalent. The expression \\(0^*(0 \\mid 1)1^*\\) matches strings of the form \\(0^i \\cdot c \\cdot 1^j\\) where \\(c \\in \\{0,1\\}\\). If \\(c = 0\\), we get \\(0^*01^*\\); if \\(c = 1\\), we get \\(0^*11^*\\). So the first expression equals the union of these two cases, which is exactly the second expression.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: The Pumping Lemma
        // ================================================================
        {
            id: 'sec-pumping',
            title: 'The Pumping Lemma',
            content: `
<h2>The Pumping Lemma</h2>

<div class="env-block intuition">
    <div class="env-title">Pigeonhole for Automata</div>
    <div class="env-body">
        <p>A DFA has finitely many states, say \\(p\\). If it reads a string of length \\(\\geq p\\), by the pigeonhole principle some state must be visited twice. The substring consumed between these two visits forms a <strong>loop</strong> that can be "pumped" (repeated any number of times) while keeping the string in the language. If a language has strings that <em>cannot</em> be pumped, it cannot be regular.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.4 (Pumping Lemma for Regular Languages)</div>
    <div class="env-body">
        <p>If \\(L\\) is a regular language, then there exists a constant \\(p \\geq 1\\) (the <strong>pumping length</strong>) such that every string \\(s \\in L\\) with \\(|s| \\geq p\\) can be written as \\(s = xyz\\) where:</p>
        <ol>
            <li>\\(|y| > 0\\) (the pump is nonempty),</li>
            <li>\\(|xy| \\leq p\\) (the pump occurs within the first \\(p\\) characters),</li>
            <li>\\(xy^i z \\in L\\) for all \\(i \\geq 0\\) (pumping up or down preserves membership).</li>
        </ol>
    </div>
</div>

<h3>Using the Pumping Lemma</h3>

<p>The pumping lemma is used to prove that a language is <strong>not</strong> regular, via proof by contradiction:</p>

<ol>
    <li>Assume \\(L\\) is regular.</li>
    <li>Then there exists a pumping length \\(p\\).</li>
    <li>Choose a specific string \\(s \\in L\\) with \\(|s| \\geq p\\) (the adversary game: you pick the string).</li>
    <li>For <em>every</em> possible decomposition \\(s = xyz\\) satisfying conditions 1 and 2, show that there exists some \\(i\\) such that \\(xy^iz \\notin L\\).</li>
    <li>Contradiction: \\(L\\) is not regular.</li>
</ol>

<div class="env-block example">
    <div class="env-title">Example: \\(\\{0^n1^n : n \\geq 0\\}\\) Is Not Regular</div>
    <div class="env-body">
        <p>Let \\(L = \\{0^n 1^n : n \\geq 0\\}\\). Suppose \\(L\\) is regular with pumping length \\(p\\). Choose \\(s = 0^p 1^p \\in L\\).</p>
        <p>Any decomposition \\(s = xyz\\) with \\(|xy| \\leq p\\) means \\(y = 0^k\\) for some \\(k \\geq 1\\) (since \\(xy\\) lies entirely within the 0s).</p>
        <p>Pump with \\(i = 2\\): \\(xy^2z = 0^{p+k}1^p\\). Since \\(k \\geq 1\\), we have more 0s than 1s, so \\(xy^2z \\notin L\\). Contradiction.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: \\(\\{ww : w \\in \\{0,1\\}^*\\}\\) Is Not Regular</div>
    <div class="env-body">
        <p>Let \\(L = \\{ww : w \\in \\{0,1\\}^*\\}\\). Choose \\(s = 0^p 1 0^p 1 \\in L\\). With \\(|xy| \\leq p\\), we have \\(y = 0^k\\). Pumping to \\(i = 0\\): \\(xz = 0^{p-k}10^p1\\). For this to be in \\(L\\), we would need the first half to equal the second half, but \\(p - k \\neq p\\). Contradiction.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Common Pitfall</div>
    <div class="env-body">
        <p>The pumping lemma is a <strong>necessary</strong> condition for regularity, not a sufficient one. Some non-regular languages satisfy the pumping lemma's conditions. Also remember: <em>you</em> choose the string \\(s\\), but the <em>adversary</em> chooses the decomposition \\(xyz\\). You must show that pumping fails for <em>all</em> valid decompositions.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-pumping-lemma"></div>
`,
            visualizations: [
                {
                    id: 'viz-pumping-lemma',
                    title: 'Pumping Lemma Explorer',
                    description: 'Explore the pumping lemma for the language \\(\\{0^n1^n\\}\\). Set the pumping length \\(p\\), choose the decomposition \\(xyz\\), and see what happens when you pump \\(y\\) different numbers of times.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var p = 4;
                        var k = 2; // |y| = k, y is 0^k within first p chars
                        var pumpI = 0;

                        VizEngine.createSlider(controls, 'p', 2, 8, p, 1, function(v) {
                            p = Math.round(v);
                            if (k > p) k = p;
                            draw();
                        });
                        VizEngine.createSlider(controls, '|y|', 1, 4, k, 1, function(v) {
                            k = Math.min(Math.round(v), p);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'pump i', 0, 5, pumpI, 1, function(v) {
                            pumpI = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Pumping Lemma: L = {0\u207F1\u207F}', viz.width / 2, 20, viz.colors.white, 14);

                            // Original string s = 0^p 1^p
                            var origStr = '';
                            for (var a = 0; a < p; a++) origStr += '0';
                            for (var b = 0; b < p; b++) origStr += '1';

                            viz.screenText('Original string s = 0' + superscript(p) + '1' + superscript(p) + '  (|s| = ' + (2 * p) + ')', viz.width / 2, 50, viz.colors.text, 12);

                            // Decomposition: x = 0^j, y = 0^k, z = 0^(p-j-k) 1^p
                            // For simplicity, j = 0 (x is empty at the start)
                            var j = 0; // offset for x (we keep x as first j zeros)
                            // Actually let j = p - k - remaining to make it simple
                            // x = first (p-k) zeros, y = next k zeros, z = remaining
                            // Actually: |xy| <= p, so x = 0^(p-k-j) ... let's just do j=0
                            // x = empty, y = 0^k, z = 0^(p-k) 1^p
                            var xLen = 0;
                            var yLen = Math.min(k, p);
                            var zZeros = p - yLen;

                            // Pumped string: x y^i z
                            var pumped = '';
                            for (var c = 0; c < xLen; c++) pumped += '0';
                            for (var d = 0; d < pumpI; d++) {
                                for (var e = 0; e < yLen; e++) pumped += '0';
                            }
                            for (var f = 0; f < zZeros; f++) pumped += '0';
                            for (var g = 0; g < p; g++) pumped += '1';

                            var numZeros = xLen + pumpI * yLen + zZeros;
                            var numOnes = p;

                            // Draw original string with color coding
                            var strY = 90;
                            var charW = Math.min(20, (viz.width - 60) / origStr.length);
                            var strStart = (viz.width - origStr.length * charW) / 2;

                            viz.screenText('Decomposition s = xyz:', 80, strY, viz.colors.text, 11, 'left');
                            strY += 25;

                            // x part
                            ctx.fillStyle = viz.colors.blue + '33';
                            if (xLen > 0) ctx.fillRect(strStart, strY - 12, xLen * charW, 26);

                            // y part
                            ctx.fillStyle = viz.colors.orange + '33';
                            ctx.fillRect(strStart + xLen * charW, strY - 12, yLen * charW, 26);

                            // z part
                            ctx.fillStyle = viz.colors.teal + '33';
                            ctx.fillRect(strStart + (xLen + yLen) * charW, strY - 12, (origStr.length - xLen - yLen) * charW, 26);

                            for (var h = 0; h < origStr.length; h++) {
                                var cx2 = strStart + h * charW + charW / 2;
                                var color;
                                if (h < xLen) color = viz.colors.blue;
                                else if (h < xLen + yLen) color = viz.colors.orange;
                                else color = viz.colors.teal;
                                ctx.fillStyle = color;
                                ctx.font = 'bold 14px monospace';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(origStr[h], cx2, strY);
                            }

                            // Labels
                            strY += 20;
                            if (xLen > 0) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('x', strStart + xLen * charW / 2, strY);
                            }
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('y = 0' + superscript(yLen), strStart + (xLen + yLen / 2) * charW, strY);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('z', strStart + (xLen + yLen + (origStr.length - xLen - yLen) / 2) * charW, strY);

                            // Pumped string
                            strY += 40;
                            viz.screenText('Pumped: xy' + superscript(pumpI) + 'z', 80, strY, viz.colors.white, 12, 'left');
                            strY += 25;

                            var pCharW = Math.min(16, (viz.width - 60) / Math.max(pumped.length, 1));
                            var pStart = (viz.width - pumped.length * pCharW) / 2;

                            for (var m = 0; m < pumped.length; m++) {
                                var pcx = pStart + m * pCharW + pCharW / 2;
                                ctx.fillStyle = pumped[m] === '0' ? viz.colors.blue : viz.colors.green;
                                ctx.font = 'bold 13px monospace';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(pumped[m], pcx, strY);
                            }

                            // Analysis
                            strY += 35;
                            viz.screenText('Number of 0s: ' + numZeros + '    Number of 1s: ' + numOnes, viz.width / 2, strY, viz.colors.text, 12);

                            strY += 25;
                            var inLanguage = numZeros === numOnes;
                            if (inLanguage) {
                                viz.screenText('0\u207F1\u207F with n = ' + numZeros + '  \u2714 IN the language', viz.width / 2, strY, viz.colors.green, 13);
                            } else {
                                viz.screenText(numZeros + ' zeros \u2260 ' + numOnes + ' ones  \u2718 NOT in the language', viz.width / 2, strY, viz.colors.red, 13);
                            }

                            strY += 30;
                            if (pumpI !== 1 && !inLanguage) {
                                viz.screenText('Pumping breaks the language! \u2192 {0\u207F1\u207F} is NOT regular', viz.width / 2, strY, viz.colors.yellow, 12);
                            } else if (pumpI === 1) {
                                viz.screenText('i = 1 gives the original string (always works)', viz.width / 2, strY, viz.colors.text, 11);
                            }
                        }

                        function superscript(n) {
                            var supers = {0:'\u2070',1:'\u00B9',2:'\u00B2',3:'\u00B3',4:'\u2074',5:'\u2075',6:'\u2076',7:'\u2077',8:'\u2078',9:'\u2079'};
                            var s = n.toString();
                            var result = '';
                            for (var i = 0; i < s.length; i++) result += supers[parseInt(s[i])];
                            return result;
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the pumping lemma to prove that \\(L = \\{0^{n^2} : n \\geq 0\\}\\) (strings of 0s whose length is a perfect square) is not regular.',
                    hint: 'Choose \\(s = 0^{p^2}\\). After pumping, the new length must still be a perfect square. Show that the gap between consecutive squares is too large.',
                    solution: 'Assume \\(L\\) is regular with pumping length \\(p\\). Choose \\(s = 0^{p^2}\\). Write \\(s = xyz\\) with \\(|y| = k\\), \\(1 \\leq k \\leq p\\). Pumping to \\(i=2\\): \\(|xy^2z| = p^2 + k\\). We need \\(p^2 < p^2 + k \\leq p^2 + p\\). But the next perfect square after \\(p^2\\) is \\((p+1)^2 = p^2 + 2p + 1 > p^2 + p \\geq p^2 + k\\). So \\(p^2 + k\\) is not a perfect square. Contradiction.'
                },
                {
                    question: 'Is the language \\(L = \\{w \\in \\{0,1\\}^* : w \\text{ has equal numbers of 0s and 1s}\\}\\) regular? Prove your answer.',
                    hint: 'Consider what strings this language contains and try the pumping lemma.',
                    solution: 'Not regular. Suppose it is, with pumping length \\(p\\). Choose \\(s = 0^p 1^p \\in L\\). Any decomposition with \\(|xy| \\leq p\\) gives \\(y = 0^k\\), \\(k \\geq 1\\). Pumping to \\(i = 0\\): \\(xz = 0^{p-k}1^p\\), which has \\(p - k\\) zeros and \\(p\\) ones. Since \\(k \\geq 1\\), these are unequal, so \\(xz \\notin L\\). Contradiction.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Looking Ahead
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead</h2>

<div class="env-block intuition">
    <div class="env-title">Beyond Finite Memory</div>
    <div class="env-body">
        <p>We have seen that finite automata are surprisingly powerful (handling pattern matching, lexical analysis, and protocol verification) yet fundamentally limited (unable to count, match brackets, or recognize palindromes). What comes next in the hierarchy of computational models?</p>
    </div>
</div>

<h3>What We Have Established</h3>

<p>This chapter proved several deep results:</p>

<ol>
    <li><strong>DFA = NFA:</strong> Nondeterminism does not add recognition power (Theorem 18.2), though it can make machines exponentially more concise.</li>
    <li><strong>DFA = Regex:</strong> Kleene's theorem (Theorem 18.3) connects the machine model to the algebraic pattern language.</li>
    <li><strong>Regular languages have limits:</strong> The pumping lemma (Theorem 18.4) gives us a tool to prove that certain languages require more than finite memory.</li>
</ol>

<h3>The Closure Properties</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.5 (Closure Properties of Regular Languages)</div>
    <div class="env-body">
        <p>The class of regular languages is closed under:</p>
        <ul>
            <li><strong>Union:</strong> If \\(L_1, L_2\\) are regular, so is \\(L_1 \\cup L_2\\).</li>
            <li><strong>Concatenation:</strong> If \\(L_1, L_2\\) are regular, so is \\(L_1 L_2\\).</li>
            <li><strong>Kleene star:</strong> If \\(L\\) is regular, so is \\(L^*\\).</li>
            <li><strong>Complement:</strong> If \\(L\\) is regular, so is \\(\\overline{L} = \\Sigma^* \\setminus L\\).</li>
            <li><strong>Intersection:</strong> If \\(L_1, L_2\\) are regular, so is \\(L_1 \\cap L_2\\).</li>
        </ul>
    </div>
</div>

<p>The closure under complement is particularly elegant: simply swap the accept and non-accept states of a DFA. Closure under intersection follows from De Morgan's law: \\(L_1 \\cap L_2 = \\overline{\\overline{L_1} \\cup \\overline{L_2}}\\).</p>

<h3>State Minimization</h3>

<p>Every regular language has a <strong>unique minimal DFA</strong> (up to renaming of states). This minimal DFA has the fewest states of any DFA recognizing the language. The <strong>Myhill-Nerode theorem</strong> characterizes when two strings are "indistinguishable" by a language, and the number of equivalence classes gives the number of states in the minimal DFA.</p>

<div class="viz-placeholder" data-viz="viz-state-minimization"></div>

<h3>What Comes Next: Pushdown Automata</h3>

<p>The next level in the Chomsky hierarchy adds a <strong>stack</strong> to the finite automaton. This gives <strong>pushdown automata (PDA)</strong>, which recognize <strong>context-free languages</strong>. A PDA can push and pop symbols from an unbounded stack, enabling it to:</p>

<ul>
    <li>Match brackets: \\(\\{0^n 1^n\\}\\)</li>
    <li>Recognize palindromes: \\(\\{w w^R\\}\\)</li>
    <li>Parse programming language grammars</li>
</ul>

<p>But PDAs have their own limits. They cannot recognize \\(\\{0^n 1^n 0^n\\}\\) or \\(\\{ww\\}\\). For those, we need the full power of <strong>Turing machines</strong>, the subject of computability theory.</p>

<div class="env-block remark">
    <div class="env-title">The Practical Impact</div>
    <div class="env-body">
        <p>Regular expressions power <code>grep</code>, <code>sed</code>, lexical analyzers, network intrusion detection, and DNA sequence matching. The theory we developed in this chapter is not just beautiful mathematics; it is the foundation of tools used by millions of programmers daily. Understanding what regular languages can and cannot do helps you choose the right tool: regex for tokenization, CFGs for parsing, and general-purpose code when the pattern is too complex for either.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-automaton-gallery"></div>
`,
            visualizations: [
                {
                    id: 'viz-state-minimization',
                    title: 'DFA State Minimization',
                    description: 'Watch the table-filling algorithm minimize a DFA by identifying and merging equivalent states. States that are "distinguishable" (one accepts, the other does not, or they disagree on some input) are marked; the remaining unmarked pairs can be merged.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Example DFA with redundant states
                        var states = ['A','B','C','D','E'];
                        var trans = {
                            'A,0':'B', 'A,1':'C',
                            'B,0':'D', 'B,1':'E',
                            'C,0':'D', 'C,1':'E',
                            'D,0':'D', 'D,1':'E',
                            'E,0':'D', 'E,1':'E'
                        };
                        var accept = ['D','E'];
                        var start = 'A';

                        var step = 0;
                        // Table-filling algorithm
                        var n = states.length;
                        var marked = {};

                        function pairKey(i, j) {
                            return Math.min(i, j) + ',' + Math.max(i, j);
                        }

                        function computeSteps() {
                            marked = {};
                            var steps = [];

                            // Step 0: mark pairs where one is accept, other is not
                            var initial = [];
                            for (var i = 0; i < n; i++) {
                                for (var j = i + 1; j < n; j++) {
                                    var ai = accept.indexOf(states[i]) >= 0;
                                    var aj = accept.indexOf(states[j]) >= 0;
                                    if (ai !== aj) {
                                        marked[pairKey(i, j)] = true;
                                        initial.push(pairKey(i, j));
                                    }
                                }
                            }
                            steps.push({ desc: 'Mark accept/non-accept pairs', marked: Object.assign({}, marked), newMarked: initial });

                            // Iterate until no new marks
                            var changed = true;
                            while (changed) {
                                changed = false;
                                var newM = [];
                                for (var i2 = 0; i2 < n; i2++) {
                                    for (var j2 = i2 + 1; j2 < n; j2++) {
                                        var pk = pairKey(i2, j2);
                                        if (marked[pk]) continue;
                                        for (var si = 0; si < 2; si++) {
                                            var sym = si === 0 ? '0' : '1';
                                            var ti = states.indexOf(trans[states[i2] + ',' + sym]);
                                            var tj = states.indexOf(trans[states[j2] + ',' + sym]);
                                            if (ti !== tj && marked[pairKey(ti, tj)]) {
                                                marked[pk] = true;
                                                newM.push(pk);
                                                changed = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (newM.length > 0) {
                                    steps.push({ desc: 'Propagate distinguishability', marked: Object.assign({}, marked), newMarked: newM });
                                }
                            }

                            // Final: identify equivalent pairs
                            var equiv = [];
                            for (var i3 = 0; i3 < n; i3++) {
                                for (var j3 = i3 + 1; j3 < n; j3++) {
                                    if (!marked[pairKey(i3, j3)]) {
                                        equiv.push(states[i3] + ' \u2261 ' + states[j3]);
                                    }
                                }
                            }
                            steps.push({ desc: 'Equivalent pairs: ' + (equiv.length > 0 ? equiv.join(', ') : 'none'), marked: Object.assign({}, marked), newMarked: [], equiv: equiv });

                            return steps;
                        }

                        var allSteps = computeSteps();

                        VizEngine.createButton(controls, 'Step', function() {
                            if (step < allSteps.length - 1) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('DFA State Minimization (Table-Filling)', viz.width / 2, 18, viz.colors.white, 14);

                            var currentStep = allSteps[Math.min(step, allSteps.length - 1)];

                            // Draw the distinguishability table
                            var cellSize = 40;
                            var tableX = (viz.width - (n - 1) * cellSize) / 2;
                            var tableY = 70;

                            // Column headers (top)
                            for (var c = 0; c < n - 1; c++) {
                                ctx.fillStyle = accept.indexOf(states[c]) >= 0 ? viz.colors.green : viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                ctx.fillText(states[c], tableX + c * cellSize + cellSize / 2, tableY - 4);
                            }

                            // Row headers (left)
                            for (var r = 1; r < n; r++) {
                                ctx.fillStyle = accept.indexOf(states[r]) >= 0 ? viz.colors.green : viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(states[r], tableX - 8, tableY + (r - 1) * cellSize + cellSize / 2);
                            }

                            // Table cells
                            for (var r2 = 1; r2 < n; r2++) {
                                for (var c2 = 0; c2 < r2; c2++) {
                                    var cx2 = tableX + c2 * cellSize;
                                    var cy2 = tableY + (r2 - 1) * cellSize;
                                    var pk = pairKey(c2, r2);

                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx2, cy2, cellSize, cellSize);

                                    if (currentStep.marked[pk]) {
                                        var isNew = currentStep.newMarked.indexOf(pk) >= 0;
                                        ctx.fillStyle = isNew ? viz.colors.red + '44' : viz.colors.red + '22';
                                        ctx.fillRect(cx2 + 1, cy2 + 1, cellSize - 2, cellSize - 2);
                                        ctx.fillStyle = isNew ? viz.colors.red : viz.colors.text;
                                        ctx.font = 'bold 16px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText('\u2717', cx2 + cellSize / 2, cy2 + cellSize / 2);
                                    } else if (step === allSteps.length - 1) {
                                        ctx.fillStyle = viz.colors.green + '22';
                                        ctx.fillRect(cx2 + 1, cy2 + 1, cellSize - 2, cellSize - 2);
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.font = 'bold 16px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText('\u2261', cx2 + cellSize / 2, cy2 + cellSize / 2);
                                    }
                                }
                            }

                            // Description
                            var descY = tableY + (n - 1) * cellSize + 30;
                            viz.screenText('Step ' + (step + 1) + '/' + allSteps.length + ': ' + currentStep.desc, viz.width / 2, descY, viz.colors.yellow, 12);

                            // Legend
                            descY += 25;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Accept states: ' + accept.join(', ') + '   |   Start: ' + start, viz.width / 2, descY);

                            if (step === allSteps.length - 1 && currentStep.equiv && currentStep.equiv.length > 0) {
                                descY += 22;
                                viz.screenText('Merge: ' + currentStep.equiv.join(', ') + '  \u2192  Minimal DFA has ' + (n - currentStep.equiv.length) + ' states', viz.width / 2, descY, viz.colors.green, 12);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-automaton-gallery',
                    title: 'Automaton Gallery',
                    description: 'Browse a gallery of DFAs for common languages: binary divisibility, substring matching, and more. Select a language to see its minimal DFA.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var gallery = {
                            'Div by 2 (binary)': {
                                states: ['even','odd'],
                                trans: { 'even,0':'even', 'even,1':'odd', 'odd,0':'even', 'odd,1':'odd' },
                                start: 'even', accept: ['even'],
                                desc: 'Accepts binary numbers divisible by 2 (last bit = 0)'
                            },
                            'Div by 3 (binary)': {
                                states: ['r0','r1','r2'],
                                trans: {
                                    'r0,0':'r0', 'r0,1':'r1',
                                    'r1,0':'r2', 'r1,1':'r0',
                                    'r2,0':'r1', 'r2,1':'r2'
                                },
                                start: 'r0', accept: ['r0'],
                                desc: 'Tracks value mod 3 as bits are read left-to-right'
                            },
                            'Even 0s and Even 1s': {
                                states: ['ee','eo','oe','oo'],
                                trans: {
                                    'ee,0':'oe', 'ee,1':'eo',
                                    'eo,0':'oo', 'eo,1':'ee',
                                    'oe,0':'ee', 'oe,1':'oo',
                                    'oo,0':'eo', 'oo,1':'oe'
                                },
                                start: 'ee', accept: ['ee'],
                                desc: 'Tracks parity of both 0-count and 1-count'
                            },
                            'No two consecutive 1s': {
                                states: ['s0','s1','dead'],
                                trans: {
                                    's0,0':'s0', 's0,1':'s1',
                                    's1,0':'s0', 's1,1':'dead',
                                    'dead,0':'dead', 'dead,1':'dead'
                                },
                                start: 's0', accept: ['s0','s1'],
                                desc: 'Once two 1s in a row are seen, enters a dead state'
                            },
                            'Contains 010': {
                                states: ['q0','q01','q010','found'],
                                trans: {
                                    'q0,0':'q01', 'q0,1':'q0',
                                    'q01,0':'q01', 'q01,1':'q010',
                                    'q010,0':'found', 'q010,1':'q0',
                                    'found,0':'found', 'found,1':'found'
                                },
                                start: 'q0', accept: ['found'],
                                desc: 'Searches for the substring 010'
                            }
                        };

                        var currentGal = Object.keys(gallery)[0];

                        var sel = document.createElement('select');
                        sel.style.cssText = 'padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;';
                        for (var name in gallery) {
                            var opt = document.createElement('option');
                            opt.value = name; opt.textContent = name;
                            sel.appendChild(opt);
                        }
                        sel.addEventListener('change', function() { currentGal = sel.value; draw(); });
                        controls.appendChild(sel);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = gallery[currentGal];

                            viz.screenText(currentGal, viz.width / 2, 20, viz.colors.white, 14);
                            viz.screenText(g.desc, viz.width / 2, 42, viz.colors.text, 11);

                            var n = g.states.length;
                            var R = 28;
                            var cx = viz.width / 2, cy = viz.height / 2 + 10;
                            var rx = Math.min(160, viz.width / 2 - 70);
                            var ry = Math.min(110, viz.height / 2 - 70);

                            var pos = {};
                            for (var i = 0; i < n; i++) {
                                var angle = -Math.PI / 2 + 2 * Math.PI * i / n;
                                pos[g.states[i]] = { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
                            }

                            // Collect edges and merge labels
                            var edges = {};
                            for (var key in g.trans) {
                                var parts = key.split(',');
                                var from = parts[0], sym = parts[1], to = g.trans[key];
                                var ek = from + '->' + to;
                                if (!edges[ek]) edges[ek] = [];
                                edges[ek].push(sym);
                            }

                            // Draw edges
                            for (var ek2 in edges) {
                                var ekParts = ek2.split('->');
                                var from2 = ekParts[0], to2 = ekParts[1];
                                var p1 = pos[from2], p2 = pos[to2];
                                var label = edges[ek2].join(',');

                                if (from2 === to2) {
                                    ctx.strokeStyle = viz.colors.text; ctx.lineWidth = 1.2;
                                    ctx.beginPath();
                                    ctx.arc(p1.x, p1.y - R - 14, 12, 0.3, Math.PI - 0.3);
                                    ctx.stroke();
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                    ctx.fillText(label, p1.x, p1.y - R - 28);
                                    continue;
                                }

                                var hasRev = edges[to2 + '->' + from2] != null;
                                var dx = p2.x - p1.x, dy = p2.y - p1.y;
                                var dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist < 1) continue;
                                var ux = dx / dist, uy = dy / dist;
                                var offx = hasRev ? -uy * 8 : 0, offy = hasRev ? ux * 8 : 0;

                                var sx = p1.x + ux * R + offx, sy = p1.y + uy * R + offy;
                                var ex = p2.x - ux * R + offx, ey = p2.y - uy * R + offy;

                                ctx.strokeStyle = viz.colors.text; ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();

                                var aAngle = Math.atan2(ey - sy, ex - sx);
                                ctx.fillStyle = viz.colors.text;
                                ctx.beginPath();
                                ctx.moveTo(ex, ey);
                                ctx.lineTo(ex - 9 * Math.cos(aAngle - 0.4), ey - 9 * Math.sin(aAngle - 0.4));
                                ctx.lineTo(ex - 9 * Math.cos(aAngle + 0.4), ey - 9 * Math.sin(aAngle + 0.4));
                                ctx.closePath(); ctx.fill();

                                var mx = (sx + ex) / 2, my = (sy + ey) / 2;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(label, mx - uy * 14, my + ux * 14);
                            }

                            // Draw states
                            for (var j = 0; j < n; j++) {
                                var s = g.states[j];
                                var p = pos[s];
                                var isAccept = g.accept.indexOf(s) >= 0;

                                ctx.fillStyle = viz.colors.bg;
                                ctx.strokeStyle = isAccept ? viz.colors.green : viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
                                ctx.fill(); ctx.stroke();

                                if (isAccept) {
                                    ctx.beginPath(); ctx.arc(p.x, p.y, R - 5, 0, Math.PI * 2); ctx.stroke();
                                }

                                if (s === g.start) {
                                    ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(p.x - R - 25, p.y);
                                    ctx.lineTo(p.x - R - 2, p.y);
                                    ctx.stroke();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.beginPath();
                                    ctx.moveTo(p.x - R, p.y);
                                    ctx.lineTo(p.x - R - 9, p.y - 4);
                                    ctx.lineTo(p.x - R - 9, p.y + 4);
                                    ctx.closePath(); ctx.fill();
                                }

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(s, p.x, p.y);
                            }

                            // Transition table
                            var tblY = viz.height - 50;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px monospace';
                            ctx.textAlign = 'left';
                            var tblStr = 'States: ' + g.states.join(', ') + '   Accept: ' + g.accept.join(', ');
                            ctx.fillText(tblStr, 20, tblY);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that the complement of a regular language is regular. (Hint: modify the DFA.)',
                    hint: 'Given a DFA for \\(L\\), what single change produces a DFA for \\(\\overline{L}\\)?',
                    solution: 'Let \\(M = (Q, \\Sigma, \\delta, q_0, F)\\) be a DFA for \\(L\\). Construct \\(M\' = (Q, \\Sigma, \\delta, q_0, Q \\setminus F)\\). Since \\(M\\) is deterministic and total (every state has transitions for every symbol), a string \\(w\\) reaches state \\(q\\) in both \\(M\\) and \\(M\'\\). Then \\(w \\in L(M\') \\iff q \\in Q \\setminus F \\iff q \\notin F \\iff w \\notin L(M)\\). So \\(L(M\') = \\overline{L}\\), which is regular.'
                }
            ]
        }
    ]
});
