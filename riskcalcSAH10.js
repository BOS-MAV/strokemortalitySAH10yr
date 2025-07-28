/*risk calculation all cause mortality 1 year post SAH*/
function numberFormat(val, decimalPlaces) {
  var multiplier = Math.pow(10, decimalPlaces);
  return (Math.round(val * multiplier) / multiplier).toFixed(decimalPlaces);
}

function calc_risk() {
  //declare a totscore variable
  var totScore;
  //declare variables to hold the rest
  var age,
    ageCat,
    sex_t,
    race_t,
    ageWeight,
    ethnicityWeight,
    diabetes,
    diabetesWeight,
    dementia,
    dementiaWeight,
    bpmeds,
    bpmedsWeight,
    TBI,
    TBIWeight,
    systolic,
    systolicWeight,
    diastolic,
    diastolicWeight,
    priorKid,
    priorKidWeight,
    priorHF,
    priorHFWeight,
    BMI,
    BMIWeight,
    hospLength,
    hospLengthWeight,
    ethnWeight,
    marker;
  const risk = [0, 0, 0];
  age = parseInt($("#txtAge").val());
  // break out age by categories to compute weight
  if (age >= 18 && age <= 44) {
    ageCat = 1;
    ageWeight = -1.92284813345861;
  } else if (age <= 54) {
    ageCat = 2;
    ageWeight = -0.648403286750554;
  } else if (age <= 64) {
    ageCat = 3;
    ageWeight = 0;
  } else if (age <= 74) {
    ageCat = 4;
    ageWeight = 0.410373044460747;
  } else if (age >= 75) {
    ageWeight = 0.919912166556678;
    ageCat = 5;
  }
  sex_t = $("input[name = 'Sex']:checked").val();
  race_t = $("input[name = 'Race']:checked").val();
  // ethnicity
  if ($("input[name='Ethnicity'].checked").val() === "hisp") {
    ethnWeight = -0.270182749319996;
  } else {
    ethnWeight = 0;
  }
  if ($("input[name = 'Diabetes']:checked").val() === "Yes") diabetes = 1;
  else diabetes = 0;
  diabetesWeight = diabetes * 0.255378381447568;
  //length of hospitilization
  hospLength = parseInt($("#txtHosp").val());
  //determine weights based on cat
  if (hospLength <= 4) hospLengthWeight = 0;
  else if (hospLength <= 9) hospLengthWeight = 0.204131971057804;
  else if (hospLength <= 29) hospLengthWeight = 0.277146770536398;
  else if (hospLength <= 89) hospLengthWeight = 0.398460633955281;
  else hospLengthWeight = 0.341075909154814;
  //dementia
  if ($("input[name = 'Dementia']:checked").val() === "Yes") dementia = 1;
  else dementia = 0;
  dementiaWeight = dementia * 0.4042777367951;
  //bpmeds
  if ($("input[name='Hypertension']:checked").val() === "No") bpmedsWeight = 0;
  else bpmedsWeight = 0.159538993896711;
  //TBI
  if ($("input[name = 'TBIR']:checked").val() === "No") TBIWeight = 0;
  else TBIWeight = 0.454179078898764;
  //prior chronic kidney disease
  if ($("input[name = 'priorKid']:checked").val() == "No") priorKidWeight = 0;
  else priorKidWeight = 0.107993047503193;
  //prior heart failure
  if ($("input[name = 'priorHF']:checked").val() == "No") priorHFWeight = 0;
  else priorHFWeight = 0.355251931937241;
  // afib
  if ($("input[name = 'afib']:checked").val() == "No") afibWeight = 0;
  else afibWeight = 0.0843319572150412;
  //blood pressure/labs
  if (
    $("#BP_Sys").val() === "" ||
    $("#BP_Sys").val() === "M" ||
    $("#BP_Sys").val() === "m"
  ) {
    marker = sex_t.trim().toLowerCase() + race_t.trim().toLowerCase() + ageCat;
    console.log(marker);
    bpSys = avgLabs[marker].measure[measureEnum.AVGSYS];
  } else {
    bpSys = parseFloat($("#BP_Sys").val());
  }
  //compute weights for bpsys;
  if (bpSys < 120) bpSysWeight = -0.258265675171348;
  else if (bpSys <= 129) bpSysWeight = -0.0421249263006711;
  else if (bpSys <= 139) bpSysWeight = 0;
  else bpSysWeight = 0.0968544413638821;

  //diastolic
  if (
    $("#BP_Dia").val() === "" ||
    $("#BP_Dia").val() === "M" ||
    $("#BP_Dia").val() === "m"
  ) {
    marker = sex_t.trim().toLowerCase() + race_t.trim().toLowerCase() + ageCat;
    console.log(marker);
    bpDia = avgLabs[marker].measure[measureEnum.AVGDIA];
  } else {
    bpDia = parseFloat($("#BP_Dia").val());
  }
  //compute weights for bpdia;
  if (bpDia < 80) bpDiaWeight = 0;
  else if (bpDia <= 89) bpDiaWeight = -0.44584969830364;
  else bpDiaWeight = -0.0189585836012978;
  // bmi
  if (
    $("#BMI").val() === "" ||
    $("#BMI").val() === "M" ||
    $("#BMI").val() === "m"
  ) {
    marker = sex_t.trim().toLowerCase() + race_t.trim().toLowerCase() + ageCat;
    console.log(marker);
    BMI = avgLabs[marker].measure[measureEnum.AVGBMI];
  } else {
    BMI = parseFloat($("#BMI").val());
  }
  //compute weights for BMI;
  if (BMI < 18.5) BMIWeight = -0.0420206292626125;
  else if (BMI <= 24.9) BMIWeight = 0.313649481899346;
  else if (BMI <= 29.9) BMIWeight = 0;
  else if (BMI <= 34.9) BMIWeight = -0.0383666779451906;
  else if (BMI <= 39.9) BMIWeight = -0.46755862071665;
  else BMIWeight = -0.225596557475277;

  xbeta =
    ageWeight +
    hospLengthWeight +
    diabetesWeight +
    dementiaWeight +
    bpmedsWeight +
    TBIWeight +
    ethnWeight +
    priorKidWeight +
    priorHFWeight +
    bpSysWeight +
    bpDiaWeight +
    BMIWeight;
  //eXbeta = Math.exp(xbeta-2.93853);
  eXbeta = Math.exp(xbeta);
  //calculate risk and put in array
  console.log(xbeta);
  console.log(eXbeta);
  //risk = 1 - Math.pow(0.98731,eXbeta);
  risk[0] = numberFormat(Math.pow(0.9597258, eXbeta) * 100, 0);
  risk[1] = numberFormat(Math.pow(0.8754017, eXbeta) * 100, 0);
  risk[2] = numberFormat(Math.pow(0.687694, eXbeta) * 100, 0);
  //
  return risk;
}
