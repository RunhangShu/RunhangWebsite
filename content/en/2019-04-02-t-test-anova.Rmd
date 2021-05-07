---
title: T-test & ANOVA In R
author: ''
date: '2019-04-02'
slug: t-test-anova
categories: []
tags: []
---

   ```{r setup, include=FALSE}
knitr::opts_chunk$set(collapse=TRUE)
```


<font color=purple size=8> **One-sample t-test**</font>

<font color=purple>**when do we run one-sample t-test?**

&emsp;&emsp;You have a **continuous variables**（连续变量）, and you want to know if the variables is significantly different from a certain number. In other word, you compare the **mean** of the continuous variable with another number.
</font>

&emsp;&emsp;***For example, the instruction of a drug state this drug would not affect sleep, and you want to know if the company of this drug is cheating consumers.***

</br> &emsp;<font color=green>**we test 10 person extra sleep time after taking the drug. Thus, the we can develop a null hypothesis and an alternative hypothesis**

&emsp;&emsp;&emsp;**null hypothesis: "Extra sleep does not = 0"; **

&emsp;&emsp;&emsp;**alternative hypothesis: "Extra sleep = 0"**
</font>

```{r}
sleep # We use the dataset sleep in R, we assume group 1 is the drug
vec<-sleep$group==1 # Using a vector to extract group 1
newdata<-sleep[vec,"extra"] # Get rid of the group 2, extract "extra" column
t.test(newdata,mu=0,alternative = "two.sided")
```

&emsp;&emsp;As you can see from above, the R directly tell us "## alternative hypothesis: true mean is not equal to 0", which means the company does lie. The R default significant level is 0.05. So, when we got p-value=0.02176, we fail to reject null hypothesis and thus extra sleep does not equal to 0.

&emsp;&emsp;Furthermore, instead of using "alternative=two.sides", we can use "alternative=less" or "alternative=greater" 

<font color=purple size=8> **Two-sample t-test**</font>

<font color=purple> &emsp;&emsp;Rather than compare a bunch of continuous variable with a certain number, two-sample t-test compare two continuous variables and see if they are significantly different. 
</font>

**Example:**
</br>***Compare population ages between two countries; ***
</br>***Compare the fertility/longivity of fruit fly under two treatments***


**Again, we use the above "sleep" dataset for compare drug1 and drug2 effects on extra sleep time in R**
```{r}
vec1<-sleep$group==1 # Using a vector to extract group 1
drug1<-sleep[vec1,"extra"] # Get rid of the group 2, extract "extra" column
vec2<-sleep$group==2 # Using a vector to extract group 2
drug2<-sleep[vec2,"extra"] # Get rid of the group 1, extract "extra" column
t.test(x=drug1,y=drug2,var.equal = T) #Here, we assume the two variable have the same variance 
```
&emsp;&emsp;Hoestly, the result is a little upseting me. Even though the mean of drug1 extra sleeping time is 0.75 hours, and 2.33 hours for drug2, there is no significant difference between these two! (P-value=0.079)

&emsp;&emsp;This reminds me that just two weeks ago, in March 2019, [800 scientists rised up against statistic significance.](https://www.nature.com/articles/d41586-019-00857-9)(**I urge you to click the link and read the article**) Indeed, this is a very controversial topic all the time. Thershold of 0.05 is so arbitray and why 0.051 is not statistic significance?

<font color=purple size=8> **Paired t-test**</font>
</br>&emsp;&emsp;Actually, there is a very important prerequisite I deliberately conceal in the above two-sample t-test. The prerequisite we run a two-sample t-test is that we assume a group of 10 people consumed the drug1 and another group of 10 people consumed drug2. 

&emsp;&emsp;BUT, **what if one group is more sensitive to drugs than another group.** Therefore, it would be better if we could somehow control the individual discrepency. That is to say **we use the same group** of people to test the effect of there two drugs **instead of two groups** test one of two drugs respectively. 

&emsp;&emsp;So, a paired t-test is a way to go! What we need to do is change the "var.equal=T" to "paired=T"
```{r}
vec1<-sleep$group==1 
drug1<-sleep[vec1,"extra"] 
vec2<-sleep$group==2 
drug2<-sleep[vec2,"extra"]  
t.test(x=drug1,y=drug2,paired = T) 
```
Look! Now we have p-value=0.002833. It is safe to say the extra sleep time of comsuming drug2 is statisticly different from that of drug1. 

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;![](/r/2019-04-02-t-test-anova_files/p0.05.jpeg)

&emsp;&emsp;Paired t-test is frequently used in agricultural experiments. This is because field plots have different levels of natural soil fertility, and we could set several treatments in one plot with many plots for replicates. Likewise, some animals might naturally have a better immune system than others. It is better to apply treatments to the same unit of animals.

&emsp;&emsp;In short, for paired t-test, we designed the experiment by using one same sampling unit for controling inherent differences. 

<font color=purple size=8> **ANOVA**</font>
<font color =purple>

&emsp;&emsp;We can recall in the t-test, it either compare a bunch of continuous variables with a certain number or compare two continuous variables. However, in ANOVA, the predicator variables(X-axis ) are categorical and the response variable(Y-axis) is continuous. </font>

&emsp;&emsp;**For instance, in an insecticides experiment, the predicator variables could be insecticide1,insecticide2,insecticide3 and the response variable could be LC50**(lethal dose if 50% population were killed). 

Now, I will use ToothGrowth dataset to run ANOVA in R
```{r}
z<-ToothGrowth
library(dplyr) #load package dplyr
newdata<-mutate(z,category=paste(z$supp,z$dose)) #use mutate() function conbine two columns 
faccate<-factor(newdata$category,c("VC 0.5","VC 1","VC 2","OJ 0.5","OJ 1","OJ 2")) 
#Define each treatment as factor
plot(faccate,newdata$len,col="magenta",xlab="Treatments", cex.lab=1.5
     ,cex.axis=1,ylab="Length of Tooth") 

supp<-factor(newdata$supp,c("VC","OJ"))# Define Type of nutrition as factor
dose<-factor(newdata$dose,c("0.5","1","2")) # Define dose of nutrition as factor

fit1<-aov(newdata$len~supp) #Using aov function run ANOVA
summary(fit1)

fit2<-aov(newdata$len~dose)
summary(fit2)

fit3<-aov(newdata$len~supp+dose)
summary(fit3) 

TukeyHSD(fit3) # Tukey's "honestly significant difference" (HSD) to compare all pairwise comparisons 

fit4<-aov(newdata$len~faccate)
summary(fit4)
TukeyHSD # Tukey's "honestly significant difference" (HSD) to compare all pairwise comparisons 
```



<font color=magenta size=5> Last but not least, since both T-tests and ANOVA are linear models, so before conducting statistic test, we have to ensure following assumptions to be satisfied. </font>

<font color=green size=5> 1.Testing Homogeneity of variance </font>

**For t-test**

**None, You just run qqplot to see if each variable is normally distributed. **

**For ANOVA**

1 Run aov function
</br>fit<-aov(Y~X)

2 Calculating a plotting residuals
</br>predict<-predict.lm(fit)
</br>residuals<-Y-predict

3 Plot residuals vs. the predicted values
</br>plot(predict,residuals)
</br>abline(a=0,b=0,col="red",lwd=3,ity="dashed")

**For simple regression**
</br> Use lm() to fit a linear model 
</br> reg<- lm(Y~X)
</br> predict<-predict.lm(reg)
</br> residuals<- Y-predict
</br> plot(predict,residuals)
</br> abline(a=0,b=0,ity="dashed")

----- or---------

reg<-lim(Y~X)
</br> plot(reg\$fitted.values,reg\$residuals)
</br> abline=(h=0)

<font color=green size=5> 2.Testing for any given value of X, Y values have normally distributed errors </font>
</br>1.Standardize each residual using function rstandard()
</br>std<-rstandard()
</br>2.Using qq plot 
</br>qqnorm(std);qqline(std)
</br>hist(std) # something we also creat a histgram to see if the Residuals is normal 

<font color=green size=5> 3.Independence of observations </font>
</br> This assumption can be satisfied when we sample. Sample should be random and no bais. 

<font color=green size=5> A good predict vs. residual plot should be like the plot 1 (dots have a comparatively even distribution), if your plot like plot 2,3,4, then your data are required some transformation, such as log or squaetroot. 

![](/r/2019-04-02-t-test-anova_files/Residual-plots-for-four-type-datasets.png)

<font color=green size=5> A good qq plot shoud be like the 3rd plot bellow: 

![](/r/2019-04-02-t-test-anova_files/ZXRkL.png)
