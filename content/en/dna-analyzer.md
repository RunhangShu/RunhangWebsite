---
title: "DNA Sequence Analyzer"
date: 2025-06-23
slug: dna-analyzer
---

<link rel="stylesheet" href="/css/dna-tool.css">

# DNA Sequence Analysis Tool

This interactive tool helps you analyze DNA sequences with various functions including flanking sequence extraction, reverse complement calculation, and GC content analysis.

<div class="dna-tool">
    <div class="tool-section">
        <h3>Input Sequence</h3>
        <div class="input-group">
            <label for="sequence-input">DNA Sequence (FASTA format or plain text):</label>
            <textarea id="sequence-input" placeholder="Enter your DNA sequence here... (A, T, G, C, N allowed)
Example: ATCGATCGATCGATCGTAGCTAGCTAGC"></textarea>
        </div>
        
        <div class="input-group">
            <label>Analysis Type:</label>
            <div class="radio-group">
                <div class="radio-option">
                    <input type="radio" id="flanking" name="analysis-type" value="flanking" checked>
                    <label for="flanking">Flanking Sequences</label>
                </div>
                <div class="radio-option">
                    <input type="radio" id="reverse-comp" name="analysis-type" value="reverse-complement">
                    <label for="reverse-comp">Reverse Complement</label>
                </div>
                <div class="radio-option">
                    <input type="radio" id="gc-content" name="analysis-type" value="gc-content">
                    <label for="gc-content">GC Content</label>
                </div>
            </div>
        </div>
        
        <div id="flanking-options">
            <div class="input-group">
                <label for="flank-length">Flanking Length (bp):</label>
                <input type="number" id="flank-length" value="20" min="1" max="1000">
            </div>
            
            <div class="input-group">
                <label for="target-sequence">Target Sequence (optional - leave blank for end-based flanking):</label>
                <input type="text" id="target-sequence" placeholder="e.g., ATCG - finds this sequence and extracts flanking regions">
            </div>
        </div>
        
        <button class="analyze-button" onclick="analyzeDNASequence()">
            Analyze Sequence
        </button>
    </div>
    
    <div id="analysis-results"></div>
</div>

<script>
// Show/hide flanking options based on analysis type
document.addEventListener('DOMContentLoaded', function() {
    const radioButtons = document.querySelectorAll('input[name="analysis-type"]');
    const flankingOptions = document.getElementById('flanking-options');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'flanking') {
                flankingOptions.style.display = 'block';
            } else {
                flankingOptions.style.display = 'none';
            }
        });
    });
});
</script>

<script src="/js/dna-analyzer.js"></script>
{{< /rawhtml >}}

## How to Use

### 1. Flanking Sequences
- **Without target**: Enter a sequence and flanking length. Gets flanking regions from both ends.
- **With target**: Enter a target sequence to find within your input sequence, then extract flanking regions around each occurrence.

### 2. Reverse Complement
- Calculates the reverse complement of your DNA sequence.
- Useful for primer design and analyzing both strands.

### 3. GC Content
- Calculates the percentage of G and C bases in your sequence.
- Important for PCR optimization and melting temperature estimation.

## Features

- ✅ Input validation (only accepts valid DNA bases: A, T, G, C, N)
- ✅ Multiple analysis modes
- ✅ Handles both simple and complex sequence analysis
- ✅ Color-coded results for easy visualization
- ✅ Responsive design for mobile devices

## Example Sequences

**Test sequence**: `ATCGATCGATCGAAGCTTCGATCGATCGATCG`
- Try with flanking length: 10
- Try with target sequence: `AAGCTT` (EcoRI recognition site)
