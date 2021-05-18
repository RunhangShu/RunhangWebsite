---
title: Response of the microbiome–gut–brain axis in Drosophila to amino acid deficit
author: Runhang Shu
date: "2021-05-17"
---

# Kim et al., 2021 Nature
In 2017, Leitao-Goncalves et al. (Carlos Ribeiro lab) reported, in [*Plos biology*](https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.2000862#sec002) journal, that *Drosophila melanogaster* deprived of any single eAAs showed strong craving for amino acid-rich food. This protein appetites elicited by eAA absence can be suppressed when supplemented the flies with a single or a combination of commensal bacterium. 
<center>
<img src="/en/pics/eAA-neAA.png" alt="22 types of animo acids" style="zoom:50%;" />
</center>
This earlier work on microbiome-dependent protein craving indicated essential amino acid (eAAs) and flies' commensal bacteria including *Acetobacter pomorum* and *Lactobacilli* spp. are potent modulators of feeding decisions and reproductive output. 


**Four years later, Kim et al. (Won-Jae Lee lab) revealed one of the mechanisms: [the microbiome-gut-brain axis in response to amino acid deficit](https://www.nature.com/articles/s41586-021-03522-2).** 

# Thoughts
  - I have been reading this *Nature* paper for two days, the authors did thorough invesitigations. I have no doubt that this work is a whole PhD's four-year project. 
  - The review process is frastrusting long - 14 months!!! from March 2020 to May 2021. 
  -  Won-Jae lee lab seems to have remarkblely similar ideas with Ribeiro's lab yet their behavioral experiments are not the same. The earlier work was eliminating amino acids from a halidic diet and record the flies' yeast preference or amino acid preference. They found that it is eAA, but not other nutrients, control yeast and amino acid preference. Kim et al. (2021), indead, focused on the aminoa acid preference of flies in response to AA deprivation. They first showed AA-deprived flies prefer L-EAAs (which can be metablolized, but are not synthezied internally) over D-EAAs (which cannot be metablized). Furthermore, they introduced a new factor NEAAs (non-essential amino acid) in this question and designed a neat experiment. They showed deprived flies exhibited no preference when given a choice between medium containing D-EAAs and L-NEAAs (non-essential amino acid) and that containing D-EAAs abd D-NEAAs. This means the AA preferece of AA-deprived flies in the 2017 study is resulted from the preference for EAA. 
  -  Importantly, this lab has a strong fly genetics foundation, the approaches that they used to rule out and identify novel machanisms are sound and solid. 
  -  The most dramatic thing is that the neuropeptite CNMamide, which connect gut and brain as demonstrated by this paper, is also the gene we wanted to test. We have ordered the primer several months ago. See? this is the fun part of science: great mindd think alike (英雄所见略同), we also need to realized that more estabilished lab is likely targetting these genes a couple of years eariler than others. 
  -  GFP as a gene expression reporter (qualitative, but also can be quantitative) might work better than qPCR (quantitative). 

# Rationale
  - By doing two-choice foraging assay, they showed amino-acid-deprived flies prefer essential amoni acids (EAAs) not non-essential amino acids (NEAAs), and more specifically L-EAAs (can be metabolized, but are not synthezied internally) not D-EAAs (cannot be metabolized). This observations are certainly based on Leitao-Goncalves et al. (2017) Plos paper while also extended their findings. It is quite big that deprived-flies can distinguish EAAs from NEAAs. These results indicate that inadequate intake of dietary amino acids promotes a compensatory appetite for L-EAAs.
  - To find the mechanism, they inactived a serius of genes and ruled out 1) ichemosensory ionotropic receptor *Ir76b*, which can modulate food preference and consumption; 2) *poxn*, for which the mutants' most taste cells had been transformed into other cell types; 2) *Dh44*-expressing neurons, which detect the nutritional value of sugar. 
  - Neuropeptite CNMa, released from anterior midgut (R2 region, as labeled by GFP), was markedly higher in AA-deprived flies. They also validated the expression of CNMa protein in this region by anti-CNMa immunohistochemistry.
  - What about other CNMa-expresion tissues? They also exmined this and find amino acid deficit did not elicit _CNMa expression_ in fat body or the brain. 
  - They next asked that whether it is EAAs or NEAAs deprivation alone can trigger CNMa expression in the gut? They found the expression of _CNMa_ in the gut and the preference for EAAs were induced specifically by EAA deprviation, but not by NEAA deprivation. This EAA-dependent gene upregulation was further validated by using the calcium-dependent nuclear import of LexA (CaLexA) reporter system. 
  - So far, they have domenstrated the _CNMa_-expressing enterocytes act as nutrient-sensing cells that monitor the dietary EAAs.
  - Given that CNMa is aslo present in fat body and the brain, they wonder which tissue is improtent in regulating the compensory appetite for EAAs despite they already know proteom deprivation does not enhance _CNMa_ expression in fat body or the brain using GFP as a reporter. (Why did not run a qPCR? - I guess there are molecular lover and fluorescent microscopy lover)
  - They generated _CNMa_ null mutant flies which showed impaired deprivation-induced preference for L-EAAs. 
  - Tissue specific expression of _CNMa_ in the enterocytes, but not in the fat body or the brain, of _CNMa_-mutant flies was sufficient to restore the preference for L-EAAs. 
  - Moreover, RNA interference (RNAi)-mediated knockdown of _CNMa_ in the enterocytes, but not in the fat body or the brain, blunted the preference for L-EAA.
  - They next ask how a deflict of amino acids lead to upregulation of _CNMa_? Yes, there is a correlation between lack of amino acid and CNMa in gut but what's hapening (molecular mechanisms) between this linkage?
  - The authors focused on Gcn2 and Tor, both of which have been shown to regulate cells to adapt to a low intracellular level of amoni acdis. 
  - They found found that knockdown of Gcn2 (by expression of Gcn2-RNAi) or activation of Tor (by overexpression of Tor) blocked the amino-acid-deprivation-induced expression of CNMa in the gut, but not in the fat body or the brain!!! **That means these two genes are the upstreams of CNMa expression**
  - Based on literature, they found the transcription factors, Atf4 and Mitf for Gcn2 and Tor expression, respectively. 
  - Overexpression of Atf4 and Mitf in Drosophila S2 cells enhanced the induction of _CNMa_-reporter activity, suggestion that Atf4 and Mitf serve as transcription factors for promoting CNMa expression. 
  - Enterocyte-specific inactivation of Atf4 or Mitf blunted the behavioural preference for L-EAAs during amino acid deprivation (NP1-Gal4>UAS-MitfRNAi).
  - Notably, the impaired preference for L-EAAs that was observed in these flies was completely restored to a normal level when CNMa was expressed specifically in enterocytes (NP1-Gal4>UAS-MitfRNAi + UAS-CNMa). 
  - These findings suggest that enterocytes can detect a deficiency of EAAs through the Gcn2–Atf4 and Tor–Mitf pathways, that these pathways induce CNMa expression, and that this, in turn, triggers the compensatory appetite for EAAs.
  - Literature has shown that a G-protein‐coupled receptor (GPCR), CG33693, could be a putative CNMa receptor (CNMaR). 
  - CNMaR-expressing neurons led to an impaired preference for EAAs in amino-acid-deprived flies. Conversely, conditional activation of CNMaR-expressing neurons induced a preference for EAAs even in sated flies.
  - They identified a putative gene, named it and made mutant flies lacking that gene. This is nolvety. 
  - The CNMaR mutant flies did not prefer L-EAA over D-EAA while expression of CNMaR cDNA completely restored their preference for L-EAA.
  - Later, knockdown the CNMaR or inactive the CNMaR-expressing cells block the preference for EAA.
  - **Started from this step**, they included another factor microbiome. So, they spent a large amount of time and energy really digging into the amino acid sensing and foraging preference. This really built a good foundation for not this paper but for futuer investigation in the field of microbiome-gut-brain axis.
  - CNMa expression and the preference for L-EAAs in GF flies were eliminated by colonization of the gut with A. pomorum, but not by colonization with L. plantarum. 
  - Moreover, A. pomorum-mediated inhibition of the L-EAA preference was rescued by artificial activation of CNMaR-expressing neurons.
  - They continue to identity four leucine biosynthesis genes (leuA, leuB, leuC and leuD) and three isoleucine or valine biosynthesis genes (ilvA, ilvC and ilvD) that are involved in the production of branched-chain amino acids (BCAAs) were missing in members of the genus Lactobacillus, but present in members of the genus Acetobacter.
  - Therefore, it is reasonable to hypothesize that Acetobacter-derived BCAAs (e.g., leucine) suppress the amino acid preference by inhibiting the expresion of CNMa.
  -  To prove this hypothezie, they used mutant Acetobacter that lacked leuB (AcetoΔleuB) or ilvA (AcetoΔilvA)
  -  Colonized GF flies with mutant Acetobacter lacking NEAA (such as proline, AcetoΔleuB), did not induce CNMa expression or the compensatory appetite for L-EAAs.
  -  Last, they even engineered a strain of L. plantarum that expresses seven genes mediating BCAA production that are originally not present in its genome. 
  -  Notably, the high expression of CNMa and strong preference for L-EAAs in GF flies that were colonized with AcetoΔleuB were abolished by forced activation of Tor in the enterocytes (Extended Data Fig. 10e, f), further corroborating the importance of Tor signalling in regulating CNMa expression and the compensatory appetite for L-EAAs. 
  -  Furthermore, the high expression of CNMa and strong preference for L-EAAs in GF flies mono-associated with AcetoΔleuB were completely abolished by supplementing the diet with leucine or by re-introducing leuB into the AcetoΔleuB bacteria (that is, GF flies mono-associated with the AcetoΔleuB_leuB strain).
  -  These findings show that commensal Acetobacter provides dietary BCAAs such as leucine and isoleucine, which in turn downregulate the expression of CNMa to suppress the compensatory appetite for EAAs.
