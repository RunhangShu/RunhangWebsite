// DNA Sequence Analysis Functions
class DNAAnalyzer {
    constructor() {
        this.validBases = ['A', 'T', 'G', 'C', 'N'];
    }

    // Validate DNA sequence
    validateSequence(sequence) {
        const cleanSeq = sequence.toUpperCase().replace(/\s/g, '');
        const invalidBases = cleanSeq.split('').filter(base => 
            !this.validBases.includes(base)
        );
        
        if (invalidBases.length > 0) {
            return {
                valid: false,
                error: `Invalid bases found: ${[...new Set(invalidBases)].join(', ')}`
            };
        }
        
        return { valid: true, sequence: cleanSeq };
    }

    // Find flanking sequences
    findFlankingSequence(sequence, flankLength, targetSequence = null) {
        const validation = this.validateSequence(sequence);
        if (!validation.valid) {
            return { error: validation.error };
        }

        const cleanSeq = validation.sequence;
        
        if (cleanSeq.length < flankLength * 2) {
            return { 
                error: `Sequence too short. Need at least ${flankLength * 2} bases for ${flankLength}bp flanking regions.` 
            };
        }

        let results = [];

        if (targetSequence) {
            // Find target sequence and get flanking regions
            const targetValid = this.validateSequence(targetSequence);
            if (!targetValid.valid) {
                return { error: `Target sequence error: ${targetValid.error}` };
            }

            const target = targetValid.sequence;
            const positions = this.findAllOccurrences(cleanSeq, target);

            if (positions.length === 0) {
                return { error: `Target sequence "${target}" not found in input sequence.` };
            }

            positions.forEach((pos, index) => {
                const leftStart = Math.max(0, pos - flankLength);
                const rightEnd = Math.min(cleanSeq.length, pos + target.length + flankLength);
                
                const leftFlank = cleanSeq.substring(leftStart, pos);
                const rightFlank = cleanSeq.substring(pos + target.length, rightEnd);
                
                results.push({
                    position: pos + 1, // 1-based position
                    leftFlank: leftFlank,
                    targetSequence: target,
                    rightFlank: rightFlank,
                    fullRegion: cleanSeq.substring(leftStart, rightEnd)
                });
            });
        } else {
            // Simple flanking from ends
            const leftFlank = cleanSeq.substring(0, flankLength);
            const rightFlank = cleanSeq.substring(cleanSeq.length - flankLength);
            const core = cleanSeq.substring(flankLength, cleanSeq.length - flankLength);
            
            results.push({
                leftFlank: leftFlank,
                coreSequence: core,
                rightFlank: rightFlank,
                totalLength: cleanSeq.length
            });
        }

        return { success: true, results: results };
    }

    // Find all occurrences of target in sequence
    findAllOccurrences(sequence, target) {
        const positions = [];
        let position = sequence.indexOf(target);
        
        while (position !== -1) {
            positions.push(position);
            position = sequence.indexOf(target, position + 1);
        }
        
        return positions;
    }

    // Reverse complement
    reverseComplement(sequence) {
        const validation = this.validateSequence(sequence);
        if (!validation.valid) {
            return { error: validation.error };
        }

        const complement = {
            'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G', 'N': 'N'
        };

        const revComp = validation.sequence
            .split('')
            .reverse()
            .map(base => complement[base])
            .join('');

        return { success: true, sequence: revComp };
    }

    // Calculate GC content
    calculateGC(sequence) {
        const validation = this.validateSequence(sequence);
        if (!validation.valid) {
            return { error: validation.error };
        }

        const cleanSeq = validation.sequence;
        const gcCount = (cleanSeq.match(/[GC]/g) || []).length;
        const totalBases = cleanSeq.replace(/N/g, '').length; // Exclude N's from calculation
        
        if (totalBases === 0) {
            return { error: "No valid bases for GC calculation" };
        }

        const gcContent = (gcCount / totalBases * 100).toFixed(2);
        return { success: true, gcContent: parseFloat(gcContent) };
    }
}

// Initialize analyzer
const dnaAnalyzer = new DNAAnalyzer();

// Main analysis function
function analyzeDNASequence() {
    const sequence = document.getElementById('sequence-input').value.trim();
    const flankLength = parseInt(document.getElementById('flank-length').value) || 20;
    const targetSequence = document.getElementById('target-sequence').value.trim();
    const analysisType = document.querySelector('input[name="analysis-type"]:checked').value;

    if (!sequence) {
        showResult('<p class="error">Please enter a DNA sequence.</p>');
        return;
    }

    let result;
    let html = '';

    try {
        switch (analysisType) {
            case 'flanking':
                result = dnaAnalyzer.findFlankingSequence(sequence, flankLength, targetSequence || null);
                html = formatFlankingResults(result);
                break;
            
            case 'reverse-complement':
                result = dnaAnalyzer.reverseComplement(sequence);
                html = formatReverseComplementResult(result);
                break;
            
            case 'gc-content':
                result = dnaAnalyzer.calculateGC(sequence);
                html = formatGCResult(result);
                break;
        }

        showResult(html);
    } catch (error) {
        showResult(`<p class="error">Error: ${error.message}</p>`);
    }
}

// Formatting functions
function formatFlankingResults(result) {
    if (result.error) {
        return `<p class="error">${result.error}</p>`;
    }

    let html = '<div class="results">';
    
    result.results.forEach((res, index) => {
        html += `<div class="result-item">`;
        
        if (res.position) {
            // Target-based analysis
            html += `
                <h4>Match ${index + 1} (Position: ${res.position})</h4>
                <div class="sequence-display">
                    <div class="sequence-part">
                        <label>Left Flanking (${res.leftFlank.length} bp):</label>
                        <code class="left-flank">${res.leftFlank}</code>
                    </div>
                    <div class="sequence-part">
                        <label>Target Sequence:</label>
                        <code class="target-seq">${res.targetSequence}</code>
                    </div>
                    <div class="sequence-part">
                        <label>Right Flanking (${res.rightFlank.length} bp):</label>
                        <code class="right-flank">${res.rightFlank}</code>
                    </div>
                    <div class="sequence-part full-region">
                        <label>Full Region:</label>
                        <code>${res.fullRegion}</code>
                    </div>
                </div>
            `;
        } else {
            // Simple end-based analysis
            html += `
                <h4>Sequence Analysis</h4>
                <div class="sequence-display">
                    <div class="sequence-part">
                        <label>Left Flanking (${res.leftFlank.length} bp):</label>
                        <code class="left-flank">${res.leftFlank}</code>
                    </div>
                    <div class="sequence-part">
                        <label>Core Sequence (${res.coreSequence.length} bp):</label>
                        <code class="core-seq">${res.coreSequence}</code>
                    </div>
                    <div class="sequence-part">
                        <label>Right Flanking (${res.rightFlank.length} bp):</label>
                        <code class="right-flank">${res.rightFlank}</code>
                    </div>
                    <div class="stats">
                        <p>Total sequence length: ${res.totalLength} bp</p>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
    });
    
    html += '</div>';
    return html;
}

function formatReverseComplementResult(result) {
    if (result.error) {
        return `<p class="error">${result.error}</p>`;
    }

    return `
        <div class="results">
            <h4>Reverse Complement</h4>
            <div class="sequence-display">
                <div class="sequence-part">
                    <label>Original Sequence:</label>
                    <code>${document.getElementById('sequence-input').value.toUpperCase().replace(/\s/g, '')}</code>
                </div>
                <div class="sequence-part">
                    <label>Reverse Complement:</label>
                    <code class="reverse-comp">${result.sequence}</code>
                </div>
            </div>
        </div>
    `;
}

function formatGCResult(result) {
    if (result.error) {
        return `<p class="error">${result.error}</p>`;
    }

    const sequence = document.getElementById('sequence-input').value.toUpperCase().replace(/\s/g, '');
    
    return `
        <div class="results">
            <h4>GC Content Analysis</h4>
            <div class="gc-stats">
                <p><strong>GC Content:</strong> ${result.gcContent}%</p>
                <p><strong>Sequence Length:</strong> ${sequence.length} bp</p>
                <div class="gc-bar">
                    <div class="gc-fill" style="width: ${result.gcContent}%"></div>
                </div>
                <p class="gc-interpretation">
                    ${result.gcContent < 40 ? 'Low GC content' : 
                      result.gcContent > 60 ? 'High GC content' : 'Moderate GC content'}
                </p>
            </div>
        </div>
    `;
}

function showResult(html) {
    document.getElementById('analysis-results').innerHTML = html;
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary feedback
        const feedback = document.createElement('span');
        feedback.textContent = ' Copied!';
        feedback.style.color = 'green';
        feedback.style.fontSize = '0.8em';
        
        // Add feedback and remove after 2 seconds
        event.target.parentNode.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    });
}

// Add event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Auto-resize textarea
    const textarea = document.getElementById('sequence-input');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
});
