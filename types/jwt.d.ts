// types/jwt.d.ts
declare module 'jsonwebtoken' {
  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: jwt.Secret,
    options?: jwt.SignOptions
  ): string

  export function verify(
    token: string,
    secretOrPublicKey: jwt.Secret | jwt.GetPublicKeyOrSecret,
    options?: jwt.VerifyOptions
  ): any

  // سایر توابع مورد نیاز
}