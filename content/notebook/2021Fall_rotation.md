---
title: Fall in 2021
date: 2021-11-05
---


# 2021 Fall, UCI CMB program rotation 

### Author: Runhang Shu, [PhD student](www.runhangshu.com)      
### Affiliation: University of California, Irvine 
### Contact: darsonshu@gmail.com

### Date started: 2021-11-05
### Date end (last modified): 2021-11-20

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.    

**Introduction:**    
Notebook for rotation in Dr. Katrine White and Dr. Charles Glabe lab. It'll log notes, ideas and inspirations from papers I read; Save a copy of bioinformatic and statistical analysis I did for reproducible science!


# Table of contents    
* [Page 1: 2021-11-05](#id-section1) Literature review 1 - The concurrence of DNA methylation and demethylation is associated with transcription regulation
* [Page 2: 2021-11-17](#id-section2) The Brucella data (1) - use non-duplicate unique 12-mer peptide sequences to search pattersn
* [Page 3: 2021-11-20](#id-section3) The Brucella data (2) - use duplicated 12-mer peptide sequences to search pattersn



------

<div id='id-section1'/>    

### Page 1:
**Background**

In mammals DMNT (DNA methyltransferases) methylaze while TET (Ten-Eleven translocation deoxygenases) demethylaze DNA. Despite these two processes are apparently antagonizing, a few studies shed the light on the jointed effects of these two players on tumorigenesis. 

**Obstacles** (what need to be improved?)

The DNA methylation level are usually assessed by "averaging" level or calculating the methylation heterogeneity/variation. Neither of these two approaches can delineate the degree of concurrence between active methylation and demethylation (unmethylated CpGs in partially methylated reads). Additionally, although a recent mathematical model takes methylation and demethylation into account for individual CpGs in stem cells, this model is not good enough in that it does not consider the spatial coupling of concurrence methylation at adjacent CpGs, which is critical for transcription factor and cancer gene regulation.


**Objective**

To test to what extend that the two players affect cancer gene regulations. 

**Methods**

Bisulfite sequencing of embryonic stem cells of mice

**Key findings**

* Methylation concurrence represents a better metrics than traditional average methylation level and methylation variation to predict gene expression.  
* Using DMNT- and TET-knowout mice, the authors indicate that there might be hidden patterns unseen by simply using "average" methylation level. 
* Methylation concurrence is negatively correlated with gene expression.
  * Uisng public available data: WGBS and RNA-seq data from Epigenetic Roadmao Consortium 
  * DNMT3A and TET1 prevent binding of each other mainly in *TSS-proximal regions*
* Methylation concurrence is associated with the repression of tumor suppressor genes
  * TSGs (Tumor Suppressor Genes) are negatively associated with methylation concurrence
  * Cell lineage genes are positively asscoaited with methylation concurrence 
  * Housekeeping genes have no association with methylation concurrence 
* Methylation concurrence can see the unseen patterns in Undermethylated regions (UMRs) in relation to average methylation and methylation variation.

------

<div id='id-section2'/> 

### Page2:

**Processed all fasta files (txt format) in HPC3 using a bash script**

```
#!/bin/bash

#SBATCH --job-name=Bru      ## Name of the job.
#SBATCH -A CGLABE_LAB ## account to charge
#SBATCH -p free ## partition/queue name  highmem,hugemem,maxmem
#SBATCH --nodes=1            ## (-N) number of nodes to use
#SBATCH --ntasks=1           ## (-n) number of tasks to launch
#SBATCH --cpus-per-task=4    ## number of cores the job needs
#SBATCH --error=slurm-%J.err ## error log file

../pratt_package_500000/pratt fasta ./USA_naive/Bru14.txt -C% 0.5 -PL 11 -PX 1 -E 0 -FN 0 -FL 1 -ON 500
../pratt_package_500000/pratt fasta ./USA_naive/Bru15.txt -C% 0.5 -PL 11 -PX 1 -E 0 -FN 0 -FL 1 -ON 500
../pratt_package_500000/pratt fasta ./USA_naive/Bru16.txt -C% 0.5 -PL 11 -PX 1 -E 0 -FN 0 -FL 1 -ON 500
../pratt_package_500000/pratt fasta ./USA_naive/Bru17.txt -C% 0.5 -PL 11 -PX 1 -E 0 -FN 0 -FL 1 -ON 500
../pratt_package_500000/pratt fasta ./USA_naive/Bru18.txt -C% 0.5 -PL 11 -PX 1 -E 0 -FN 0 -FL 1 -ON 500
.
.
.
../pratt_package_500000/pratt fasta ./USA_naive/Bru50.txt -C% 0.5 -PL 11 -PX 1 -E 0 -FN 0 -FL 1 -ON 500
```

* Tried different C% (the minimum number of frequency of each pattern)
  * C%=0.5 and 500 patterns 
  * C%=2 and 50 patterns 
  * C%=0.5 is clearly better than C%=2, becasue the fitness score is higher in the C%=0.5 output. Moreover, C%=2 gave too many patterns of only 2 amino acids 
  * Idealy, we want to get some patterns having the lengths range between 4 to 5. 

**Principal component analysis**

* Using the output from C%=0.5, I selected the top 500 patterns for each samples (81 samples in total), the occurance of each pattern was divided by the total number of sequences. For exaple, pattern P-L-S is found in 100 different 12-nt peptides in sample 1, which has 10,000 sequences. Then, 100/10,000=0.01 is computed and the resulting matrix (81 samples x ~2000 patterns) is used to run PCA. The figure below indicates the four groups are rather similar. 


<center>
<img src="/notebook/website_pics/Fig2_0.5pct_500patterns_77samples.png" alt="PCA plot" style="zoom:50%;" />
</center>

* Neverthelss, it is important to note that I did not take the number of each sequence into account. Using P-L-S as an example again, there are 100 unique sequences that have this pattern. 100/10,000 does not precisely reflect the real percentage of that pattern because each unique sequence may be sequenced multiple times during the Illumina sequencing. For example, in the C+S+ sample (B9_Bru__peptide_2_5257 ), PLPP pattern from the 12-nt peptide grPLPPnphfr has been sequenced 5257 times! But this pattern is not even ranked as at the top nor does it have a higher fitness score. Also need to note that having doubled sequences for one pattern does not mean the concentration of the antibody for that epitope pattern is also doubled. 

**Random Forest analysis**

* Again, using the matrix of C%=0.5 with 500 patterns. 9 samples of C-S-, 14 samples of C-S+, 16 samples of C+S+, 42 samples of USA native.
* Out of bag rate is quite high (30%) when I am trying to classify four of the each group.
* Out of bag rate is low (~3%) when I made the response virable as binary (YES vs. NO) by grouping USA native with C-S- as negative, and grouping C+S+ and C-S+ as positive. 

-----

<div id='id-section3/'>

### Page3:
 
 
