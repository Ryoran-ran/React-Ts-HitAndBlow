export function fixButtonToDigit(maxDigits:number ,useButton:number ,ruleDuplication:boolean){
    if(!ruleDuplication){
        if(maxDigits > useButton){
            return useButton;
        }
    }
    return maxDigits;
}