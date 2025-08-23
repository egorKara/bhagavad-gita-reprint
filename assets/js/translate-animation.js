(function () {
    function ensureWrapForNode(unit) {
        const node = unit.node;
        if (!node || !node.parentNode) return null;
        // If node is already inside our wrapper
        if (node.parentNode.classList && node.parentNode.classList.contains('i18n-anim-wrap')) {
            return node.parentNode;
        }
        // Create wrapper span
        const wrap = document.createElement('span');
        wrap.className = 'i18n-anim-wrap';
        wrap.style.position = 'relative';
        wrap.style.display = 'inline';
        // Replace text node with wrapper containing a span for text
        const textSpan = document.createElement('span');
        textSpan.className = 'i18n-anim-text';
        textSpan.textContent = node.nodeValue;
        wrap.appendChild(textSpan);
        node.parentNode.replaceChild(wrap, node);
        return wrap;
    }

    function getTextSpan(wrap) {
        let t = wrap.querySelector('.i18n-anim-text');
        if (!t) {
            t = document.createElement('span');
            t.className = 'i18n-anim-text';
            t.textContent = wrap.textContent;
            wrap.innerHTML = '';
            wrap.appendChild(t);
        }
        return t;
    }

    function createCanvas(wrap, rect) {
        const c = document.createElement('canvas');
        c.className = 'i18n-dust-canvas';
        c.width = Math.max(1, Math.floor(rect.width));
        c.height = Math.max(1, Math.floor(rect.height));
        c.style.position = 'absolute';
        c.style.left = '0';
        c.style.top = '0';
        c.style.pointerEvents = 'none';
        c.style.mixBlendMode = 'multiply';
        wrap.appendChild(c);
        return c;
    }

    function particleColorFrom(el) {
        const cs = getComputedStyle(el);
        // Use text color slightly "sandy"
        const col = cs.color || 'rgb(44,24,16)';
        // Return rgba string with slight opacity; we can mix with warm sand color
        return { base: col, sand: 'rgba(139,69,19,0.7)' };
    }

    function dustSwap(unit, newText) {
        try {
            const wrap = ensureWrapForNode(unit);
            if (!wrap) {
                unit.apply(newText);
                return;
            }
            const textSpan = getTextSpan(wrap);
            const rect = textSpan.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                textSpan.textContent = newText;
                return;
            }
            const c = createCanvas(wrap, rect);
            const ctx = c.getContext('2d');
            const colors = particleColorFrom(textSpan);
            const particles = [];
            const density = Math.min(120, Math.max(30, Math.floor((rect.width * rect.height) / 600))); // cap
            for (let i = 0; i < density; i++) {
                particles.push({
                    x: Math.random() * c.width,
                    y: Math.random() * c.height,
                    vx: (Math.random() - 0.5) * 0.7,
                    vy: -Math.random() * 0.5 - 0.3,
                    g: 0.015 + Math.random() * 0.02,
                    life: 300 + Math.random() * 300,
                    r: 1 + Math.random() * 1.5,
                    color: Math.random() < 0.5 ? colors.sand : colors.base
                });
            }
            let start = performance.now();
            const duration = 650;
            // Fade out old text quickly
            textSpan.style.transition = 'opacity 160ms ease-out, filter 200ms ease-out';
            textSpan.style.filter = 'blur(0px)';
            requestAnimationFrame(() => {
                textSpan.style.opacity = '0';
                textSpan.style.filter = 'blur(1px)';
            });

            function drawParticles(t) {
                const elapsed = t - start;
                ctx.clearRect(0, 0, c.width, c.height);
                particles.forEach((p) => {
                    // Simple Euler integration
                    p.vy += p.g;
                    p.x += p.vx * 3;
                    p.y += p.vy * 3;
                    const alpha = Math.max(0, 1 - elapsed / p.life);
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                });
                if (elapsed < duration) {
                    requestAnimationFrame(drawParticles);
                }
            }
            requestAnimationFrame(drawParticles);

            // Midway swap text and fade in
            setTimeout(() => {
                textSpan.textContent = newText;
                textSpan.style.transition = 'opacity 240ms ease-out, filter 240ms ease-out';
                textSpan.style.opacity = '0';
                textSpan.style.filter = 'blur(1px)';
                requestAnimationFrame(() => {
                    textSpan.style.opacity = '1';
                    textSpan.style.filter = 'blur(0px)';
                });
            }, 200);

            // Cleanup
            setTimeout(() => {
                if (c && c.parentNode) c.parentNode.removeChild(c);
            }, duration + 50);
        } catch (e) {
            // Fallback: direct apply
            unit.apply(newText);
        }
    }

    window.TranslationAnimation = { dustSwap };
})();
