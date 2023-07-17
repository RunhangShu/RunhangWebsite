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

If you are studying a single bacterial strain and not necessary need such a high-throughput like metagenomic studies do, you can pool all your samples together and send them as like **THERE IS ONLY ONE SAMPLE LOL**. But how? how do you distinguish among your samples after getting the reads from illumina sequencing. Well, you can use barcoded primers for the first round of PCR. Including a barcode in between the overhang and site-specific sequences, for instance, you will design 10 primers if you have 10 samples. The illumina index help distinguish your samples from others' samples, your barcoded primer help distinguish among your samples. 

In short, you tricked the sequencing company becuase asking them to add individual barcode in each of your sample will be so imaginable costly.
