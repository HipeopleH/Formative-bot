// ==UserScript==
// @name        Formative Bot
// @namespace    formative-bot
// @version      4.1.0
// @description  AIAIAIAIAIAIAIIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAI
// @match        https://app.formative.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      generativelanguage.googleapis.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// ==/UserScript==

(() => {
    'use strict';

    if (window.__fasCleanup) window.__fasCleanup();

    const css = document.createElement('style');
    css.textContent = `
    #fas {
      --bg:#0b101a;--panel:#111a29;--line:#26364d;
      --txt:#e6eefb;--muted:#8d9bb2;--green:#49efad;--blue:#70adff;
      position:fixed;top:80px;right:20px;width:390px;max-width:calc(100vw - 16px);
      max-height:calc(100vh - 16px);overflow:auto;z-index:2147483647;
      background:var(--bg);color:var(--txt);border:1px solid #304663;
      border-radius:13px;box-shadow:0 15px 45px #0009;
      font:12px/1.45 Segoe UI,Arial,sans-serif;
    }
    #fas *{box-sizing:border-box}
    #fas button,#fas input,#fas select{font:inherit}
    #fas button{cursor:pointer}
    #fas button:focus-visible,#fas input:focus-visible,#fas select:focus-visible{
      outline:2px solid var(--green);outline-offset:2px}
    #fas .top{position:sticky;top:0;display:flex;align-items:center;gap:9px;
      padding:11px 12px;background:#101827;border-bottom:1px solid var(--line);
      cursor:grab;z-index:2;touch-action:none}
    #fas .logo{display:grid;place-items:center;width:30px;height:30px;
      border-radius:9px;color:var(--green);background:#49efad15;font-size:21px}
    #fas .title{font-weight:800;font-size:13px}
    #fas .sub{color:var(--muted);font-size:10px}
    #fas .spacer{flex:1}
    #fas .status{color:var(--green);font-size:10px;white-space:nowrap}
    #fas .iconbtn{background:transparent;border:0;color:var(--muted);
      font-size:17px;padding:2px 5px}
    #fas .nav{display:flex;gap:5px;padding:8px;border-bottom:1px solid var(--line);
      background:#0d1420}
    #fas .nav button{flex:1;padding:7px 3px;border:1px solid transparent;
      border-radius:7px;background:transparent;color:var(--muted);font-size:11px}
    #fas .nav button.active{color:var(--green);background:#49efad12;
      border-color:#49efad30}
    #fas .content{padding:12px}
    #fas .page{display:none}
    #fas .page.active{display:block}
    #fas .label{display:block;color:#b7c6dc;margin:10px 0 5px;font-size:11px}
    #fas .field{width:100%;height:34px;padding:0 9px;border-radius:7px;
      background:#121d2d;border:1px solid var(--line);color:var(--txt)}
    #fas .row{display:flex;gap:7px;align-items:center}
    #fas .row>*{min-width:0;flex:1}
    #fas .btn{padding:8px 10px;border-radius:7px;border:1px solid var(--line);
      background:#152136;color:var(--txt);text-align:center;text-decoration:none;display:inline-block;}
    #fas .primary{background:var(--green);border-color:var(--green);
      color:#07150f;font-weight:800}
    #fas .box{padding:10px;border:1px solid var(--line);
      border-radius:9px;background:var(--panel);margin-top:9px}
    #fas .muted{color:var(--muted);font-size:10px}
    #fas .console{height:140px;overflow:auto;background:#080d15;
      border:1px solid var(--line);border-radius:8px;padding:9px;
      font:10px/1.8 Consolas,monospace;overflow-wrap:anywhere}
    #fas .logline{color:#b0bfd5}
    #fas .ok{color:var(--green)}
    #fas .info{color:var(--blue)}
    #fas .error{color:#ff9696}
    #fas a { color: var(--blue); text-decoration: none; }
    #fas a:hover { text-decoration: underline; }
    @media(max-width:420px){#fas{right:8px;width:calc(100vw - 16px)}}
    `;
    document.head.appendChild(css);

    const ui = document.createElement('div');
    ui.id = 'fas';
    ui.innerHTML = `
      <header class="top" id="fas-drag">
        <div class="logo">F</div>
        <div><div class="title">Formative <span style="color:#49efad">Bot</span></div>
          <div class="sub">Auto-Solver</div></div>
        <div class="spacer"></div>
        <span class="status" id="fas-status">● READY</span>
        <button class="iconbtn" id="fas-hide" title="Hide">−</button>
        <button class="iconbtn" id="fas-delete" title="Delete UI">×</button>
      </header>
      <nav class="nav">
        <button class="active" data-page="home">⌂ Solver</button>
        <button data-page="models">✧ Models</button>
        <button data-page="history">☷ History</button>
        <button data-page="about">ⓘ About</button>
      </nav>
      <main class="content">
        <section class="page active" data-section="home">
          <div style="font-weight:750">Active Workspace</div>
          <div class="muted">Configure your API key & model to solve current view.</div>

          <label class="label" for="fas-key">Gemini API Key</label>
          <input class="field" id="fas-key" type="password" placeholder="AIzaSy..." autocomplete="off">

          <div class="row" style="margin-top:8px">
            <button class="btn" id="fas-toggle-key">Show key</button>
            <a class="btn" href="https://aistudio.google.com/api-keys" target="_blank">Get API Key</a>
          </div>

          <div class="row" style="margin-top:6px">
            <button class="btn" id="fas-test-key" style="width:100%;">✓ Test API Key</button>
          </div>

          <label class="label" for="fas-model">Gemini Model</label>
          <select class="field" id="fas-model">
              <optgroup label="Text-out Models">
                  <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
                  <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                  <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
                  <option value="gemini-2-flash">Gemini 2 Flash</option>
                  <option value="gemini-2-flash-lite">Gemini 2 Flash Lite</option>
              </optgroup>
              <optgroup label="Agents">
                  <option value="antigravity">Antigravity</option>
                  <option value="deep-research-pro-preview">Deep Research Pro Preview</option>
              </optgroup>
              <optgroup label="Multi-modal Generative Models">
                  <option value="gemini-2.5-flash-preview-image">Nano Banana (Gemini 2.5 Flash Preview Image)</option>
                  <option value="gemini-2.5-flash-preview-tts">Gemini 2.5 Flash TTS</option>
              </optgroup>
              <optgroup label="Other Models">
                  <option value="computer-use-preview">Computer Use Preview</option>
              </optgroup>
          </select>

          <label class="label" style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-top:10px;">
            <input type="checkbox" id="fas-thinking" style="width:16px;height:16px;accent-color:var(--green);">
            <span style="color:#b7c6dc;font-weight:600;">Enable Think / Reasoning Mode</span>
          </label>

          <label class="label" style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-top:6px;">
            <input type="checkbox" id="fas-image-parsing" style="width:16px;height:16px;accent-color:var(--green);">
            <span style="color:#b7c6dc;font-weight:600;">Enable Image Parsing (Vision)</span>
          </label>

          <button class="btn primary" id="fas-run" style="width:100%;margin-top:11px">
            ϟ &nbsp; Solve Current View
          </button>

          <div class="box">
            <div class="row" style="margin-bottom:7px">
              <strong>Activity log</strong><span class="spacer"></span>
              <button class="iconbtn" id="fas-clear" title="Clear log">⌫</button>
            </div>
            <div class="console" id="fas-log" aria-live="polite">
              <div class="logline ok">✓ Interface initialized.</div>
              <div class="logline info">› Ready to query Gemini API.</div>
            </div>
          </div>
        </section>

        <section class="page" data-section="models">
          <strong>Model configuration</strong>
          <div class="muted">Currently active engine configuration.</div>
          <label class="label">Active Provider</label>
          <select class="field" disabled>
            <option>Google Gemini API</option>
          </select>
          <div class="box">
            <div class="muted">If a model fails or hits limits, try switching models from the dropdown in the Solver tab.</div>
          </div>
        </section>

        <section class="page" data-section="history">
          <strong>Session history</strong>
          <div class="muted">Activity log in this open panel session.</div>
          <div id="fas-history" style="margin-top:8px;"></div>
          <button class="btn" id="fas-history-clear" style="margin-top:10px">Clear history</button>
        </section>

        <section class="page" data-section="about">
          <strong>About Formative Bot</strong>
          <div class="muted">Automated questions solving assistant.</div>

          <div class="box">
            <strong style="color:var(--green)">⚠️ Verify Your Answers</strong>
            <div class="muted" style="margin-top:6px">
              Artificial intelligence models can hallucinate or misinterpret visual elements, text formatting, or question contexts. Always double-check generated answers before final submission!
            </div>
          </div>

          <div class="box">
            <strong style="color:var(--blue)">🛠️ Work in Progress</strong>
            <div class="muted" style="margin-top:6px">
              Formative Bot is an actively evolving experimental utility. DOM layouts, selector logic, and API interactions may change or require adjustments over time.
            </div>
          </div>

          <div class="box">
            <strong>Disclaimer</strong>
            <div class="muted" style="margin-top:6px">
              Built purely for educational experimentation, automation scripting exploration, and web interface analysis.
            </div>
          </div>
        </section>
      </main>
    `;
    document.body.appendChild(ui);

    const $ = id => document.getElementById(id);
    let hidden = false;
    let running = false;
    let history = [];

    // Load saved settings
    const apiKeyInput = $('fas-key');
    apiKeyInput.value = GM_getValue('ollie_gemini_key', '');
    apiKeyInput.addEventListener('input', () => GM_setValue('ollie_gemini_key', apiKeyInput.value));

    const modelSelect = $('fas-model');
    modelSelect.value = GM_getValue('ollie_gemini_model', 'gemini-3.5-flash-lite');
    modelSelect.addEventListener('change', () => GM_setValue('ollie_gemini_model', modelSelect.value));

    const thinkingCheckbox = $('fas-thinking');
    thinkingCheckbox.checked = GM_getValue('ollie_gemini_thinking', false);
    thinkingCheckbox.addEventListener('change', () => GM_setValue('ollie_gemini_thinking', thinkingCheckbox.checked));

    const imageParsingCheckbox = $('fas-image-parsing');
    imageParsingCheckbox.checked = GM_getValue('ollie_gemini_image_parsing', true);
    imageParsingCheckbox.addEventListener('change', () => GM_setValue('ollie_gemini_image_parsing', imageParsingCheckbox.checked));

    function log(message, kind = 'info') {
      const line = document.createElement('div');
      line.className = 'logline ' + kind;
      line.textContent = (kind === 'ok' ? '✓ ' : kind === 'error' ? '! ' : '› ') + message;
      $('fas-log').appendChild(line);
      $('fas-log').scrollTop = $('fas-log').scrollHeight;
    }

    function status(message) {
      $('fas-status').textContent = '● ' + message;
    }

    function navigate(page) {
      ui.querySelectorAll('[data-page]').forEach(b =>
        b.classList.toggle('active', b.dataset.page === page));
      ui.querySelectorAll('[data-section]').forEach(s =>
        s.classList.toggle('active', s.dataset.section === page));
    }

    ui.querySelectorAll('[data-page]').forEach(button =>
      button.addEventListener('click', () => navigate(button.dataset.page)));

    $('fas-toggle-key').addEventListener('click', () => {
      const key = $('fas-key');
      key.type = key.type === 'password' ? 'text' : 'password';
      $('fas-toggle-key').textContent = key.type === 'password' ? 'Show key' : 'Hide key';
    });

    $('fas-clear').addEventListener('click', () => {
      $('fas-log').textContent = '';
      log('Log cleared.', 'ok');
      status('READY');
    });

    function renderHistory() {
      const area = $('fas-history');
      area.textContent = '';
      if (!history.length) {
        area.textContent = 'No activity yet.';
        return;
      }
      history.forEach(item => {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = item;
        area.appendChild(box);
      });
    }

    $('fas-history-clear').addEventListener('click', () => {
      history = [];
      renderHistory();
    });

    // --- API Key Testing Logic ---
    $('fas-test-key').addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        const selectedModel = modelSelect.value;
        if (!apiKey) {
            log('Enter an API key first.', 'error');
            status('KEY REQUIRED');
            return;
        }

        status('TESTING');
        log('Testing API key with a minimal request...');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            timeout: 15000,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] }),
            onload: (res) => {
                if (res.status === 200) {
                    log('API Key is valid and working!', 'ok');
                    status('KEY VALID');
                } else {
                    log(`API Key test failed (Status ${res.status}). Check key or model.`, 'error');
                    status('KEY INVALID');
                }
            },
            onerror: () => {
                log('Network error while testing API key.', 'error');
                status('ERROR');
            },
            ontimeout: () => {
                log('API key test timed out.', 'error');
                status('TIMEOUT');
            }
        });
    });

    // --- Core Solver Execution Logic ---
    $('fas-run').addEventListener('click', async () => {
        if (running) return;
        const apiKey = apiKeyInput.value.trim();
        const selectedModel = modelSelect.value;
        const thinkingEnabled = thinkingCheckbox.checked;
        const imageParsingEnabled = imageParsingCheckbox.checked;

        if (!apiKey) {
            log('API key is missing.', 'error');
            status('KEY REQUIRED');
            return;
        }

        running = true;

        try {
            let payloadData;
            if (imageParsingEnabled) {
                status('CAPTURING');
                log('Capturing viewport image...');
                ui.style.display = 'none';
                const canvas = await html2canvas(document.body, {
                    useCORS: true,
                    scale: window.devicePixelRatio > 1 ? 1 : 2
                });
                ui.style.display = hidden ? 'none' : 'block';
                payloadData = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
            } else {
                status('SCRAPING');
                log('Extracting page text content...');
                payloadData = document.body.innerText;
            }

            status('QUERYING');
            log(`Querying ${selectedModel} ${thinkingEnabled ? '(with Think Mode)' : ''} [${imageParsingEnabled ? 'Vision' : 'Text-only'}...]`);

            const solution = await askGemini(apiKey, selectedModel, payloadData, imageParsingEnabled, thinkingEnabled);
            await executeFormativeAnswers(solution);

            running = false;
            status('READY');
            history.unshift(`Solved view · ${new Date().toLocaleTimeString()}`);
            renderHistory();
        } catch (e) {
            ui.style.display = hidden ? 'none' : 'block';
            running = false;
            status('ERROR');
            log(`Error: ${e.message}`, 'error');
        }
    });

    async function askGemini(apiKey, model, data, isVision, thinkingEnabled) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const thinkingDirective = thinkingEnabled
            ? "CRITICAL: Before outputting JSON, perform step-by-step mathematical calculations and reasoning inside a <think>...</think> block to ensure accuracy."
            : "";

        const prompt = `You are an automated solver for GoFormative questions on screen.
Analyze the provided ${isVision ? 'screenshot of the page' : 'page text content'} carefully.
${thinkingDirective}

Respond ONLY with a raw, valid JSON object following this format:
{
  "type": "single" | "multiple" | "text" | "drag_drop" | "dropdown",
  "answers": ["Answer 1 for 1st input box", "Answer 2 for 2nd input box"],
  "matches": [
    {"drag": "Source Item Text / Answer", "drop": "Target Container Text / Statement"}
  ],
  "dropdowns": [
    {"index": 0, "choice": "Exact correct dropdown option text"}
  ]
}

Instructions:
1. For single-choice questions, set type="single" and answers=["exact option text"].
2. For multiple-selection / checkboxes, set type="multiple" and list all correct options in answers.
3. For text input boxes, set type="text" and list ALL answers in order from top to bottom inside the "answers" array.
4. For matching or drag-and-drop questions, set type="drag_drop". In "matches", set "drag" as the movable answer/item and "drop" as the target.
5. For inline sentences containing select dropdown menus, set type="dropdown" and list each dropdown's target choice sequentially with its 0-based index.`;

        let parts = [{ text: prompt }];
        if (isVision) {
            parts.push({
                inline_data: {
                    mime_type: 'image/jpeg',
                    data: data
                }
            });
        } else {
            parts.push({
                text: `\n\n--- PAGE TEXT CONTENT ---\n${data}`
            });
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                timeout: 20000,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ contents: [{ parts: parts }] }),
                onload: (res) => {
                    if (res.status === 200) {
                        try {
                            const json = JSON.parse(res.responseText);
                            let rawText = json.candidates[0].content.parts[0].text.trim();

                            const jsonStart = rawText.indexOf('{');
                            const jsonEnd = rawText.lastIndexOf('}');
                            if (jsonStart !== -1 && jsonEnd !== -1) {
                                rawText = rawText.substring(jsonStart, jsonEnd + 1);
                            } else {
                                rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
                            }

                            const parsed = JSON.parse(rawText);
                            resolve(parsed);
                        } catch (err) { reject(new Error('JSON Parse failed')); }
                    } else {
                        reject(new Error(`API fail: Status ${res.status} (${res.statusText || 'Check model/key'})`));
                    }
                },
                onerror: () => reject(new Error('Network connection error')),
                ontimeout: () => reject(new Error('API request timed out (20s)'))
            });
        });
    }

    // --- Helper function to type text character by character manually ---
    async function typeManually(inputEl, text) {
        inputEl.focus();
        if (inputEl.tagName === 'INPUT' || inputEl.tagName === 'TEXTAREA') {
            inputEl.value = '';
        } else if (inputEl.isContentEditable) {
            inputEl.innerText = '';
        }

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
            inputEl.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));

            if (inputEl.tagName === 'INPUT' || inputEl.tagName === 'TEXTAREA') {
                inputEl.value += char;
            } else if (inputEl.isContentEditable) {
                inputEl.innerText += char;
            }

            inputEl.dispatchEvent(new InputEvent('input', { data: char, inputType: 'insertText', bubbles: true }));
            inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));

            const randomDelay = Math.floor(Math.random() * 60) + 30;
            await new Promise(r => setTimeout(r, randomDelay));
        }

        inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        inputEl.blur();
    }

    async function executeFormativeAnswers(solution) {
        if (!solution || !solution.type) {
            log('Could not determine question type from response.', 'error');
            return;
        }

        // 1. Single Choice
        if (solution.type === 'single' && solution.answers && solution.answers.length > 0) {
            const cleanTarget = solution.answers[0].toLowerCase().trim();
            const allElements = Array.from(document.querySelectorAll('label, div[role="radio"], input[type="radio"], div[class*="Option"], div[class*="choice"]'));

            let selected = false;
            allElements.forEach(el => {
                const textContent = el.innerText ? el.innerText.toLowerCase().trim() : '';
                const ariaLabel = el.getAttribute('aria-label') ? el.getAttribute('aria-label').toLowerCase().trim() : '';

                if ((textContent && (textContent.includes(cleanTarget) || cleanTarget.includes(textContent))) ||
                    (ariaLabel && (ariaLabel.includes(cleanTarget) || cleanTarget.includes(ariaLabel)))) {
                    const targetInput = el.tagName === 'INPUT' ? el : (el.querySelector('input') || el);
                    triggerClick(targetInput);
                    selected = true;
                }
            });

            if (selected) {
                log(`Selected single choice: ${solution.answers[0]}`, 'ok');
            } else {
                log(`Could not find element for single choice: ${solution.answers[0]}`, 'error');
            }
            return;
        }

        // 2. Multiple Choice / Checkboxes
        if (solution.type === 'multiple' && solution.answers && solution.answers.length > 0) {
            let selectedCount = 0;
            solution.answers.forEach(targetAns => {
                const cleanTarget = targetAns.toLowerCase().trim();
                const allElements = Array.from(document.querySelectorAll('label, div[role="checkbox"], input[type="checkbox"], div[class*="Option"], div[class*="choice"]'));

                let matched = false;
                allElements.forEach(el => {
                    const textContent = el.innerText ? el.innerText.toLowerCase().trim() : '';
                    const ariaLabel = el.getAttribute('aria-label') ? el.getAttribute('aria-label').toLowerCase().trim() : '';

                    if ((textContent && (textContent.includes(cleanTarget) || cleanTarget.includes(textContent))) ||
                        (ariaLabel && (ariaLabel.includes(cleanTarget) || cleanTarget.includes(ariaLabel)))) {
                        const targetInput = el.tagName === 'INPUT' ? el : (el.querySelector('input') || el);
                        triggerClick(targetInput);
                        matched = true;
                    }
                });

                if (matched) {
                    log(`Selected multiple choice option: ${targetAns}`, 'ok');
                    selectedCount++;
                } else {
                    log(`Could not find element for option: ${targetAns}`, 'error');
                }
            });
            return;
        }

        // 3. Drag and Drop
        if (solution.type === 'drag_drop' && solution.matches) {
            log('=== Drag and Drop Matches ===', 'info');
            solution.matches.forEach(m => {
                log(`${m.drag} | ${m.drop}`, 'ok');
            });
            return;
        }

        // 4. Dropdown / Inline Choice
        if (solution.type === 'dropdown' && solution.dropdowns) {
            const dropdowns = document.querySelectorAll('select, div[class*="Dropdown"], div[class*="dropdown"], [role="combobox"]');
            solution.dropdowns.forEach((item) => {
                const targetDropdown = dropdowns[item.index];
                if (targetDropdown) {
                    if (targetDropdown.tagName === 'SELECT') {
                        targetDropdown.value = item.choice;
                        targetDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        triggerClick(targetDropdown);
                        setTimeout(() => {
                            const options = document.querySelectorAll('[role="option"], div[class*="option"], li');
                            options.forEach(opt => {
                                if (opt.innerText.toLowerCase().includes(item.choice.toLowerCase())) {
                                    triggerClick(opt);
                                }
                            });
                        }, 250);
                    }
                    log(`Dropdown #${item.index + 1}: Selected '${item.choice}'`, 'ok');
                } else {
                    log(`Dropdown #${item.index + 1}: Match '${item.choice}' (Manual needed)`, 'error');
                }
            });
            return;
        }

        // 5. Text Typing Input
        if (solution.type === 'text' && solution.answers && solution.answers.length > 0) {
            const inputs = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');

            for (let i = 0; i < inputs.length && i < solution.answers.length; i++) {
                await typeManually(inputs[i], solution.answers[i]);
                log(`Typed into input #${i + 1}: ${solution.answers[i]}`, 'ok');
            }
            return;
        }
    }

    function triggerClick(element) {
        if (!element) return;
        element.click();
        ['mousedown', 'mouseup', 'click'].forEach(evtType => {
            element.dispatchEvent(new MouseEvent(evtType, {
                bubbles: true,
                cancelable: true
            }));
        });
    }

    // --- UI Window Controls & Dragging ---
    function toggleHidden() {
      hidden = !hidden;
      ui.style.display = hidden ? 'none' : 'block';
    }

    function deleteUI() {
      document.removeEventListener('keydown', onKey);
      ui.remove();
      css.remove();
      window.__fasCleanup = null;
    }

    function onKey(event) {
      if (event.code === 'ShiftRight' && !event.repeat &&
          !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        toggleHidden();
      }
      if (event.ctrlKey && event.code === 'KeyX') {
        event.preventDefault();
        deleteUI();
      }
    }
    document.addEventListener('keydown', onKey, true);

    const drag = $('fas-drag');
    let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;

    drag.addEventListener('pointerdown', event => {
      if (event.target.closest('button')) return;
      dragging = true;
      const rect = ui.getBoundingClientRect();
      startX = event.clientX;
      startY = event.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      ui.style.right = 'auto';
      ui.style.left = startLeft + 'px';
      ui.style.top = startTop + 'px';
      drag.setPointerCapture(event.pointerId);
    });

    drag.addEventListener('pointermove', event => {
      if (!dragging) return;
      ui.style.left = (startLeft + event.clientX - startX) + 'px';
      ui.style.top = (startTop + event.clientY - startY) + 'px';
    });

    const stopDrag = () => { dragging = false; };
    drag.addEventListener('pointerup', stopDrag);
    drag.addEventListener('pointercancel', stopDrag);

    $('fas-hide').addEventListener('click', toggleHidden);
    $('fas-delete').addEventListener('click', deleteUI);

    window.__fasCleanup = deleteUI;
})();
