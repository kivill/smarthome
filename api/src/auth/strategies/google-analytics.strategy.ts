import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class GoogleAnalyticsStrategy extends PassportStrategy(Strategy, 'google-analytics') {

    constructor(
        private configService: ConfigService,
    ) {
        super({
            clientID: "598208032292-n41uuch19cm0s3j484pqhlrimtc579mt.apps.googleusercontent.com",
            clientSecret: "-gewFnTJpmSpGzxR8-m8l01s",
            callbackURL: configService.get<string>('selfUrlBack') + '/api/v1/analytics/auth_google_ok',
            scope: ['email', 'https://www.googleapis.com/auth/analytics.readonly'],
        });
    }

    authorizationParams (): { [key: string]: string; } {
        return ({
            access_type: 'offline',
            prompt: 'consent',
        });
    };

    async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const user = {
            refreshToken,
            accessToken,
            profile
        }
        done(null, user);
    }
}