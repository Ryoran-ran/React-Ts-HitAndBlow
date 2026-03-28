import texts from '../../../texts/ja.json'
import type {JudgeResult} from '../../common/function/type.ts'

export const MAX_DIGITS = 4

const DIGIT_ORDER = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const

export function getAvailableDigitValues(useButton: number): string[] {
    const maxButtons = Math.max(0, Math.min(useButton, DIGIT_ORDER.length))
    return DIGIT_ORDER.slice(0, maxButtons)
}

export function addDigit(current: string, digit: number ,maxDigits: number ,useButton: number): string {
    const nextDigit = String(digit)
    const availableDigits = getAvailableDigitValues(useButton)
    if (current.length >= maxDigits || !availableDigits.includes(nextDigit)) return current
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
    const availableDigits = getAvailableDigitValues(useButton)

    if (ruleDuplication) {
        // 重複あり: 毎桁ランダム抽選（同じ数字が出てもOK）
        return Array.from(
        { length: maxDigits },
        () => availableDigits[Math.floor(Math.random() * availableDigits.length)]
        ).join('')
    }

    // 重複なし: シャッフルして先頭maxDigits個
    if (maxDigits > availableDigits.length) {
        throw new Error(texts.errors.ruleDuplication)
    }

    const nums = [...availableDigits]
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

export const Status = {
    gameClear: 'gameClear',
    gameLimit: 'gameLimit',
    playing: 'playing'
} as const

//ステータス
export function StatusType(gameClear: boolean, gameLimit: boolean): typeof Status[keyof typeof Status] {
    if (gameClear) {
        return Status.gameClear
    }
    if (gameLimit) {
        return Status.gameLimit
    }
    return Status.playing
}
