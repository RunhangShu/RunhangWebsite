---
title: Install "udunits2" to R in a cluster
author: Runhang
date: 2022-02-17
---

The simple reason that prompted me to install udunits2 is that I want to install rfPermute into R in HPC3 (which I do not have admin).

### In a cluster, download packaegs in R usually can be done by two ways. 1) install from CRAN mirror 2) install from github


```
chooseCRANmirror(ind=77) ### connect with a CRAN mirror to install R packages
install.packages("")
```

```
install.packages("devtools") # if you have not installed "devtools" package
devtools::install_github("")
```

However, I cannot install rfPermute with either way as it said I did not have udunits2. Installing udunits2 to R in a cluster is not that straightforward.
I encountered all the issues I could have during the process and it spent me two days!!! Now, I am sharing my script with you if you are:

- working with a computering cluster
- want to install some R packages but failed

#### Step one: create a conda enviroment for R
```
conda config --add channels conda-forge  ### An updated R version (>=4.0) is available through the conda-forge channel, so first add the channel. 
conda config --set channel_priority strict
conda create -n r-env python=3.6. ### Create the enviroment as r-env
conda install -c conda-forge r-base ### install the most updated R
conda install -c r r-essentials ### need to install essential packages, otherwise pakcages require dependencies cannot be installed properly 
conda activate r-env
```


#### step two: install from source files
```
export INSTALL_PREFIX=/data/homezvol1/runhangs/.conda/envs/r-env/
wget https://artifacts.unidata.ucar.edu/repository/downloads-udunits/2.2.28/udunits-2.2.28.tar.gz
tar xf udunits-2.2.28.tar.gz
cd udunits-2.2.28/
./configure --enable-shared --prefix /data/homezvol1/runhangs/.conda/envs/r-env/
make
make install

export LD_LIBRARY_PATH=$INSTALL_PREFIX/lib:$LD_LIBRARY_PATH
cd ..
wget https://cran.r-project.org/src/contrib/udunits2_0.13.2.tar.gz

R CMD INSTALL udunits2_0.13.2.tar.gz --configure-args="--with-udunits2-include=$INSTALL_PREFIX/include/ --with-udunits2-lib=$INSTALL_PREFIX/lib/"

```

#### An alternative way to download source file, we can directly download udunits2 from conda. However, we still need to download the source r-package from cran. Obviously, the udunits-2.2.28 
```
conda install -c conda-forge udunits2
```

