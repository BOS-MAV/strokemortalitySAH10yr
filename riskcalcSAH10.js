/*risk calculation all cause mortality 1 year post SAH*/
function numberFormat(val, decimalPlaces) {

    var multiplier = Math.pow(10, decimalPlaces);
    return (Math.round(val * multiplier) / multiplier).toFixed(decimalPlaces);
}

function calc_risk() {
                //declare a totscore variable
               var totScore;
                //declare variables to hold the rest
                var age,ageCat,sex_t,race_t,ageWeight, diabetes, diabetesWeight, 
                    dementia, dementiaWeight, bpmeds, bpmedsWeight, TBI, TBIWeight, systolic,
                    systolicWeight,diastolic, diastolicWeight, priorKid,priorKidWeight,
                    priorHF,priorHFWeight,BMI,BMIWeight,hospLength,hospLengthWeight, marker;
               const risk = [0,0,0];
                age = parseInt($("#txtAge").val());
                // break out age by categories to compute weight
                if (age >=18 && age <= 44)
                {
                    ageCat = 1;
                    ageWeight =  -1.943186;
                }
                else if (age <= 54)
                {
                    ageCat = 2;
                    ageWeight =  -0.556388;
                }
                else if (age <= 64)
                {
                    ageCat = 3;
                    ageWeight = 0;
                }
                else if (age <=74)
                {
                    ageCat = 4;
                    ageWeight =  0.418244;
                }
                else if (age >= 75)
                {
                    ageWeight = 0.879195;
                    ageCat = 5;
                }
                sex_t=$("input[name = 'Sex']:checked").val();
                race_t = $("input[name = 'Race']:checked").val();
               //length of hospitilization
                hospLength = parseInt($("#txtHosp").val());
                //determine weights based on cat
                if (hospLength <=4)
                    hospLengthWeight = 0;
                else if (hospLength <=9)
                    hospLengthWeight = 0.228295;
                else if (hospLength <=29)
                    hospLengthWeight = 0.263533;
                else if (hospLength <=89)
                    hospLengthWeight = 0.366198;
                else
                    hospLengthWeight = 0.360906;
                // diabetes
                if ($("input[name = 'Diabetes']:checked").val() === "Yes")
                    diabetes = 1;
                else
                    diabetes = 0;
                diabetesWeight = diabetes * 0.220176;
                //dementia
                if ($("input[name = 'Dementia']:checked").val() === "Yes")
                    dementia = 1;
                else
                    dementia = 0;
                dementiaWeight = dementia * 0.367994;
                //bpmeds
                if ($("input[name='Hypertension']:checked").val()==="No")
                    bpmedsWeight =0;
                else
                    bpmedsWeight = 0.155526;
                //TBI
                if ($("input[name = 'TBIR']:checked").val() === "No")
                    TBIWeight = 0;
                else
                    TBIWeight = 0.48789;
                //prior chronic kidney disease
                if ($("input[name = 'priorKid']:checked").val() == "No")
                    priorKidWeight = 0;
                else
                    priorKidWeight= 0.143082;
                //prior heart failure
                if ($("input[name = 'priorHF']:checked").val() == "No")
                    priorHFWeight = 0;
                else
                    priorHFWeight= 0.462086;
                //blood pressure/labs
                if ($("#BP_Sys").val() ==="" || $("#BP_Sys").val() ==="M" || $("#BP_Sys").val() ==="m" )
                    {
                        marker = sex_t.trim().toLowerCase()+race_t.trim().toLowerCase()+ageCat;
                        console.log(marker);
                        bpSys = avgLabs[marker].measure[measureEnum.AVGSYS];
                    }
                    else
                    {           
                        bpSys = parseFloat($("#BP_Sys").val());
                    }
                    //compute weights for bpsys;
                    if (bpSys < 120)
                        bpSysWeight = -0.332085;
                    else if (bpSys <=129)
                        bpSysWeight = -0.048789;
                    else if (bpSys <= 139)
                        bpSysWeight = 0;
                    else 
                        bpSysWeight = 0.025629;
    
                    //diastolic
                    if ($("#BP_Dia").val() ==="" || $("#BP_Dia").val() ==="M" || $("#BP_Dia").val() ==="m" )
                        {
                            marker = sex_t.trim().toLowerCase()+race_t.trim().toLowerCase()+ageCat;
                            console.log(marker);
                            bpDia = avgLabs[marker].measure[measureEnum.AVGDIA];
                        }
                        else
                        {           
                            bpDia = parseFloat($("#BP_Dia").val());
                        }
                        //compute weights for bpdia;
                    if (bpDia < 80)
                        bpDiaWeight = 0;
                    else if (bpDia <=89)
                        bpDiaWeight = -0.472316;
                    else 
                        bpDiaWeight = -0.007423;
                // bmi
                if ($("#BMI").val() ==="" || $("#BMI").val() ==="M" || $("#BMI").val() ==="m" )
                    {
                        marker = sex_t.trim().toLowerCase()+race_t.trim().toLowerCase()+ageCat;
                        console.log(marker);
                        BMI = avgLabs[marker].measure[measureEnum.AVGBMI];
                    }
                    else
                    {           
                        BMI = parseFloat($("#BMI").val());
                    }
                    //compute weights for BMI;
                if (BMI < 18.5)
                   BMIWeight = -0.036537;
                else if (BMI <=24.9)
                    BMIWeight = 0.28547;
                else if (BMI <=29.9)
                    BMIWeight = 0;
                else if (BMI <=34.9)
                    BMIWeight = -0.073714;
                else if (BMI <=39.9)
                    BMIWeight = -0.547484;
                else
                    BMIWeight = -0.244838;
                
                xbeta = ageWeight +  hospLengthWeight + diabetesWeight + dementiaWeight + bpmedsWeight+
                        TBIWeight+priorKidWeight+priorHFWeight+bpSysWeight+bpDiaWeight+BMIWeight;
                //eXbeta = Math.exp(xbeta-2.93853);
                eXbeta = Math.exp(xbeta);
                //calculate risk and put in array
                console.log(xbeta);
                console.log(eXbeta);
                //risk = 1 - Math.pow(0.98731,eXbeta);
                risk[0] = numberFormat(Math.pow(0.9597258,eXbeta)*100,2);
                risk[1] = numberFormat(Math.pow(0.8754017,eXbeta)*100,2);
                risk[2] = numberFormat(Math.pow(0.687694,eXbeta)*100,2);
                //
                return risk;
                }   