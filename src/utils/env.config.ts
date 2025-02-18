// 환경 변수 유효성 검사
import { plainToClass } from 'class-transformer' //일반 객체를 클래스로 변환
import { IsEnum, IsNumber, Max, Min, validateSync, IsString } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces'


// 이 커스텀한 클래스의 기능은 유효성 검사 결과로 오류가 있으면 해당 오류를 문자열로 변환하고 Error 객체를 throw 하여 처리
// 그리고 모든 유효성 검사를 통과한 변환된 설정 객체를 반환합니다. 그래서 좀 더  일관성과 정확성을 보장.
class EnvironmentVariables {
    @IsString()
    @IsEnum(['development', 'production'])
    NODE_ENV: string;
  
    @IsNumber()
    @Min(0)
    @Max(65535)
    PORT: number;

    @IsString()
    MONGODB_URI: string;
  }

export const validate = <T>(
    config: Record<string, unknown>, 
    ) => {
    const validatedConfig = plainToClass(
        EnvironmentVariables, 
        config, 
        //옵션을 "true"로 설정하면 암시적 타입 변환을 활성화
        { enableImplicitConversion: true, }
    );

    //skipMissingProperties : 옵션을 false로 설정하여 누락된 속성을 체크
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        console.error("[utils][validateConfig] validateConfig error");
        throw new Error(errors.toString());
    }
    return validatedConfig;
};
