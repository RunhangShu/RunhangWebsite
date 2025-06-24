---
title: "RNA-seq analysis"
author: "Runhang"
date: "2019-12-31"
---
&emsp;&emsp;今天是二零一九年的最后一天，留学时光匆匆而过，研究生生涯已经过去四分之一。在这里，我把这个学期学了的转录组测序方法总结了一下，放在这里供同行参考讨论。

<font size=6>**Introduction** </font>

-	The present study is to trace pluripotency of human early embryos and embryonic stem cells by single cell RNA-seq. To this end, 4-cell embryo and Oocyte cells of human were dissociated into single cell isolation then the cDNAs library were prepared and sequenced on Illumina HiSeq2000 platform. 

-	More than 30 million reads were generated in each single cell sample. 

-	Three biological replicates for each cell type. 

<font size=6>**Quality Control** </font>

After sequencing, we will have fastq file. The first thing we will do is check the quality of the sequence results. 

Tool: fastqc (0.11.7)
<br />**Script: (Run the bash file in hipergator)**
```{r}
#!/bin/bash
#SBATCH --job-name=fastqc
#SBATCH --time=01:00:00
#SBATCH --mail-user=r.shu@ufl.edu
#SBATCH --mail-type=ALL
#SBATCH --output=fastqc.log
#SBATCH --error=fastqc.err
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --mem=20gb.   
#(Note: The command above is typically what we need include in a bash file, 
#in which you tell how many memories, how much time you request)
```
module load fastqc
<br />fastqc ENCFF000ESM.fastq
<br />fastqc ENCFF000ESS.fastq

*Results*
<br />Once completed, we will get html files containing basic info of the fastq file such as total reads, GC content, sequence length, and most importantly the per base sequence quality (see the figure below)
 

<img src="/en/fastqc.png" alt="" width="500px" height="300px"/> 


An acceptable sequencing result should have at least 20 quality score (0.01 error rate) across all bases. Score 30 stand for 0.001 error rate. 
When it is near the end of the reads, the quality score is below 20, so the following Trim and Filter steps are required. 

<font size=6>**Trim & Filter** </font>
<br />**Tool**: fastx_toolkit 
<br />cutadapt (process both pairs at the same time, which is better for paired-end data)
<br />**Script**: 
<br />module load fastx_toolkit/0.0.14
<br />fastq_quality_filter -i ENCFF000ESM.fastq -q 20 -p 50 -o ENCFF000ESM.filtered.fastq 
<br />fastq_quality_filter -i ENCFF000ESS.fastq -q 20 -p 50 -o ENCFF000ESS.filtered.fastq 
<br />fastqc ENCFF000ESM.filtered2.fastq
<br />fastqc ENCFF000ESS.filtered2.fastq
#get rid of reads for which 50% of the bases have quality lower that 20
fastq_quality_trimmer -i ENCFF000ESM.filtered.fastq -t 25 -l 50 -o ENCFFOOOESM.f.t.fastq 
fastq_quality_trimmer -i ENCFF000ESS.filtered.fastq -t 25 -l 50 -o ENCFFOOOESS.f.t.fastq 
#trim from the 3' end until the quality score reach 25 and then remove reads that are shorter than 50 after trimming 
<br />Then we run fastqc check the quality again 

<br /> An alternative of fastx_toolkit is cutadapt 
<br />module load cutadapt
<br />cutadapt -a AGATCGGAAGAGCACACGTCTGAACTCCAGTCAC 
<br />-AAGATCGGAAGAGCGTCGTGTAGGGAAAGAGTGTAGATCTCGGTGGTCGCCGTATCATT - -quality-base=64 -q 20 -m 50 -o ENCFF000ESM.cutadapt.fastq -p ENCFF000ESS.cutadapt.fastq ENCFF000ESM.fastq ENCFF000ESS.fastq 
<br />fastqc ENCFF000ESM.cutadapt.fastq
<br />fastqc ENCFF000ESS.cutadapt.fastq


<font size=6>**Mapping** </font>
<br />After sequence preprocessing, we can align sequencing reads to a reference (if we have reference genome). There are 2 options in term of mapping: 

-	Mapping against the Genome (Good option is only gene level quantification is needed)
-	Mapping against the Transcriptome (Good option with will annotated species)

<img src="/en/flow.png" alt="" width="400px" height="500px"/> 

<br />Tools: Bowtie2 and TopHat
<br />**Script**:
<br />module load bowtie2
# build the spliced index of human genome hg38.fa file in bowtie2
<br />bowtie2-build /ufrc/mcb4325/share/Week12/hg38.fa hg38
*use the index built by bowtie2 for mapping*
<br />module load tophat
<br />tophat2 --no-coverage-search hg38 ENCFFOOOESM.f.t.fastq ENCFFOOOESS.f.t.fastq  
*Results*:
<br />We will get a "Tophat_results" fold with accepted_hits.bam file in it. 
<br />BAM file is a compression format of SAM file
-	Binary file; Save disk (80% compression); Indexed for efficient data access; 
-	Easy to interconvert using SAMtools 
-	BAM to SAM
<br />samtools view -h name.bam > name.sam
-	Sort BAM file by chromosomal coordinates 
<br />samtools sort name.bam name.sorted

<font size=6>**Quantification** </font>

<br />**Method 1**
<br />As we already have the bam file, there is no need to assemble the reads for quantification. Again, we mapped the reads based on reference genome. Now, we quantify the reads based on reference genome (Homo_sapiens.GRCh28.86.OK.gtf file).  
<br />Tool: htseq; samtools
<br />**Scripts**: 
<br />module load samtools
<br />module load htseq
<br />samtools sort -n ../Tophat_results/Embryo1/accepted_hits.bam -o sortedE1.bam
<br />htseq-count -f bam -s no -i gene_id sortedE1.bam ./Homo_sapiens.GRCh38.86.OK.gtf > htseq_count_E1.txt

*Results*:
<br />The result file is a txt file with Ensembl gene_id (such as ENSG0000.) and the number of counts. 

**Method 2 (Assembly and then quantify)**
<br />We can assemble the read based on reference genome with cufflinks and then we get both genes and isoform(transcripts) FPKM file. 
<br />FPKM stands for Fragments Per Kilobase of transcript per Million mapped reads, which normalize the basis of gene length because the longer a read is the more count it will have. So, I think this method is better than read count.

<font size=6> **Assembly** </font> 
<br />Tool: cufflinks 
<br />**Script**:
<br />module load cufflinks
<br />cufflinks --library-type fr-firststrand -o /home/r.shu/no_ref_assembly /home/r.shu/tophat_out/accepted_hits.bam 
<br />#tophat mapped bam file was assembled without reference
<br /> OR...
<br />cufflinks -g ../hg38.gtf --library-type fr-firststrand -o /home/r.shu/g_assembly /home/r.shu/tophat_out/accepted_hits.bam
<br />#tophat mapped bam file was assmebled by GFT reference guide
<br />#hg38 gtf file is reference genome file 
<br />OR...
<br />cufflinks -G  ./hg38.gtf --library-type fr-firststrand -o /home/r.shu/G_assembly /home/r.shu/tophat_out/accepted_hits.bam
<br />#tophat mapped bam file was assembled based on transcripts existing in GFT file

Results: 
We can get gene.fpkm_tracking and isoforms.fpkm_tracking files, and importantly, we get transcripts.gtf file which can be visualized in IGV software. 
<br />The tacking.gtf files contain quantification info that we can read in R. 


<font size=6>De novo Assembly, then mapping and quantifying </font>
<br />For study organisms that are not well annotated genome, we may want to use some algorithm to assemble the raw reads together without any reference. 
<br />Tool: trinity; gmap
<br />**Script**: 
<br />module load trinity
<br />Trinity --seqType fq --max_memory 5G --left /ufrc/mcb4325/share/Week12/UHLEN1T110_R1.fastq --right /ufrc/mcb4325/share/Week12/UHLEN1T110_R2.fastq --CPU 6
<br /># we get Trinity.fasta file from this process
<br /># If we have reference genome, we can map the trinity assembly result using GMAP
<br />module load gmap
<br />gmap_build -D . -d hg38.GMAP /ufrc/mcb4325/share/Week12/hg38.fa 
<br /># -D means the directory, -d means the name of the file 
<br />cd trinity_out_dir
<br />gmap -n 1 -t 8 -f 2 -D ../ -d hg38.GMAP Trinity.fasta > Trinity.gff 
<br /># -f 2 indicate output format and produce .gff file 
<br />awk '{if ($3 == "exon") print $0}' Trinity.gff > Trinity.exon.gff

 
<br /> *Note*: De nova transcriptome assembly has higher sensitivity to discover novel transcripts and trans-spliced transcripts BUT not as sensitive as reference-based assembly to discover low-abundance transcripts.

<font size=6>Differential expression analysis </font>
<br />We then move to R for statistics analysis. By now, we have quantified the number of each exon or gene. Also, get the gene length and GC content txt file from Ensembl to check the bias 
<br />mycounts_t = read.delim("CountData.txt")  
<br />dim(mycounts)
<br />head(mycounts)

mylength_t = read.delim("gene_transcript_length.txt" ,as.is = TRUE)
<br />dim(mylength)
<br />head(mylength)

myGC_t = read.delim("gene_GC_content.txt", as.is = TRUE)
<br />dim(myGC)
<br />head(myGC)

## Experimental design
myfactors_t = data.frame("treat" = substr(colnames(mycounts_t), start = 1, stop = 1),
                       "time" = substr(colnames(mycounts_t), start = 3, stop = 3),
                       "cond" = substr(colnames(mycounts_t), start = 1, stop = 3))
<br />rownames(myfactors_t) = colnames(mycounts)
<br />head(myfactors_t)
<br />myfactors_t

## Loading R libraries to be used
if (!requireNamespace("BiocManager", quietly = TRUE))
  install.packages("BiocManager")
<br />BiocManager::install("EDASeq", version = "3.8")
<br />BiocManager::install("NOISeq", version = "3.8")
<br />library(NOISeq) 
<br />library(EDASeq) 

*Note: As the read length and GC content bias is common in Illumina sequencing, where longer read get more counts (FPKM) and low GC content get lower counts. *

**BIAS ANALYSIS with NOISeq**
########################
# Preparing data for NOISeq package
<br />mydata = NOISeq::readData(data = mycounts, factors = myfactors, gc = myGC, length = mylength)

## Length bias
<br />mylengthbias = dat(mydata, factor = "cond", norm = FALSE, type = "lengthbias")
<br />par(mfrow = c(1,2))
<br />explo.plot(mylengthbias, samples = 1)
<br />explo.plot(mylengthbias, samples = 1:8)

## GC content bias
myGCbias = dat(mydata, factor = "cond", norm = FALSE, type = "GCbias")
<br />par(mfrow = c(1,2))
<br />explo.plot(myGCbias, samples = 1)
<br />explo.plot(myGCbias, samples = 1:8)

<img src="/en/bias.png" alt="" width="800px" height="500px"/> 

## RNA composition
mycomp = dat(mydata, norm = FALSE, type = "cd")
par(mfrow = c(1,2))
explo.plot(mycomp, samples = 1:12)
explo.plot(mycomp, samples = 13:24)

#  NORMALIZATION   
# First we remove genes with 0 counts in all samples
mycounts_t = mycounts_t[rowSums(mycounts_t) > 0, ]

## Discarding genes without GC content information
genesWithGC_t = intersect(rownames(mycounts_t), myGC_t[,"gene"])
myGC_t = myGC_t[myGC_t[,"gene"] %in% genesWithGC_t,]
rownames(myGC_t) = myGC_t[,"gene"]
mycounts_t = mycounts_t[myGC_t[,"gene"],] 

head(mycounts_t)
head(myfactors_t)
## Preparing data for EDASeq package
edadata = newSeqExpressionSet(counts=as.matrix(mycounts_t), featureData=myGC_t[,2, drop = FALSE], phenoData=myfactors_t[,"cond", drop = FALSE])

## Correcting GC content bias with EDASeq package: loess method
edadata <- withinLaneNormalization(edadata,"GCcontent", which="full")
mynormdata = edadata@assayData$normalizedCounts


## Applying TMM normalization (between-samples) with NOISeq package
mynormdata = tmm(mynormdata)
head(mynormdata)

## Checking the normalization results

# More uniform distributions by TMM
par(mfrow = c(1,2))
boxplot(log(as.matrix(mycounts+1)) ~ col(mycounts), main = "Before normalization")
boxplot(log(mynormdata+1) ~ col(mynormdata), main = "After normalization")

# GC bias memoved
mydata.norm = NOISeq::readData(data = mynormdata, factors = myfactors, gc = myGC, length = mylength)
myGCbias = dat(mydata.norm, factor = "cond", norm = TRUE, type = "GCbias")
par(mfrow = c(1,2))
explo.plot(myGCbias, samples = 1)
explo.plot(myGCbias, samples = 1:8)



## Loading R libraries to be used

if (!requireNamespace("BiocManager", quietly = TRUE))
  install.packages("BiocManager")
BiocManager::install("DESeq2")
BiocManager::install("limma")
BiocManager::install("maSigPro")
BiocManager::install("statmod")
BiocManager::install("edgeR")

library(NOISeq) 
library(edgeR)
library(DESeq2)
library(limma)
library(maSigPro)
library("edgeR")

### edgeR to profile the differentially expressed genes ###
############################

cond2compare = colnames(mycounts)[c(grep("B_0", colnames(mycounts)), grep("B_6", colnames(mycounts)))]
cond2compare
mygroups = rep(c("B0", "B6"), each = 3)
mygroups

### edgeR
myedgeR = DGEList(counts = mycounts[,cond2compare], group = mygroups)
<br />myedgeR = calcNormFactors(myedgeR)  
<br />myedgeR = estimateCommonDisp(myedgeR)
<br />myedgeR = estimateTagwiseDisp(myedgeR, trend = "movingave")
<br />myedgeR = exactTest(myedgeR)
<br />names(myedgeR)
<br />head(myedgeR$table)
<br />topTags(myedgeR)
<br />myedgeR_decide = decideTestsDGE(myedgeR, adjust.method = "BH", p.value = 0.05, lfc = 0)
<br />summary(myedgeR_decide) 
#Apart from edgeR, we can also use DESeq2 and NOIseq.


<font size=6>Reduce the dimension by PCA plot</font>

<br />Though there are thousands of variables(gene expression) in each treatments, with Principal coordinate analysis plot, we can appreciate the similarity between two or more samples. 

**Script**
<br />PCA<-princomp(normal_data,cor = TRUE)
# create my PCA plot function
my_PCA_plot<- function(x, main,col=rep(c(1:6),each=3)) {
    <br />t.var<-cumsum(x$sdev^2^/sum(x$sdev^2^))
    <br />var.PC1<-round(t.var[1]*100)
    <br />var.PC2<-round((t.var[2]-t.var[1])*100)
    <br />plot(P[,1],P[,2],
         <br />main = main,
         <br />col=col,
         <br />cex=2, lwd=2,
         <br />xlim=c(min(P[,1])-0.1,max(P[,1])+0.1) ,
         <br />ylim=range(P[,2])*1.3,
         <br />xlab= paste("PC1:",var.PC1,"% expel.var", sep = ""),
         <br />ylab=paste("PC2:",var.PC2,"% expel.var", sep = "")
    )
    <br />legend(x=0.55,y=0.6,legend=c("Embryo","Oocyte"),
           <br />col =c(1:2),cex=1,bty="o",pch=1,text.font = 2,text.col = c(1:4),
          <br /> pt.cex = 1,pt.lwd = 2,xjust = 0.5,yjust = 0.5)
}
<br />apply the function I created and input the PCA dataset 
<br />my_PCA_plot(PCA, main= ("Gene expression of different cells"))

# positive values on x axis indicate the data is not centered 
<br />mydata.c<-t(apply(normal_data, 1, scale, scale=FALSE))
<br />colnames(mydata.c)<-colnames(normal_data)
<br />PCA.c<-princomp(mydata.c,cor=TRUE)
<br />my_PCA_plot(PCA.c, main="Drug doses effect on genes expression of mice")

<img src="/en/pca.png" alt="" width="800px" height="500px"/> 

<br />Top10<- sort(abs(PCA.c$scores[,1]), decreasing= TRUE)[1:10]
# Use scores ranking in PCA analysis as determinants for the top 10 differentially expressed genes.


<font size=6>Enrichment and Pathway Analysis</font>
<br />Tool: PaintOmics3

source("http://bioconductor.org/biocLite.R")
<br />biocLite("NOISeq")
<br />biocLite("goseq")
<br />biocLite("goglm")
<br />library(NOISeq) 
<br />library(goseq)

setwd("/Users/darson/Desktop/Genomics in R/Week 16/DataWeek16")
### NOISeq analysis ###
data <- read.delim("Differentiation.txt", as.is = TRUE, header = TRUE, row.names = 1) 
# normalized data
mygroups = rep(c("P", "D"), each = 3)


data.f = filtered.data(data, factor = mygroups, 
                            norm = TRUE, cv.cutoff = 200, cpm = 5) #filter low count genes
mynoiseqbio = readData(data.f, factors = data.frame("condi"=mygroups))
mynoiseqbio = noiseqbio(mynoiseqbio, norm = "n", k = NULL, factor = "condi", r = 30)
mynoiseqbio.deg = degenes(mynoiseqbio, q = 0.99)

mynoiseqbio.deg <- mynoiseqbio.deg[abs(mynoiseqbio.deg["log2FC"])> 0.3,]


# Enrichment analysis
- We obtain GO and gene length from Biomart

GOannot <- read.delim("mmuGO.txt", as.is = TRUE, header = TRUE)


# Obtain gene length
mmuLength <- read.delim("mmuLength.txt", as.is = TRUE, header = TRUE)

mmuLength <- tapply(mmuLength[,3],mmuLength[,1], median)


# Preparing data for GOseq analysis
mygenes = rownames(data.f)
mmuLength = mmuLength[mygenes]
NOISeq.DE = as.integer(mygenes %in% rownames(mynoiseqbio.deg)) # logical vector of DE
names(NOISeq.DE) = mygenes
head (NOISeq.DE,10)

## GOseq
mipwf <- nullp(NOISeq.DE, bias.data = mmuLength) 
<br />walle <- goseq(pwf = mipwf, gene2cat = GOannot, method = "Wallenius", repcnt = 2000)
<br />enriched <- walle$category[walle$over_represented_pvalue< 0.01]
<br />GO.enriched <- GOannot[match(enriched, GOannot[,2]),3]  # obtain GO names
<br />head (GO.enriched, 30)  # GO results
<br />tail (GO.enriched, 30)  # GO results

# Prepare data for Paintomics
mynoiseqbio.all = degenes(mynoiseqbio, q = 0)
<br />expr.data <- cbind (name = rownames(mynoiseqbio.all), FC = mynoiseqbio.all[,"log2FC"])
<br />write.table( expr.data, "expr.data.txt", row.names = F, col.names = T, quote = F, sep = "\t" )
<br />write.table(rownames(mynoiseqbio.deg), "DE.data.txt", row.names = F, col.names = F, quote = F, sep = "\t" )



Upload expr.data and DE.data.txt files in PaintOmics 
 

<img src="/en/paintomics.png" alt="" width="800px" height="500px"/> 













