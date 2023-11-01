---
title: Demultiplexing barcoded sequencing
author: Runhang
date: 2023-07-17

---

## Using 16S workflow to design your amplicon sequencing

If you ever want to do a deep sequencing for a small genomic region (100-500 bp), you can simply follow the well developed 16S Amplicon-seq Workflow below. 

<img width="563" alt="image" src="https://github.com/RunhangShu/RunhangWebsite/assets/45881840/70062c6d-a5ee-43b3-b70b-6a9f65b1bccb">

This usually involves two rounds of PCR. During the first PCR, you use customized-primers for the region of interest so that you can attach an overhang on each side of primer. The overhangs or illumina adapter handlers can be used to attach illumina adapters and indexes via the second round of PCR. An alternative way to this 2-step PCR is directly ligate the illumina P5/P7 adapters and indexes on your amplicon. Nowadays, each run of illumina can generate billions of reads. Sequencing companies often can offer you millions of reads with less than $100. 

## How to cut the budget?

If you are studying a single bacterial strain and not necessary need such a high-throughput like metagenomic studies do, you can pool all your samples together and send them as like **THERE IS ONLY ONE SAMPLE LOL**. But how? how do you distinguish among your samples after getting the reads from illumina sequencing. Well, you can use barcoded primers for the first round of PCR. Including a barcode in between the overhang and site-specific sequences, for instance, you will design 10 primers if you have 10 samples. The illumina index help distinguish your samples from others' samples, your barcoded primer help differentiate among your samples. In short, you tricked the sequencing company becuase asking them to add individual barcode in each of your sample will be so imaginable costly.

## Demultiplexing

The sequencing company first demultiple your "ONE sample" from others, and send to you. You start with the raw data and demultiple them again by recognizing each barcode that you manually inserted into each of you sample during the first PCR. 

I used cutadapt in this process. I am using Mac M2. The annoying part is that the new macbook is built on the Apple Silicon chip, which uses AArch64 (aka. ARM64) architecture, in contrast to the macbook before 2021 build on intel 64-bit CPU and therefore x86_64 architecture. In conda, you can see cutadapt is only supports osx-64. 
<img width="521" alt="image" src="https://github.com/RunhangShu/RunhangWebsite/assets/45881840/f295a028-d2aa-4829-b145-08f89b415416">

So you may want to create a new conda environment with osx-64 plateform. After a lot of husle, I finally managed to install cutadapt 4.4 through miniforge. Download miniforge first: https://github.com/conda-forge/miniforge; After this, my miniconda will automatically replaced by miniforge, and all old conda envs are hidden. I need to find ways to re-activate my old miniconda...

<img width="459" alt="image" src="https://github.com/RunhangShu/RunhangWebsite/assets/45881840/42ecefcf-602c-4531-b989-96daff6b4047">

```
  conda create -n intel_env
  conda activate intel_env
  conda config --env --set subdir osx-64
  conda install python=3.9
```

```
conda install -c bioconda cutadapt
## this will be downloaded from conda-forge
```

### Sort out the barcoded samples 
```
cutadapt -e 0 -g ^file:../barcodes.fasta -o "OUTPUT-{name}.fastq.gz" INPUT_file
```
**the barcodes.fasta file is formated like this**

```
>bar1
TTTGCGTC
>bar2
GGTCGCGC
>bar3
...
```

### Quantify "built-in" barcode frquency

In each of my sample, I haev "built-in" barcoded bacterial strain, and I want to know what are their distributions in the community.

```

#!/bin/bash
  
# Array of input file paths
input_files=("...01.fastq" "...02.fastq" "...03.fastq" "...04.fastq")

# Array of barcode sequences
barcodes=(
    "TTTGCGTC"
    "GGTCGCGC"
    "TCTCTCTT"
    "GTCCTGTA"
    "TGCTGTGG"
    "GTTCCCTT"
    "........"
    "........"
    "........" 
)

# Iterate over input files
for input_file in "${input_files[@]}"; do
    echo "Input file: $input_file"
    echo "-------------------"
    
    # Iterate over barcodes
    for barcode in "${barcodes[@]}"; do
        count=$("$input_file" | grep -c "$barcode")
        echo "Barcode: $barcode Count: $count"
    done
    
    echo "==================="
done
```
