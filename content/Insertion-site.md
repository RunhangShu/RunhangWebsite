<!-- Add this to a new markdown file or static HTML -->
<div id="dna-tool">
    <h3>DNA Flanking Sequence Finder</h3>
    <textarea id="sequence-input" placeholder="Enter your DNA sequence here..."></textarea>
    <input type="number" id="flank-length" placeholder="Flanking length" value="20">
    <button onclick="findFlankingSequence()">Find Flanking Regions</button>
    <div id="result"></div>
</div>

<script>
function findFlankingSequence() {
    const sequence = document.getElementById('sequence-input').value;
    const flankLength = parseInt(document.getElementById('flank-length').value);
    
    // Your Python logic converted to JavaScript
    if (sequence.length > flankLength * 2) {
        const leftFlank = sequence.substring(0, flankLength);
        const rightFlank = sequence.substring(sequence.length - flankLength);
        const core = sequence.substring(flankLength, sequence.length - flankLength);
        
        document.getElementById('result').innerHTML = `
            <h4>Results:</h4>
            <p><strong>Left Flanking:</strong> ${leftFlank}</p>
            <p><strong>Core Sequence:</strong> ${core}</p>
            <p><strong>Right Flanking:</strong> ${rightFlank}</p>
        `;
    } else {
        document.getElementById('result').innerHTML = '<p>Sequence too short for specified flanking length.</p>';
    }
}
</script>
