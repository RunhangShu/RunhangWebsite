---
title: "Must know statistics in omics"
author: "Runhang"
date:  '2020-06-19'
output: html_document
---


  Many people working on omics have a strong background about the biological
pipeline and principle of NGS. But many at least folks around me seems like lack a
solid background about statistics to handle and interpret the sequencing results.
Here, I would like to highlight the statistical and computational skills we need
for analyzing amplicon data, RNA-seq data and Metabolomic data.


## Metabolomics as an example

Start with metabolomics is a good choice to get familiar with stats in omics because metabolomics data are identical to any other omics data but with a miniature size. For all traditional omics data, all we need for stats is a data frame with features (i.e metabolites, genes ID, bacterial taxa) in rows and treatments in columns. Single-cell RNA seq data are normally objects in R dependent on the packages and sequencing methods. If it is an object data then you cannot actually see it.

Workflow of metabolomics: spectra collection, raw data processing, statistical and functional analysis

- Parameter optimization: set a customized parameter is important;
Whether the peak detection is reliable, how to reduce noise for extracting real
compound signals

- Batch effect: Samples may change over time, needs quality control (EigenMS)

- pathway activity prediction: needs to annotate metabolites first (mummichog)

When we do an untargeted LC-MS, we often want to identify the molecule and then do
the downstream enrichment and pathway analysis. The common used database is [METLIN](https://metlin.scripps.edu/landing_page.php?pgcontent=mainPage). However determining molecule simply based on molecular mass (m/z)
is controversial because with one m/z, you often get several matched chemical compounds.
Secondly, selecting candidate features (m/z) is required good statistical skills.

## Data pre-processing matters

**log-transformation and scale**
Imagine you have 3 samples for each of two treatments, and the concentrations of a metabolite in the control are 19000,
700, and 1000, contrasting to treatment A that does not have the metabolite at all.

```
t.test(c(19000,700,1000,9000),c(0,0,0,0))
```
Surprisingly, the unadjusted p-value from the t-test is 0.37 because of the huge standard deviation of the control.

```
t.test(c(log(19000),log(700),log(1000),log(9000)),c(0,0,0,0))
```

After the log-transformation, the unadjusted p-value  is 0.002. Therefore, log-transformation is critical for

finding good candidates genes/metabolites/proteins/lipids dependent on the "omics" you are doing.

In other words, you might find a feature with 30,31,29,31 which significantly differs from control group
of 0,1,0,1, but this feature probably is not the feature you are trying to find.

**p value correction**
Remember if you have 100 metabolites, you actually did *100 times t-test* between the treatments. Statistically, there is probably 5%
chances that the results are false positive. This is also know as False Discover Rate (FDR). Therefore, we need to adjust the p-value
to draw a prudent conclusion. There are many methods to correct p-value including Bonferroni and Benjamini-Hochberg. This [thread](https://www.researchgate.net/post/What_is_your_prefered_p-value_correction_for_multiple_tests) nicely
discussed which method to choice and which is more stringent and which is less stringent. As I always joke with my ecology friend: omics statistics is old school and there is a 10-year gap when compared with the ecology-oriented statistics.
