---
title: Install "udunits2" to R in a cluster
author: Runhang
date: 2022-02-17
---

### The simple reason that prompted me to install udunits2 is that I want to install rfPermute into R in HPC3 (which I do not have admin).

### In a cluster, download packaegs in R usually can be done by two ways. 1) install from CRAN mirror 2) install from github


```
chooseCRANmirror(ind=77) ### connect with a CRAN mirror to install R packages
install.packages(")
```
OR

```
install.packages("devtools") # if you have not installed "devtools" package
devtools::install_github("")
```

However, in my case, I cannot install rfPermute with either way as it said I did not have udunits2. Installing udunits to R in a cluster is not that straightforward.

I encountered all the issues I could have during the process and it spent me two days!!! Now, I am sharing my script with you if you are:

1) working with a computering cluster
2) want to install some R packages but failed


