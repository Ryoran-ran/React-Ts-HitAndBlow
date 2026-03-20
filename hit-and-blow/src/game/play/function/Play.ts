import texts from '../../../texts/ja.json'
import type {JudgeResult} from '../../common/function/type.ts'

export const MAX_DIGITS = 4

export function addDigit(current: string, digit: number ,maxDigits: number ,useButton: number): string {
    if (current.length >= maxDigits || digit >= useButton ) return current
    return current + String(digit)
}

export function removeLast(current: string): string {
    return current.slice(0, -1)
}

export function checkHitAndBlow(answer: string, guess: string): JudgeResult {

    if (answer.length !== guess.length) return { hit: 0, blow: 0 }

    let hit = 0
    let blow = 0

    const hitCheck = Array(guess.length).fill(false)
    const answerUsed = Array(answer.length).fill(false)

    //Hitチェック
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === answer[i]){
            hitCheck[i] = true
            answerUsed[i] = true
            hit++
        }
        else{
            hitCheck[i] = false 
            answerUsed[i] = false
        }
    }

    //Blowチェック
    for (let i = 0; i < guess.length; i++) {
        if (!hitCheck[i]) {
            for (let j = 0; j < answer.length; j++) {
                if (!answerUsed[j] && guess[i] === answer[j]) {
                    blow++
                    answerUsed[j] = true
                    break
                }
            }
        }
    }

    return { hit, blow }
}

// 回答を作成する
export function answerSet(answer: string ,maxDigits: number ,useButton: number ,ruleDuplication: boolean){
    if(answer === ""){
        //回答生成
        return createAnswer(useButton ,maxDigits ,ruleDuplication)
    }
    console.log(answer)
    return answer

}

// 回答生成
export function createAnswer(
    useButton: number,
    maxDigits: number,
    ruleDuplication: boolean
    ): string {
    if (ruleDuplication) {
        // 重複あり: 毎桁ランダム抽選（同じ数字が出てもOK）
        return Array.from(
        { length: maxDigits },
        () => String(Math.floor(Math.random() * useButton))
        ).join('')
    }

    // 重複なし: シャッフルして先頭maxDigits個
    if (maxDigits > useButton) {
        throw new Error(texts.errors.ruleDuplication)
    }

    const nums = Array.from({ length: useButton }, (_, i) => String(i))
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[nums[i], nums[j]] = [nums[j], nums[i]]
    }
    return nums.slice(0, maxDigits).join('')
}



//クリアチェック
export function clearCheck(hit: number, length: number): boolean {
  return hit === length
}