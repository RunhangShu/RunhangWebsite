---
title: 'Bacteria-phage genome analysis : A case study from a published paper'
author: Runhang
date: 2022-07-29
---

**Author: Runhang**
**Start: 2022-07-29**
**Last update: 2022-07-29**

### System information:

- OS: Linux-4.4.0-19041-Microsoft-x86_64-with-glibc2.31 (I used Windows Subsystem for Linux - Ubuntu in Mobaxterm in a Window 10 PC)
- Memory limit (in Gb): 16
- CPU: i7-7700k (4 core)
- Python version: 3.9.12
- Conda: 4.13.0

### Bioinformatic tool overview
- Download sequences from NCBI SRA: sratoolkit v3.0.0
- Quality Check: FastQC v0.11.9
- Read Trimming and filtering: Trimmomatic v0.36
- De novo short-reads Assemler: SPAdes v3.15.4
- Assembly visualization: Bandage v0.8.1
- Mutation calling: [Breseq v0.36.1](https://barricklab.org/twiki/pub/Lab/ToolsBacterialGenomeResequencing/documentation/index.html)
- Read alignment: Bowtie2 v2.4.5 (require to run Breseq)
- R v4.0.3 (required to run Breseq)
- Mobile genetic element mapping: [MGEFinder](https://github.com/bhattlab/MGEfinder)


 
