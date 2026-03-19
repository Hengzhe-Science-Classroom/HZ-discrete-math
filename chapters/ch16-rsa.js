window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch16',
    number: 16,
    title: 'RSA Cryptography',
    subtitle: 'Public-key cryptography from number theory',
    sections: [
        // ================================================================
        // SECTION 1: Why RSA?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why RSA?',
            content: `
<h2>Why RSA?</h2>

<div class="env-block intuition">
    <div class="env-title">The Padlock Analogy</div>
    <div class="env-body">
        <p>Imagine you want to receive secret mail. You send an open padlock to anyone who wants to write to you, but you keep the key. They lock their message with your padlock and send it back. Only you can open it. This is exactly the idea behind <strong>public-key cryptography</strong>: the padlock is your <em>public key</em>, and the key you keep is your <em>private key</em>.</p>
    </div>
</div>

<h3>The Key Distribution Problem</h3>

<p>Before public-key cryptography, all encryption was <strong>symmetric</strong>: Alice and Bob shared a single secret key. The Caesar cipher, Enigma, and AES all work this way. The fundamental problem: how do Alice and Bob agree on a secret key if they can only communicate over a channel that Eve is eavesdropping on?</p>

<p>In 1976, Whitfield Diffie and Martin Hellman proposed a radical idea: what if encryption and decryption used <em>different</em> keys? One key (the public key) would be freely published; the other (the private key) would remain secret. Anyone could encrypt a message to you using your public key, but only you could decrypt it with your private key.</p>

<h3>RSA: The First Practical Realization</h3>

<p>In 1977, Ron <strong>R</strong>ivest, Adi <strong>S</strong>hamir, and Leonard <strong>A</strong>dleman found a way to make this idea work using number theory. Their scheme, called <strong>RSA</strong>, relies on a beautiful asymmetry:</p>

<div class="env-block remark">
    <div class="env-title">The Core Asymmetry</div>
    <div class="env-body">
        <p>Multiplying two large primes is easy. Factoring their product back into those primes is (believed to be) extremely hard. RSA exploits this one-way trapdoor: the public key is derived from the product \\(n = pq\\), but recovering \\(p\\) and \\(q\\) from \\(n\\) alone is computationally infeasible for large primes.</p>
    </div>
</div>

<p>The mathematical machinery behind RSA draws on everything we have built in the previous two chapters: divisibility, primes, modular arithmetic, the Euclidean algorithm, Euler's totient function, and Euler's theorem. RSA is, in many ways, the crown jewel of elementary number theory.</p>

<h3>Why Does This Matter?</h3>

<p>RSA (and its descendants) secures virtually all internet communication. Every time you see the padlock icon in your browser's address bar, public-key cryptography is at work. Online banking, secure messaging, software updates, digital signatures on contracts and code: all rely on the mathematical guarantees that RSA provides.</p>

<div class="viz-placeholder" data-viz="viz-caesar-vs-rsa"></div>
`,
            visualizations: [
                {
                    id: 'viz-caesar-vs-rsa',
                    title: 'Caesar Cipher vs RSA',
                    description: 'The Caesar cipher shifts each letter by a fixed amount. Knowing the encryption method makes it trivial to break. RSA uses modular exponentiation with separate keys; knowing the public key does not reveal the private key.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var shift = 3;
                        var message = 'HELLO';
                        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                        VizEngine.createSlider(controls, 'Caesar shift', 1, 25, shift, 1, function(v) {
                            shift = Math.round(v);
                            draw();
                        });

                        function caesarEncrypt(text, s) {
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                var idx = alphabet.indexOf(text[i]);
                                if (idx >= 0) result += alphabet[(idx + s) % 26];
                                else result += text[i];
                            }
                            return result;
                        }

                        function caesarDecrypt(text, s) {
                            return caesarEncrypt(text, 26 - s);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var midX = viz.width / 2;

                            // Title
                            viz.screenText('Symmetric vs Public-Key Encryption', midX, 20, viz.colors.white, 15);

                            // --- Left side: Caesar ---
                            var leftX = viz.width * 0.25;
                            viz.screenText('Caesar Cipher (Symmetric)', leftX, 55, viz.colors.blue, 13);

                            var encrypted = caesarEncrypt(message, shift);

                            // Original
                            ctx.fillStyle = viz.colors.green + '22';
                            ctx.fillRect(leftX - 60, 75, 120, 30);
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(leftX - 60, 75, 120, 30);
                            viz.screenText(message, leftX, 90, viz.colors.green, 16);
                            viz.screenText('plaintext', leftX, 118, viz.colors.text, 10);

                            // Arrow down
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(leftX, 130); ctx.lineTo(leftX, 155); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(leftX, 155); ctx.lineTo(leftX - 5, 148); ctx.moveTo(leftX, 155); ctx.lineTo(leftX + 5, 148); ctx.stroke();
                            viz.screenText('shift +' + shift, leftX + 45, 142, viz.colors.blue, 10);

                            // Encrypted
                            ctx.fillStyle = viz.colors.red + '22';
                            ctx.fillRect(leftX - 60, 160, 120, 30);
                            ctx.strokeStyle = viz.colors.red;
                            ctx.strokeRect(leftX - 60, 160, 120, 30);
                            viz.screenText(encrypted, leftX, 175, viz.colors.red, 16);
                            viz.screenText('ciphertext', leftX, 203, viz.colors.text, 10);

                            // Arrow down
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(leftX, 215); ctx.lineTo(leftX, 240); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(leftX, 240); ctx.lineTo(leftX - 5, 233); ctx.moveTo(leftX, 240); ctx.lineTo(leftX + 5, 233); ctx.stroke();
                            viz.screenText('shift -' + shift, leftX + 45, 228, viz.colors.blue, 10);

                            // Decrypted
                            ctx.fillStyle = viz.colors.green + '22';
                            ctx.fillRect(leftX - 60, 245, 120, 30);
                            ctx.strokeStyle = viz.colors.green;
                            ctx.strokeRect(leftX - 60, 245, 120, 30);
                            viz.screenText(caesarDecrypt(encrypted, shift), leftX, 260, viz.colors.green, 16);

                            // Weakness
                            ctx.fillStyle = viz.colors.red + '44';
                            ctx.fillRect(leftX - 70, 290, 140, 40);
                            viz.screenText('Only 25 possible keys!', leftX, 305, viz.colors.red, 11);
                            viz.screenText('Trivially broken by brute force', leftX, 320, viz.colors.red, 10);

                            // --- Right side: RSA ---
                            var rightX = viz.width * 0.75;
                            viz.screenText('RSA (Public-Key)', rightX, 55, viz.colors.teal, 13);

                            // Public key
                            ctx.fillStyle = viz.colors.teal + '22';
                            ctx.fillRect(rightX - 70, 75, 140, 30);
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.strokeRect(rightX - 70, 75, 140, 30);
                            viz.screenText('Public Key (e, n)', rightX, 90, viz.colors.teal, 12);
                            viz.screenText('anyone can encrypt', rightX, 118, viz.colors.text, 10);

                            // Arrow
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(rightX, 130); ctx.lineTo(rightX, 155); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(rightX, 155); ctx.lineTo(rightX - 5, 148); ctx.moveTo(rightX, 155); ctx.lineTo(rightX + 5, 148); ctx.stroke();
                            viz.screenText('c = m^e mod n', rightX + 55, 142, viz.colors.teal, 10);

                            // Ciphertext
                            ctx.fillStyle = viz.colors.red + '22';
                            ctx.fillRect(rightX - 70, 160, 140, 30);
                            ctx.strokeStyle = viz.colors.red;
                            ctx.strokeRect(rightX - 70, 160, 140, 30);
                            viz.screenText('Ciphertext c', rightX, 175, viz.colors.red, 12);

                            // Arrow
                            ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(rightX, 200); ctx.lineTo(rightX, 240); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(rightX, 240); ctx.lineTo(rightX - 5, 233); ctx.moveTo(rightX, 240); ctx.lineTo(rightX + 5, 233); ctx.stroke();
                            viz.screenText('m = c^d mod n', rightX + 55, 220, viz.colors.purple, 10);

                            // Private key
                            ctx.fillStyle = viz.colors.purple + '22';
                            ctx.fillRect(rightX - 70, 245, 140, 30);
                            ctx.strokeStyle = viz.colors.purple;
                            ctx.strokeRect(rightX - 70, 245, 140, 30);
                            viz.screenText('Private Key (d, n)', rightX, 260, viz.colors.purple, 12);
                            viz.screenText('only owner can decrypt', rightX, 288, viz.colors.text, 10);

                            // Strength
                            ctx.fillStyle = viz.colors.green + '44';
                            ctx.fillRect(rightX - 70, 300, 140, 40);
                            viz.screenText('Key space: 2^2048+', rightX, 315, viz.colors.green, 11);
                            viz.screenText('Factoring n is infeasible', rightX, 330, viz.colors.green, 10);

                            // Divider
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(midX, 50); ctx.lineTo(midX, 350); ctx.stroke();
                            ctx.setLineDash([]);

                            // Bottom comparison
                            viz.screenText('Same key encrypts & decrypts', leftX, 365, viz.colors.text, 10);
                            viz.screenText('Different keys: public encrypts, private decrypts', rightX, 365, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain the key distribution problem in symmetric encryption. Why does it not arise in public-key systems?',
                    hint: 'Think about what happens when Alice and Bob have never met and can only communicate over an insecure channel.',
                    solution: 'In symmetric encryption, both parties must share the same secret key. If they have never met, they need a secure channel to exchange the key, but that is precisely what they are trying to establish. Public-key cryptography solves this: Bob publishes his public key openly. Alice uses it to encrypt her message. Only Bob\'s private key (which was never transmitted) can decrypt it. No prior shared secret is needed.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: RSA Setup
        // ================================================================
        {
            id: 'sec-setup',
            title: 'RSA Setup',
            content: `
<h2>RSA Key Generation</h2>

<p>The RSA algorithm starts with key generation: constructing a public key and a private key from two secret primes. Every step uses tools from the previous chapters.</p>

<div class="env-block definition">
    <div class="env-title">Algorithm: RSA Key Generation</div>
    <div class="env-body">
        <ol>
            <li><strong>Choose two large distinct primes</strong> \\(p\\) and \\(q\\).</li>
            <li><strong>Compute</strong> \\(n = pq\\). This is the <em>modulus</em>.</li>
            <li><strong>Compute Euler's totient</strong> \\(\\phi(n) = (p-1)(q-1)\\).</li>
            <li><strong>Choose</strong> an integer \\(e\\) with \\(1 < e < \\phi(n)\\) and \\(\\gcd(e, \\phi(n)) = 1\\). This is the <em>public exponent</em>.</li>
            <li><strong>Compute</strong> \\(d \\equiv e^{-1} \\pmod{\\phi(n)}\\) using the Extended Euclidean Algorithm. This is the <em>private exponent</em>.</li>
        </ol>
        <p>The <strong>public key</strong> is the pair \\((e, n)\\). The <strong>private key</strong> is the pair \\((d, n)\\).</p>
    </div>
</div>

<h3>Step by Step</h3>

<p><strong>Step 1: Choose primes.</strong> In practice, \\(p\\) and \\(q\\) are each 1024 bits or larger, making \\(n\\) a 2048-bit number. For learning, we use small primes.</p>

<div class="env-block example">
    <div class="env-title">Example: Small RSA Setup</div>
    <div class="env-body">
        <p>Let \\(p = 61\\) and \\(q = 53\\).</p>
        <ul>
            <li>\\(n = 61 \\times 53 = 3233\\)</li>
            <li>\\(\\phi(n) = (61-1)(53-1) = 60 \\times 52 = 3120\\)</li>
            <li>Choose \\(e = 17\\). Check: \\(\\gcd(17, 3120) = 1\\). Good.</li>
            <li>Find \\(d\\) such that \\(17d \\equiv 1 \\pmod{3120}\\). Using the Extended Euclidean Algorithm: \\(d = 2753\\). Check: \\(17 \\times 2753 = 46801 = 15 \\times 3120 + 1\\). Confirmed.</li>
        </ul>
        <p>Public key: \\((17, 3233)\\). Private key: \\((2753, 3233)\\).</p>
    </div>
</div>

<h3>Why \\(\\phi(n)\\)?</h3>

<p>Euler's theorem tells us that if \\(\\gcd(m, n) = 1\\), then</p>
\\[m^{\\phi(n)} \\equiv 1 \\pmod{n}.\\]
<p>This means \\(m^{k\\phi(n)+1} \\equiv m \\pmod{n}\\) for any positive integer \\(k\\). If we choose \\(e\\) and \\(d\\) so that \\(ed \\equiv 1 \\pmod{\\phi(n)}\\), then \\(ed = k\\phi(n) + 1\\) for some integer \\(k\\), and</p>
\\[(m^e)^d = m^{ed} = m^{k\\phi(n)+1} \\equiv m \\pmod{n}.\\]
<p>Encryption followed by decryption recovers the original message. This is the mathematical heart of RSA.</p>

<h3>Why Must \\(\\gcd(e, \\phi(n)) = 1\\)?</h3>

<p>We need \\(e\\) to have a multiplicative inverse modulo \\(\\phi(n)\\). By a theorem from the previous chapter, this inverse exists if and only if \\(\\gcd(e, \\phi(n)) = 1\\). The common choice \\(e = 65537 = 2^{16} + 1\\) is popular in practice because it is prime (ensuring the gcd condition for most \\(n\\)) and has only two 1-bits in binary (making modular exponentiation fast).</p>

<div class="viz-placeholder" data-viz="viz-rsa-keygen"></div>
`,
            visualizations: [
                {
                    id: 'viz-rsa-keygen',
                    title: 'RSA Key Generation',
                    description: 'Step through the RSA key generation process. Choose two small primes and watch as n, phi(n), e, and d are computed. Each step builds on the number theory from previous chapters.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var smallPrimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
                        var pIdx = 15; // p=53
                        var qIdx = 17; // q=61

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function extGcd(a, b) {
                            if (a === 0) return [b, 0, 1];
                            var r = extGcd(b % a, a);
                            return [r[0], r[2] - Math.floor(b / a) * r[1], r[1]];
                        }

                        function modInverse(e, phi) {
                            var r = extGcd(e % phi, phi);
                            if (r[0] !== 1) return -1;
                            return ((r[1] % phi) + phi) % phi;
                        }

                        function findE(phi) {
                            var candidates = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 65537];
                            for (var i = 0; i < candidates.length; i++) {
                                if (candidates[i] < phi && gcd(candidates[i], phi) === 1) return candidates[i];
                            }
                            for (var e = 3; e < phi; e += 2) {
                                if (gcd(e, phi) === 1) return e;
                            }
                            return -1;
                        }

                        var step = 0;

                        VizEngine.createSlider(controls, 'p index', 0, smallPrimes.length - 1, pIdx, 1, function(v) {
                            pIdx = Math.round(v);
                            if (pIdx === qIdx) qIdx = (pIdx + 1) % smallPrimes.length;
                            step = 0;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'q index', 0, smallPrimes.length - 1, qIdx, 1, function(v) {
                            qIdx = Math.round(v);
                            if (qIdx === pIdx) pIdx = (qIdx + 1) % smallPrimes.length;
                            step = 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next Step', function() {
                            if (step < 5) step++;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var p = smallPrimes[pIdx];
                            var q = smallPrimes[qIdx];
                            var n = p * q;
                            var phi = (p - 1) * (q - 1);
                            var e = findE(phi);
                            var d = modInverse(e, phi);

                            viz.screenText('RSA Key Generation', viz.width / 2, 20, viz.colors.white, 16);

                            var y = 55;
                            var lineH = 50;
                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green];
                            var labels = [
                                'Step 1: Choose primes',
                                'Step 2: Compute n = p \u00D7 q',
                                'Step 3: Compute \u03C6(n) = (p-1)(q-1)',
                                'Step 4: Choose e with gcd(e, \u03C6(n)) = 1',
                                'Step 5: Compute d = e\u207B\u00B9 mod \u03C6(n)'
                            ];
                            var values = [
                                'p = ' + p + ', q = ' + q,
                                'n = ' + p + ' \u00D7 ' + q + ' = ' + n,
                                '\u03C6(n) = ' + (p-1) + ' \u00D7 ' + (q-1) + ' = ' + phi,
                                'e = ' + e + '  (gcd(' + e + ', ' + phi + ') = ' + gcd(e, phi) + ')',
                                'd = ' + d + '  (check: ' + e + ' \u00D7 ' + d + ' = ' + (e * d) + ' = ' + Math.floor(e * d / phi) + ' \u00D7 ' + phi + ' + ' + ((e * d) % phi) + ')'
                            ];

                            for (var i = 0; i < 5; i++) {
                                var yy = y + i * lineH;
                                var active = i <= step;
                                var current = i === step;

                                // Step box
                                if (active) {
                                    ctx.fillStyle = colors[i] + (current ? '33' : '18');
                                    ctx.fillRect(20, yy - 10, viz.width - 40, lineH - 8);
                                    ctx.strokeStyle = colors[i] + (current ? 'cc' : '55');
                                    ctx.lineWidth = current ? 2 : 1;
                                    ctx.strokeRect(20, yy - 10, viz.width - 40, lineH - 8);
                                }

                                // Step circle
                                ctx.fillStyle = active ? colors[i] : viz.colors.grid;
                                ctx.beginPath(); ctx.arc(45, yy + 8, 10, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText((i + 1).toString(), 45, 8 + yy);

                                // Label
                                ctx.fillStyle = active ? viz.colors.white : viz.colors.text + '55';
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(labels[i], 65, yy + 4);

                                // Value
                                if (active) {
                                    ctx.fillStyle = colors[i];
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.fillText(values[i], 65, yy + 22);
                                }
                            }

                            // Result box at bottom
                            if (step >= 4) {
                                var ry = y + 5 * lineH + 10;
                                ctx.fillStyle = viz.colors.green + '22';
                                ctx.fillRect(20, ry, viz.width - 40, 60);
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(20, ry, viz.width - 40, 60);

                                viz.screenText('Public Key: (e=' + e + ', n=' + n + ')', viz.width / 2, ry + 18, viz.colors.teal, 14);
                                viz.screenText('Private Key: (d=' + d + ', n=' + n + ')', viz.width / 2, ry + 42, viz.colors.purple, 14);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Perform RSA key generation with \\(p = 11\\) and \\(q = 13\\). Find \\(n\\), \\(\\phi(n)\\), choose a valid \\(e\\), and compute \\(d\\).',
                    hint: 'Compute \\(n = 11 \\times 13\\) and \\(\\phi(n) = 10 \\times 12\\). Then find an \\(e < 120\\) coprime to 120, and use the Extended Euclidean Algorithm to find \\(d\\).',
                    solution: '\\(n = 143\\), \\(\\phi(n) = 120\\). Choose \\(e = 7\\) (since \\(\\gcd(7, 120) = 1\\)). Then \\(d \\equiv 7^{-1} \\pmod{120}\\). Since \\(7 \\times 103 = 721 = 6 \\times 120 + 1\\), we get \\(d = 103\\). Public key: \\((7, 143)\\). Private key: \\((103, 143)\\).'
                },
                {
                    question: 'Why would choosing \\(e = 6\\) fail if \\(\\phi(n) = 120\\)?',
                    hint: 'Compute \\(\\gcd(6, 120)\\).',
                    solution: '\\(\\gcd(6, 120) = 6 \\neq 1\\), so \\(e = 6\\) has no multiplicative inverse modulo 120. The decryption exponent \\(d\\) would not exist, and the scheme would be broken: multiple messages would encrypt to the same ciphertext, making decryption ambiguous.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Encryption & Decryption
        // ================================================================
        {
            id: 'sec-encrypt',
            title: 'Encryption & Decryption',
            content: `
<h2>Encryption and Decryption</h2>

<p>With the keys in hand, the encryption and decryption operations are remarkably simple: a single modular exponentiation each.</p>

<div class="env-block definition">
    <div class="env-title">RSA Encryption</div>
    <div class="env-body">
        <p>Given a message \\(m\\) (an integer with \\(0 \\le m < n\\)) and the public key \\((e, n)\\):</p>
        \\[c = m^e \\bmod n\\]
        <p>The ciphertext \\(c\\) is sent to the key owner.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">RSA Decryption</div>
    <div class="env-body">
        <p>Given the ciphertext \\(c\\) and the private key \\((d, n)\\):</p>
        \\[m = c^d \\bmod n\\]
    </div>
</div>

<h3>Why Does Decryption Recover the Message?</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.1 (RSA Correctness)</div>
    <div class="env-body">
        <p>If \\(n = pq\\) with \\(p, q\\) distinct primes, and \\(ed \\equiv 1 \\pmod{\\phi(n)}\\), then for all integers \\(m\\) with \\(0 \\le m < n\\):</p>
        \\[m^{ed} \\equiv m \\pmod{n}.\\]
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>Write \\(ed = 1 + k\\phi(n) = 1 + k(p-1)(q-1)\\) for some integer \\(k\\).</p>
        <p><strong>Case 1:</strong> \\(\\gcd(m, n) = 1\\). By Euler's theorem, \\(m^{\\phi(n)} \\equiv 1 \\pmod{n}\\), so \\(m^{ed} = m^{1+k\\phi(n)} = m \\cdot (m^{\\phi(n)})^k \\equiv m \\cdot 1^k = m \\pmod{n}\\).</p>
        <p><strong>Case 2:</strong> \\(\\gcd(m, n) > 1\\). Since \\(n = pq\\) and \\(m < n\\), this means \\(p \\mid m\\) or \\(q \\mid m\\) (but not both). Say \\(p \\mid m\\). Then \\(m^{ed} \\equiv 0 \\equiv m \\pmod{p}\\). And \\(\\gcd(m, q) = 1\\), so by Fermat's Little Theorem, \\(m^{q-1} \\equiv 1 \\pmod{q}\\), giving \\(m^{ed} = m^{1+k(p-1)(q-1)} = m \\cdot (m^{q-1})^{k(p-1)} \\equiv m \\pmod{q}\\). By the Chinese Remainder Theorem, \\(m^{ed} \\equiv m \\pmod{n}\\).</p>
    </div>
</div>

<h3>Modular Exponentiation in Practice</h3>

<p>Computing \\(m^e \\bmod n\\) directly would require working with astronomical numbers. Instead, we use <strong>repeated squaring</strong> (also called fast exponentiation or square-and-multiply), which computes the result in \\(O(\\log e)\\) multiplications, each followed by a modular reduction to keep numbers manageable.</p>

<div class="env-block example">
    <div class="env-title">Example: Encrypt and Decrypt</div>
    <div class="env-body">
        <p>Using the keys from our earlier example: public key \\((17, 3233)\\), private key \\((2753, 3233)\\).</p>
        <p><strong>Encrypt</strong> \\(m = 65\\):</p>
        \\[c = 65^{17} \\bmod 3233 = 2790.\\]
        <p><strong>Decrypt</strong> \\(c = 2790\\):</p>
        \\[m = 2790^{2753} \\bmod 3233 = 65. \\quad \\checkmark\\]
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-rsa-encrypt-decrypt"></div>

<div class="viz-placeholder" data-viz="viz-rsa-demo"></div>
`,
            visualizations: [
                {
                    id: 'viz-rsa-encrypt-decrypt',
                    title: 'Alice Sends a Secret Message to Bob',
                    description: 'Watch the full RSA communication: Bob generates keys, publishes his public key, Alice encrypts her message, and Bob decrypts it. The numbers are shown at every step.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        var p = 61, q = 53;
                        var n = p * q; // 3233
                        var phi = (p - 1) * (q - 1); // 3120
                        var e = 17;

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function modInverse(a, m) {
                            function ext(a, b) { if (a === 0) return [b, 0, 1]; var r = ext(b % a, a); return [r[0], r[2] - Math.floor(b / a) * r[1], r[1]]; }
                            var r = ext(a % m, m);
                            return ((r[1] % m) + m) % m;
                        }
                        function modPow(base, exp, mod) {
                            var result = 1; base = base % mod;
                            while (exp > 0) {
                                if (exp % 2 === 1) result = (result * base) % mod;
                                exp = Math.floor(exp / 2);
                                base = (base * base) % mod;
                            }
                            return result;
                        }

                        var d = modInverse(e, phi);
                        var message = 65; // 'A'
                        var animStep = 0;
                        var maxSteps = 6;

                        VizEngine.createSlider(controls, 'Message m', 2, 3232, message, 1, function(v) {
                            message = Math.round(v);
                            animStep = 0;
                            draw();
                        });

                        var animating = false;
                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animStep = 0;
                            function tick() {
                                if (animStep > maxSteps) { animating = false; return; }
                                draw();
                                animStep++;
                                setTimeout(tick, 900);
                            }
                            tick();
                        });

                        VizEngine.createButton(controls, 'Show All', function() {
                            animStep = maxSteps;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var c = modPow(message, e, n);
                            var decrypted = modPow(c, d, n);

                            // Title
                            viz.screenText('RSA: Alice sends message to Bob', viz.width / 2, 18, viz.colors.white, 15);

                            // Alice (left) and Bob (right)
                            var aliceX = 80, bobX = 480;

                            // Draw Alice
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(aliceX, 65, 20, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('A', aliceX, 65);
                            viz.screenText('Alice', aliceX, 95, viz.colors.blue, 12);

                            // Draw Bob
                            ctx.fillStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(bobX, 65, 20, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('B', bobX, 65);
                            viz.screenText('Bob', bobX, 95, viz.colors.teal, 12);

                            var centerX = viz.width / 2;
                            var stepY = 120;
                            var stepH = 52;

                            // Step 1: Bob's keys
                            if (animStep >= 1) {
                                ctx.fillStyle = viz.colors.teal + '22';
                                ctx.fillRect(bobX - 110, stepY, 220, 40);
                                ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1;
                                ctx.strokeRect(bobX - 110, stepY, 220, 40);
                                viz.screenText('Bob generates keys:', bobX, stepY + 12, viz.colors.teal, 11);
                                viz.screenText('Public: (e=' + e + ', n=' + n + ')', bobX, stepY + 28, viz.colors.white, 11);
                            }

                            // Step 2: Bob sends public key
                            if (animStep >= 2) {
                                var y2 = stepY + stepH;
                                ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                                ctx.setLineDash([6, 4]);
                                ctx.beginPath(); ctx.moveTo(bobX - 20, y2 + 10); ctx.lineTo(aliceX + 20, y2 + 10); ctx.stroke();
                                ctx.setLineDash([]);
                                // Arrowhead
                                ctx.beginPath(); ctx.moveTo(aliceX + 20, y2 + 10); ctx.lineTo(aliceX + 30, y2 + 5); ctx.moveTo(aliceX + 20, y2 + 10); ctx.lineTo(aliceX + 30, y2 + 15); ctx.stroke();
                                viz.screenText('Public key (e=' + e + ', n=' + n + ')', centerX, y2, viz.colors.teal, 10);
                            }

                            // Step 3: Alice has message
                            if (animStep >= 3) {
                                var y3 = stepY + stepH * 2;
                                ctx.fillStyle = viz.colors.green + '22';
                                ctx.fillRect(aliceX - 60, y3, 120, 30);
                                ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1;
                                ctx.strokeRect(aliceX - 60, y3, 120, 30);
                                viz.screenText('m = ' + message, aliceX, y3 + 15, viz.colors.green, 13);
                            }

                            // Step 4: Alice encrypts
                            if (animStep >= 4) {
                                var y4 = stepY + stepH * 3;
                                ctx.fillStyle = viz.colors.orange + '22';
                                ctx.fillRect(aliceX - 80, y4, 160, 30);
                                ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1;
                                ctx.strokeRect(aliceX - 80, y4, 160, 30);
                                viz.screenText('c = ' + message + '^' + e + ' mod ' + n + ' = ' + c, aliceX, y4 + 15, viz.colors.orange, 11);
                            }

                            // Step 5: Send ciphertext
                            if (animStep >= 5) {
                                var y5 = stepY + stepH * 4;
                                ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(aliceX + 20, y5 + 10); ctx.lineTo(bobX - 20, y5 + 10); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(bobX - 20, y5 + 10); ctx.lineTo(bobX - 30, y5 + 5); ctx.moveTo(bobX - 20, y5 + 10); ctx.lineTo(bobX - 30, y5 + 15); ctx.stroke();
                                viz.screenText('Ciphertext c = ' + c, centerX, y5, viz.colors.red, 11);
                                viz.screenText('(Eve sees this but cannot decrypt!)', centerX, y5 + 22, viz.colors.text, 9);
                            }

                            // Step 6: Bob decrypts
                            if (animStep >= 6) {
                                var y6 = stepY + stepH * 5;
                                ctx.fillStyle = viz.colors.green + '22';
                                ctx.fillRect(bobX - 110, y6, 220, 30);
                                ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1;
                                ctx.strokeRect(bobX - 110, y6, 220, 30);
                                viz.screenText('m = ' + c + '^' + d + ' mod ' + n + ' = ' + decrypted, bobX, y6 + 15, viz.colors.green, 11);

                                // Checkmark
                                if (decrypted === message) {
                                    viz.screenText('\u2713 Message recovered!', centerX, y6 + 42, viz.colors.green, 13);
                                }
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-rsa-demo',
                    title: 'RSA Pipeline: Full Computation',
                    description: 'Enter a message (as a number), choose your own primes p and q, and see every intermediate value in the RSA encryption/decryption pipeline.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var primeList = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
                        var pSel = 10; // 31
                        var qSel = 12; // 41
                        var msg = 42;

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function modInverse(a, m) {
                            function ext(a, b) { if (a === 0) return [b, 0, 1]; var r = ext(b % a, a); return [r[0], r[2] - Math.floor(b / a) * r[1], r[1]]; }
                            var r = ext(a % m, m);
                            return ((r[1] % m) + m) % m;
                        }
                        function modPow(base, exp, mod) {
                            var result = 1; base = base % mod;
                            while (exp > 0) {
                                if (exp % 2 === 1) result = (result * base) % mod;
                                exp = Math.floor(exp / 2);
                                base = (base * base) % mod;
                            }
                            return result;
                        }
                        function findE(phi) {
                            var candidates = [3,5,7,11,13,17,19,23,29,31,37,41,43,47];
                            for (var i = 0; i < candidates.length; i++) {
                                if (candidates[i] < phi && gcd(candidates[i], phi) === 1) return candidates[i];
                            }
                            return -1;
                        }

                        VizEngine.createSlider(controls, 'p', 0, primeList.length - 1, pSel, 1, function(v) {
                            pSel = Math.round(v);
                            if (pSel === qSel) qSel = (pSel + 1) % primeList.length;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'q', 0, primeList.length - 1, qSel, 1, function(v) {
                            qSel = Math.round(v);
                            if (qSel === pSel) pSel = (qSel + 1) % primeList.length;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Message', 2, 500, msg, 1, function(v) {
                            msg = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var p = primeList[pSel];
                            var q = primeList[qSel];
                            var n = p * q;
                            var phi = (p - 1) * (q - 1);
                            var e = findE(phi);
                            var d = modInverse(e, phi);
                            var m = msg % n;
                            if (m < 2) m = 2;
                            var c = modPow(m, e, n);
                            var dec = modPow(c, d, n);

                            viz.screenText('RSA Full Pipeline', viz.width / 2, 18, viz.colors.white, 16);

                            var lx = 30;
                            var y = 50;
                            var lh = 28;

                            function row(label, value, color, yy) {
                                ctx.fillStyle = color + '18';
                                ctx.fillRect(lx, yy - 2, viz.width - 60, lh - 4);
                                ctx.fillStyle = color;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText(label, lx + 8, yy + lh / 2 - 2);
                                ctx.fillStyle = viz.colors.white;
                                ctx.textAlign = 'right';
                                ctx.fillText(value, viz.width - 38, yy + lh / 2 - 2);
                            }

                            row('Primes', 'p = ' + p + ',  q = ' + q, viz.colors.blue, y);
                            row('Modulus', 'n = p \u00D7 q = ' + n, viz.colors.blue, y + lh);
                            row('Totient', '\u03C6(n) = (p-1)(q-1) = ' + phi, viz.colors.teal, y + 2 * lh);
                            row('Public exponent', 'e = ' + e + '  (gcd(' + e + ',' + phi + ') = 1)', viz.colors.teal, y + 3 * lh);
                            row('Private exponent', 'd = ' + d + '  (e\u00B7d mod \u03C6(n) = ' + ((e * d) % phi) + ')', viz.colors.purple, y + 4 * lh);

                            // Divider
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(lx, y + 5 * lh); ctx.lineTo(viz.width - 30, y + 5 * lh); ctx.stroke();

                            row('Message', 'm = ' + m + (msg !== m ? '  (reduced mod ' + n + ')' : ''), viz.colors.green, y + 5 * lh + 8);

                            // Encryption
                            row('Encrypt: c = m^e mod n', c.toString(), viz.colors.orange, y + 6 * lh + 8);
                            row('Decrypt: m = c^d mod n', dec.toString(), viz.colors.green, y + 7 * lh + 8);

                            // Verification
                            var vy = y + 8 * lh + 20;
                            if (dec === m) {
                                ctx.fillStyle = viz.colors.green + '33';
                                ctx.fillRect(lx, vy, viz.width - 60, 35);
                                ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                                ctx.strokeRect(lx, vy, viz.width - 60, 35);
                                viz.screenText('\u2713 Decryption successful: ' + dec + ' = ' + m, viz.width / 2, vy + 18, viz.colors.green, 14);
                            } else {
                                ctx.fillStyle = viz.colors.red + '33';
                                ctx.fillRect(lx, vy, viz.width - 60, 35);
                                viz.screenText('\u2717 Error: ' + dec + ' \u2260 ' + m, viz.width / 2, vy + 18, viz.colors.red, 14);
                            }

                            // Key summary
                            var ky = vy + 50;
                            viz.screenText('Public key: (' + e + ', ' + n + ')', viz.width * 0.3, ky, viz.colors.teal, 12);
                            viz.screenText('Private key: (' + d + ', ' + n + ')', viz.width * 0.7, ky, viz.colors.purple, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using the public key \\((e, n) = (3, 55)\\) with \\(p = 5, q = 11\\), encrypt the message \\(m = 7\\). Then compute the private key \\(d\\) and decrypt.',
                    hint: '\\(\\phi(55) = 4 \\times 10 = 40\\). Find \\(d\\) such that \\(3d \\equiv 1 \\pmod{40}\\). Then compute \\(7^3 \\bmod 55\\) and \\(c^d \\bmod 55\\).',
                    solution: '\\(c = 7^3 \\bmod 55 = 343 \\bmod 55 = 13\\). For decryption: \\(d = 27\\) since \\(3 \\times 27 = 81 = 2 \\times 40 + 1\\). Then \\(m = 13^{27} \\bmod 55 = 7\\). By repeated squaring: \\(13^2 = 169 \\equiv 4\\), \\(13^4 \\equiv 16\\), \\(13^8 \\equiv 256 \\equiv 36\\), \\(13^{16} \\equiv 1296 \\equiv 26\\). Then \\(13^{27} = 13^{16} \\cdot 13^8 \\cdot 13^2 \\cdot 13^1 \\equiv 26 \\cdot 36 \\cdot 4 \\cdot 13 \\equiv 7 \\pmod{55}\\).'
                },
                {
                    question: 'Explain why RSA requires \\(m < n\\). What happens if \\(m \\ge n\\)?',
                    hint: 'Think about what modular reduction does to distinct messages.',
                    solution: 'All computations are done modulo \\(n\\), so any message \\(m \\ge n\\) is equivalent to \\(m \\bmod n\\). Two distinct messages \\(m_1\\) and \\(m_2\\) with \\(m_1 \\equiv m_2 \\pmod{n}\\) would produce the same ciphertext, and decryption could not distinguish them. In practice, messages are broken into blocks smaller than \\(n\\), or (more commonly) RSA encrypts a random symmetric key, which is then used to encrypt the actual message.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Security
        // ================================================================
        {
            id: 'sec-security',
            title: 'Security',
            content: `
<h2>Why RSA is Hard to Break</h2>

<p>The security of RSA rests on a single computational assumption: given \\(n = pq\\), it is hard to find \\(p\\) and \\(q\\). If an attacker could factor \\(n\\), they could compute \\(\\phi(n) = (p-1)(q-1)\\), then find \\(d = e^{-1} \\bmod \\phi(n)\\), and decrypt everything.</p>

<div class="env-block definition">
    <div class="env-title">The RSA Problem</div>
    <div class="env-body">
        <p>Given \\(n = pq\\) (product of two large unknown primes), \\(e\\), and \\(c = m^e \\bmod n\\), find \\(m\\).</p>
        <p>The best known approach is to factor \\(n\\), but no polynomial-time factoring algorithm for classical computers is known.</p>
    </div>
</div>

<h3>The Difficulty of Factoring</h3>

<p>Multiplying two 1024-bit primes takes microseconds. Factoring their 2048-bit product, using the best known algorithm (the General Number Field Sieve), would take longer than the age of the universe with current technology. This asymmetry is the foundation of RSA security.</p>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
    <tr style="border-bottom:1px solid #30363d;">
        <th style="text-align:left;padding:8px;color:#8b949e;">Key Size (bits)</th>
        <th style="text-align:left;padding:8px;color:#8b949e;">Status</th>
        <th style="text-align:left;padding:8px;color:#8b949e;">Year Factored / Est.</th>
    </tr>
    <tr><td style="padding:8px;">512</td><td style="padding:8px;color:#f85149;">Broken</td><td style="padding:8px;">1999</td></tr>
    <tr><td style="padding:8px;">768</td><td style="padding:8px;color:#f85149;">Broken</td><td style="padding:8px;">2009</td></tr>
    <tr><td style="padding:8px;">1024</td><td style="padding:8px;color:#d29922;">Deprecated</td><td style="padding:8px;">Feasible for nation-states</td></tr>
    <tr><td style="padding:8px;">2048</td><td style="padding:8px;color:#3fb950;">Secure</td><td style="padding:8px;">Current standard</td></tr>
    <tr><td style="padding:8px;">4096</td><td style="padding:8px;color:#3fb950;">Highly secure</td><td style="padding:8px;">Used for high-security</td></tr>
</table>

<h3>Common Attacks and Pitfalls</h3>

<div class="env-block remark">
    <div class="env-title">Attacks to Know</div>
    <div class="env-body">
        <ul>
            <li><strong>Small key attack:</strong> If \\(n\\) is small enough to factor by trial division or Pollard's rho, the private key is immediately recovered.</li>
            <li><strong>Common modulus attack:</strong> If the same message is encrypted with two different public exponents but the same \\(n\\), the message can be recovered without factoring.</li>
            <li><strong>Small exponent attack:</strong> If \\(e = 3\\) and the message \\(m\\) is small (\\(m^3 < n\\)), the ciphertext is just \\(m^3\\) with no modular reduction, and cube-rooting recovers \\(m\\).</li>
            <li><strong>Timing attacks:</strong> By measuring how long decryption takes, an attacker can infer bits of the private key. Modern implementations use constant-time arithmetic.</li>
        </ul>
    </div>
</div>

<h3>Quantum Threat</h3>

<p>Shor's algorithm (1994) can factor integers in polynomial time on a quantum computer. If large-scale quantum computers are built, RSA will be broken. This is why the cryptographic community is developing <strong>post-quantum cryptography</strong> based on problems believed to be hard even for quantum computers (lattice problems, hash-based signatures, etc.).</p>

<div class="viz-placeholder" data-viz="viz-factoring-difficulty"></div>

<div class="viz-placeholder" data-viz="viz-key-size"></div>
`,
            visualizations: [
                {
                    id: 'viz-factoring-difficulty',
                    title: 'Factoring Challenge',
                    description: 'Try to factor n = p * q. For small n, trial division works quickly. As n grows, the number of trial divisions explodes. See how long it takes!',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var difficulty = 0; // 0=easy, 1=medium, 2=hard
                        var primePairs = [
                            [7, 11],      // 77, trivial
                            [31, 37],     // 1147
                            [101, 103],   // 10403
                            [307, 311],   // 95477
                            [1009, 1013], // 1022117
                            [4999, 5003], // 25009997
                            [10007, 10009] // 100160063
                        ];
                        var currentPair = 0;
                        var running = false;
                        var steps = [];
                        var found = false;
                        var trialCount = 0;
                        var startTime = 0;
                        var elapsed = 0;

                        VizEngine.createSlider(controls, 'Difficulty', 0, primePairs.length - 1, 0, 1, function(v) {
                            currentPair = Math.round(v);
                            reset();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Factor!', function() {
                            if (running) return;
                            reset();
                            running = true;
                            startTime = performance.now();
                            factorStep();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            reset();
                            draw();
                        });

                        function reset() {
                            running = false;
                            steps = [];
                            found = false;
                            trialCount = 0;
                            elapsed = 0;
                        }

                        function factorStep() {
                            if (!running) return;
                            var pair = primePairs[currentPair];
                            var n = pair[0] * pair[1];
                            var batchSize = Math.max(1, Math.min(500, Math.floor(Math.sqrt(n) / 50)));

                            for (var b = 0; b < batchSize; b++) {
                                trialCount++;
                                var d = trialCount + 1;
                                if (d * d > n) {
                                    found = true;
                                    steps.push({ d: n, rem: 0, found: true, isPrime: true });
                                    running = false;
                                    elapsed = performance.now() - startTime;
                                    draw();
                                    return;
                                }
                                if (n % d === 0) {
                                    found = true;
                                    steps.push({ d: d, other: n / d, found: true });
                                    running = false;
                                    elapsed = performance.now() - startTime;
                                    draw();
                                    return;
                                }
                                if (trialCount <= 30 || trialCount % Math.max(1, Math.floor(batchSize / 2)) === 0) {
                                    steps.push({ d: d, rem: n % d, found: false });
                                }
                            }

                            elapsed = performance.now() - startTime;
                            draw();
                            requestAnimationFrame(factorStep);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pair = primePairs[currentPair];
                            var n = pair[0] * pair[1];

                            viz.screenText('Factoring Challenge: Trial Division', viz.width / 2, 18, viz.colors.white, 15);

                            // Show n
                            viz.screenText('n = ' + n.toLocaleString(), viz.width / 2, 50, viz.colors.orange, 20);
                            viz.screenText('(product of two primes)', viz.width / 2, 70, viz.colors.text, 11);

                            // Stats
                            var statsY = 95;
                            viz.screenText('Trials: ' + trialCount.toLocaleString(), 140, statsY, viz.colors.blue, 12, 'center');
                            viz.screenText('Time: ' + (elapsed / 1000).toFixed(3) + 's', 300, statsY, viz.colors.teal, 12, 'center');
                            viz.screenText('Max trial: \u221A' + n.toLocaleString() + ' \u2248 ' + Math.floor(Math.sqrt(n)).toLocaleString(), 460, statsY, viz.colors.text, 11, 'center');

                            // Trial log
                            var logY = 120;
                            var logH = 220;
                            ctx.fillStyle = '#0a0a1a';
                            ctx.fillRect(20, logY, viz.width - 40, logH);
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                            ctx.strokeRect(20, logY, viz.width - 40, logH);

                            var visible = Math.min(steps.length, 14);
                            var startIdx = Math.max(0, steps.length - visible);
                            for (var i = 0; i < visible; i++) {
                                var s = steps[startIdx + i];
                                var sy = logY + 8 + i * 15;
                                ctx.font = '11px monospace';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                if (s.found) {
                                    ctx.fillStyle = viz.colors.green;
                                    if (s.isPrime) {
                                        ctx.fillText('  n = ' + n + ' is prime!', 30, sy);
                                    } else {
                                        ctx.fillText('  FOUND: ' + n + ' = ' + s.d + ' \u00D7 ' + s.other, 30, sy);
                                    }
                                } else {
                                    ctx.fillStyle = viz.colors.text + '88';
                                    ctx.fillText('  ' + n + ' \u00F7 ' + s.d + ' = ... remainder ' + s.rem, 30, sy);
                                }
                            }

                            // Result
                            if (found) {
                                var ry = logY + logH + 15;
                                var lastStep = steps[steps.length - 1];
                                if (lastStep.isPrime) {
                                    viz.screenText(n + ' is prime (not a product of two primes)', viz.width / 2, ry, viz.colors.orange, 13);
                                } else {
                                    ctx.fillStyle = viz.colors.green + '33';
                                    ctx.fillRect(20, ry - 10, viz.width - 40, 35);
                                    ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                                    ctx.strokeRect(20, ry - 10, viz.width - 40, 35);
                                    viz.screenText(n.toLocaleString() + ' = ' + lastStep.d + ' \u00D7 ' + lastStep.other + '  (' + trialCount.toLocaleString() + ' trials, ' + (elapsed / 1000).toFixed(3) + 's)', viz.width / 2, ry + 8, viz.colors.green, 13);
                                }
                            } else if (running) {
                                viz.screenText('Searching...', viz.width / 2, logY + logH + 15, viz.colors.yellow, 12);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-key-size',
                    title: 'Key Size vs Security',
                    description: 'RSA key sizes have grown over time as factoring algorithms and hardware have improved. This timeline shows which key sizes have been broken and when.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var data = [
                            { bits: 330,  year: 1991, label: 'RSA-100', color: '#f85149' },
                            { bits: 426,  year: 1994, label: 'RSA-129', color: '#f85149' },
                            { bits: 512,  year: 1999, label: 'RSA-155', color: '#f85149' },
                            { bits: 663,  year: 2005, label: 'RSA-200', color: '#f85149' },
                            { bits: 768,  year: 2009, label: 'RSA-768', color: '#f85149' },
                            { bits: 829,  year: 2020, label: 'RSA-250', color: '#f85149' },
                            { bits: 1024, year: null, label: '1024-bit', color: '#d29922' },
                            { bits: 2048, year: null, label: '2048-bit', color: '#3fb950' },
                            { bits: 4096, year: null, label: '4096-bit', color: '#3fb950' }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('RSA Key Size Timeline', viz.width / 2, 18, viz.colors.white, 15);

                            var chartLeft = 80;
                            var chartRight = viz.width - 40;
                            var chartTop = 50;
                            var chartBot = 300;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBot - chartTop;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartLeft, chartBot); ctx.lineTo(chartRight, chartBot); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartLeft, chartTop); ctx.lineTo(chartLeft, chartBot); ctx.stroke();

                            // Y-axis: key size (log scale)
                            var minBits = 256, maxBits = 5000;
                            var minLog = Math.log2(minBits), maxLog = Math.log2(maxBits);

                            var yTicks = [256, 512, 1024, 2048, 4096];
                            for (var t = 0; t < yTicks.length; t++) {
                                var yy = chartBot - ((Math.log2(yTicks[t]) - minLog) / (maxLog - minLog)) * chartH;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(chartLeft, yy); ctx.lineTo(chartRight, yy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(yTicks[t] + '-bit', chartLeft - 8, yy);
                            }

                            // X-axis: year
                            var minYear = 1988, maxYear = 2030;
                            var xTicks = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];
                            for (var x = 0; x < xTicks.length; x++) {
                                var xx = chartLeft + ((xTicks[x] - minYear) / (maxYear - minYear)) * chartW;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(xx, chartTop); ctx.lineTo(xx, chartBot); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText(xTicks[x].toString(), xx, chartBot + 4);
                            }

                            viz.screenText('Year Factored', viz.width / 2, chartBot + 22, viz.colors.text, 10);

                            // Data points
                            for (var i = 0; i < data.length; i++) {
                                var d = data[i];
                                var py = chartBot - ((Math.log2(d.bits) - minLog) / (maxLog - minLog)) * chartH;
                                var px;
                                if (d.year) {
                                    px = chartLeft + ((d.year - minYear) / (maxYear - minYear)) * chartW;
                                } else {
                                    px = chartRight - 30;
                                }

                                // Point
                                ctx.fillStyle = d.color;
                                ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();

                                // Label
                                ctx.fillStyle = d.color;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
                                ctx.fillText(d.label + (d.year ? ' (' + d.year + ')' : ''), px + 8, py - 2);
                            }

                            // Security zones
                            var safeY = chartBot - ((Math.log2(1024) - minLog) / (maxLog - minLog)) * chartH;
                            ctx.fillStyle = '#f8514911';
                            ctx.fillRect(chartLeft, safeY, chartW, chartBot - safeY);
                            ctx.fillStyle = '#3fb95011';
                            ctx.fillRect(chartLeft, chartTop, chartW, safeY - chartTop);

                            viz.screenText('INSECURE', chartRight - 40, chartBot - 20, '#f8514966', 10, 'center');
                            viz.screenText('SECURE', chartRight - 40, chartTop + 20, '#3fb95066', 10, 'center');

                            // Legend
                            viz.screenText('Key size (log scale)', chartLeft - 10, chartTop - 10, viz.colors.text, 10, 'center');
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many trial divisions (at most) are needed to factor \\(n = 10403\\) by brute force? What are its factors?',
                    hint: 'You only need to check divisors up to \\(\\sqrt{n}\\). Compute \\(\\sqrt{10403}\\).',
                    solution: '\\(\\sqrt{10403} \\approx 101.99\\), so we check primes up to 101. There are 26 primes up to 101. Testing: \\(10403 / 101 = 103\\). So \\(10403 = 101 \\times 103\\). In the worst case, 26 trial divisions suffice.'
                },
                {
                    question: 'If factoring a 512-bit number takes about 1 day with modern hardware, and the best factoring algorithms have sub-exponential running time \\(L_n[1/3, c]\\), roughly how much harder is factoring a 1024-bit number compared to a 512-bit number?',
                    hint: 'The sub-exponential form \\(L_n[1/3, c] = \\exp(c \\cdot (\\ln n)^{1/3} (\\ln \\ln n)^{2/3})\\) means doubling the bit length much more than doubles the exponent.',
                    solution: 'For the GNFS, doubling the bit length (from 512 to 1024) roughly cubes the exponent in the running time expression. The actual ratio depends on the constant \\(c \\approx 1.923\\), but estimates suggest factoring a 1024-bit number is roughly \\(10^{10}\\) to \\(10^{15}\\) times harder than a 512-bit number. This is why 2048-bit keys provide a comfortable security margin: the jump from 1024 to 2048 bits makes factoring inconceivably harder still.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Digital Signatures
        // ================================================================
        {
            id: 'sec-signatures',
            title: 'Digital Signatures',
            content: `
<h2>Digital Signatures</h2>

<p>RSA does more than encrypt messages. By reversing the roles of the public and private keys, it provides <strong>digital signatures</strong>: a way to prove that a message came from a specific sender and has not been altered.</p>

<div class="env-block definition">
    <div class="env-title">RSA Signature Scheme</div>
    <div class="env-body">
        <p><strong>Signing:</strong> To sign a message \\(m\\), the signer (who knows the private key \\(d\\)) computes:</p>
        \\[s = m^d \\bmod n\\]
        <p><strong>Verification:</strong> Anyone with the public key \\((e, n)\\) can verify the signature by computing:</p>
        \\[m' = s^e \\bmod n\\]
        <p>If \\(m' = m\\), the signature is valid.</p>
    </div>
</div>

<h3>Why Does This Work?</h3>

<p>The same RSA correctness theorem applies: \\(s^e = (m^d)^e = m^{de} \\equiv m \\pmod{n}\\). Only the holder of the private key \\(d\\) can produce a valid signature, because computing \\(m^d \\bmod n\\) requires \\(d\\). But anyone can verify it using the public key \\(e\\).</p>

<h3>Properties of Digital Signatures</h3>

<ul>
    <li><strong>Authentication:</strong> The signature proves the message came from the key owner (only they have \\(d\\)).</li>
    <li><strong>Integrity:</strong> If the message is altered after signing, verification will fail (\\(s^e \\ne m'\\)).</li>
    <li><strong>Non-repudiation:</strong> The signer cannot later deny having signed, since only their private key could have produced the signature.</li>
</ul>

<h3>Hash-then-Sign</h3>

<p>In practice, signing an entire large message with RSA is slow (RSA operations are much slower than symmetric encryption). Instead, one first computes a cryptographic hash \\(h = H(m)\\) of the message, then signs the hash: \\(s = h^d \\bmod n\\). The verifier hashes the received message and checks \\(s^e \\equiv H(m) \\pmod{n}\\).</p>

<div class="env-block example">
    <div class="env-title">Example: Sign and Verify</div>
    <div class="env-body">
        <p>Alice has private key \\((d, n) = (2753, 3233)\\) and public key \\((e, n) = (17, 3233)\\).</p>
        <p>She signs the message \\(m = 100\\):</p>
        \\[s = 100^{2753} \\bmod 3233 = 2726.\\]
        <p>Bob verifies using Alice's public key:</p>
        \\[s^e = 2726^{17} \\bmod 3233 = 100. \\quad \\checkmark\\]
        <p>The signature is valid. If Eve alters the message to \\(m' = 101\\), Bob computes \\(H(101) \\neq 100\\) and rejects the signature.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-digital-signature"></div>
`,
            visualizations: [
                {
                    id: 'viz-digital-signature',
                    title: 'Digital Signature: Sign and Verify',
                    description: 'Watch Alice sign a message with her private key, and Bob verify it with Alice\'s public key. Try tampering with the message to see the verification fail.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        var p = 61, q = 53;
                        var n = p * q; // 3233
                        var phi = (p - 1) * (q - 1);
                        var e = 17;

                        function modInverse(a, m) {
                            function ext(a, b) { if (a === 0) return [b, 0, 1]; var r = ext(b % a, a); return [r[0], r[2] - Math.floor(b / a) * r[1], r[1]]; }
                            var r = ext(a % m, m);
                            return ((r[1] % m) + m) % m;
                        }
                        function modPow(base, exp, mod) {
                            var result = 1; base = base % mod;
                            while (exp > 0) {
                                if (exp % 2 === 1) result = (result * base) % mod;
                                exp = Math.floor(exp / 2);
                                base = (base * base) % mod;
                            }
                            return result;
                        }

                        var d = modInverse(e, phi);
                        var message = 100;
                        var tampered = false;

                        VizEngine.createSlider(controls, 'Message', 2, 3232, message, 1, function(v) {
                            message = Math.round(v);
                            tampered = false;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Tamper!', function() {
                            tampered = !tampered;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var sig = modPow(message, d, n);
                            var receivedMsg = tampered ? ((message + 1) % n) : message;
                            var verified = modPow(sig, e, n);
                            var valid = (verified === receivedMsg);

                            viz.screenText('RSA Digital Signatures', viz.width / 2, 18, viz.colors.white, 15);

                            var aliceX = 100, bobX = 460;

                            // Alice
                            ctx.fillStyle = viz.colors.purple;
                            ctx.beginPath(); ctx.arc(aliceX, 55, 18, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('A', aliceX, 55);
                            viz.screenText('Alice (signer)', aliceX, 82, viz.colors.purple, 11);

                            // Bob
                            ctx.fillStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(bobX, 55, 18, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('B', bobX, 55);
                            viz.screenText('Bob (verifier)', bobX, 82, viz.colors.teal, 11);

                            // Step 1: Alice's message
                            var y1 = 105;
                            ctx.fillStyle = viz.colors.green + '22';
                            ctx.fillRect(aliceX - 80, y1, 160, 28);
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1;
                            ctx.strokeRect(aliceX - 80, y1, 160, 28);
                            viz.screenText('Message m = ' + message, aliceX, y1 + 14, viz.colors.green, 12);

                            // Step 2: Sign
                            var y2 = 148;
                            ctx.fillStyle = viz.colors.purple + '22';
                            ctx.fillRect(aliceX - 80, y2, 160, 28);
                            ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 1;
                            ctx.strokeRect(aliceX - 80, y2, 160, 28);
                            viz.screenText('s = m^d mod n = ' + sig, aliceX, y2 + 14, viz.colors.purple, 11);

                            // Arrow: Alice signs
                            ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(aliceX, y1 + 28); ctx.lineTo(aliceX, y2); ctx.stroke();

                            // Step 3: Send (m, s)
                            var y3 = 200;
                            ctx.strokeStyle = tampered ? viz.colors.red : viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(aliceX + 30, y3); ctx.lineTo(bobX - 30, y3); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(bobX - 30, y3); ctx.lineTo(bobX - 40, y3 - 5); ctx.moveTo(bobX - 30, y3); ctx.lineTo(bobX - 40, y3 + 5); ctx.stroke();

                            var sendLabel = tampered ? 'Eve tampers: m\' = ' + receivedMsg + ', s = ' + sig : 'Send (m = ' + message + ', s = ' + sig + ')';
                            viz.screenText(sendLabel, viz.width / 2, y3 - 14, tampered ? viz.colors.red : viz.colors.blue, 10);

                            if (tampered) {
                                // Eve icon
                                ctx.fillStyle = viz.colors.red;
                                ctx.beginPath(); ctx.arc(viz.width / 2, y3 + 20, 12, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white; ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.fillText('E', viz.width / 2, y3 + 20);
                                viz.screenText('Eve', viz.width / 2, y3 + 38, viz.colors.red, 9);
                            }

                            // Step 4: Bob receives
                            var y4 = 240;
                            ctx.fillStyle = (tampered ? viz.colors.red : viz.colors.green) + '22';
                            ctx.fillRect(bobX - 90, y4, 180, 28);
                            ctx.strokeStyle = tampered ? viz.colors.red : viz.colors.green; ctx.lineWidth = 1;
                            ctx.strokeRect(bobX - 90, y4, 180, 28);
                            viz.screenText('Received m\' = ' + receivedMsg + ', s = ' + sig, bobX, y4 + 14, tampered ? viz.colors.red : viz.colors.green, 11);

                            // Step 5: Verify
                            var y5 = 285;
                            ctx.fillStyle = viz.colors.teal + '22';
                            ctx.fillRect(bobX - 90, y5, 180, 28);
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1;
                            ctx.strokeRect(bobX - 90, y5, 180, 28);
                            viz.screenText('s^e mod n = ' + verified, bobX, y5 + 14, viz.colors.teal, 12);

                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(bobX, y4 + 28); ctx.lineTo(bobX, y5); ctx.stroke();

                            // Step 6: Result
                            var y6 = 335;
                            if (valid) {
                                ctx.fillStyle = viz.colors.green + '33';
                                ctx.fillRect(bobX - 90, y6, 180, 35);
                                ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                                ctx.strokeRect(bobX - 90, y6, 180, 35);
                                viz.screenText('\u2713 Valid: ' + verified + ' = ' + receivedMsg, bobX, y6 + 18, viz.colors.green, 13);
                            } else {
                                ctx.fillStyle = viz.colors.red + '33';
                                ctx.fillRect(bobX - 90, y6, 180, 35);
                                ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2;
                                ctx.strokeRect(bobX - 90, y6, 180, 35);
                                viz.screenText('\u2717 INVALID: ' + verified + ' \u2260 ' + receivedMsg, bobX, y6 + 18, viz.colors.red, 13);
                            }

                            // Legend at bottom
                            viz.screenText('Alice\'s private key (d=' + d + ') signs.  Alice\'s public key (e=' + e + ') verifies.', viz.width / 2, viz.height - 15, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using keys \\((e, n) = (17, 3233)\\) and \\((d, n) = (2753, 3233)\\), sign the message \\(m = 50\\) and verify the signature.',
                    hint: 'Compute \\(s = 50^{2753} \\bmod 3233\\), then check \\(s^{17} \\bmod 3233 = 50\\).',
                    solution: 'Sign: \\(s = 50^{2753} \\bmod 3233 = 981\\). Verify: \\(981^{17} \\bmod 3233 = 50 = m\\). The signature is valid. (In practice, you would use repeated squaring for these computations.)'
                },
                {
                    question: 'Why does the hash-then-sign approach improve RSA signatures? What would go wrong if we signed arbitrary-length messages directly?',
                    hint: 'Think about message size relative to \\(n\\), and the computational cost of RSA operations.',
                    solution: 'RSA requires \\(m < n\\), so messages longer than \\(n\\) cannot be signed directly without splitting. Even short messages make RSA slow (modular exponentiation on large numbers). Hashing first compresses any message to a fixed-size digest (e.g., 256 bits for SHA-256), which is always smaller than \\(n\\). The signer performs only one RSA operation on the small hash. Additionally, hashing provides collision resistance: an attacker cannot find two messages with the same hash, preventing signature forgery by substitution.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge — What's Next
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Forward',
            content: `
<h2>RSA in Context</h2>

<p>RSA brings together the core ideas of this number theory unit. Primes (Chapter 14) give us the raw material. Modular arithmetic (Chapter 15) gives us the computational framework. Euler's theorem closes the loop, guaranteeing that encryption and decryption are inverses. This is a striking demonstration of how "pure" mathematics becomes the backbone of practical technology.</p>

<h3>What We Built</h3>

<ul>
    <li><strong>Key generation</strong> from two primes, Euler's totient, and modular inverses</li>
    <li><strong>Encryption and decryption</strong> via modular exponentiation, justified by Euler's theorem</li>
    <li><strong>Security</strong> grounded in the (conjectured) hardness of integer factoring</li>
    <li><strong>Digital signatures</strong> by reversing the encrypt/decrypt roles</li>
</ul>

<h3>Beyond RSA</h3>

<p>RSA was the first widely deployed public-key system, but it is not the only one. Other important systems include:</p>

<ul>
    <li><strong>Diffie-Hellman key exchange</strong> (1976): based on the discrete logarithm problem in cyclic groups.</li>
    <li><strong>Elliptic Curve Cryptography (ECC)</strong>: achieves the same security as RSA with much smaller keys, using the group structure of elliptic curves over finite fields.</li>
    <li><strong>Post-quantum cryptography</strong>: lattice-based (NTRU, Kyber), hash-based (SPHINCS+), and code-based schemes, designed to resist quantum attacks.</li>
</ul>

<h3>What Comes Next</h3>

<p>With the number theory unit complete, we move to <strong>Part F: Advanced Topics</strong>. Chapter 17 on Boolean Algebra and Circuits will connect the logic of Chapter 0 to the physical hardware that executes the RSA computations we have been studying. Every modular exponentiation that secures your internet connection is ultimately performed by Boolean gates on a silicon chip.</p>

<div class="env-block remark">
    <div class="env-title">The Big Picture</div>
    <div class="env-body">
        <p>Discrete mathematics is not a collection of isolated topics. Logic (Part A) gives us the language of proof. Sets and functions (Part B) give us the language of structure. Counting (Part C) lets us measure possibilities. Graphs (Part D) model relationships. Number theory (Part E) secures communication. And the advanced topics in Part F tie these threads together into the foundations of computer science itself.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Suppose you are designing a system that needs to remain secure for 30 years. Would you choose 2048-bit or 4096-bit RSA keys? Justify your answer considering the historical trend of key-size breakage.',
                    hint: 'Look at the table of broken key sizes. What is the trend? How does Moore\'s law (and potential quantum computers) factor in?',
                    solution: 'For 30-year security, 4096-bit keys are the safer choice. Historical data shows that factoring capability roughly doubles every 8 years: RSA-512 was broken in 1999, RSA-768 in 2009. Extrapolating, 1024-bit keys may become factored within a decade. 2048-bit keys are currently safe, but 30 years is a long horizon. More critically, if large quantum computers become practical (Shor\'s algorithm), RSA of any size is broken. For long-term security, one should combine larger RSA keys with a migration plan toward post-quantum algorithms.'
                }
            ]
        }
    ]
});
