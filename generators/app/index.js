var Generator = require('yeoman-generator');
var fs = require('fs').promises;
var path = require('path');

module.exports = class extends Generator {
    async prompting() {
        const prompts = [
            {
                type: 'input',
                name: 'productName',
                message: "What is your product's name?",
                validate: (answer) =>
                    answer.match(
                        /^[A-Za-z]{1}[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/
                    ) != null,
            },
            {
                type: 'input',
                name: 'productDescription',
                message: 'Describe your product',
            },
            {
                type: 'input',
                name: 'orgIdentifier',
                message:
                    'Your organisation identifier, in reverse domain name notation',
                store: true,
            },
        ];

        this.answers = await this.prompt(prompts);

        this.packageName = this.answers.productName
            .toLowerCase()
            .replace(/ /g, '')
            .concat('flutter');
        this.log(`Package name: ${this.packageName}`);

        this.noSuffixPackageName = this.answers.productName
            .toLowerCase()
            .replace(/ /g, '');

        this.appNamePascal = this.answers.productName
            .split(' ')
            .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
            .join('');
        this.log(`App name pascal case: ${this.appNamePascal}`);

        this.firebaseProject = `${this.answers.orgIdentifier
            .split('.')
            .join('-')}-${this.noSuffixPackageName}`;
        this.log(
            `Firebase / Google Cloud project identifier: ${this.firebaseProject}`
        );

        this.firebaseAppId = `${this.answers.orgIdentifier}.${this.packageName}`;
        this.log(`Firebase app ID: ${this.firebaseAppId}`);

        this.context = {
            packageName: this.packageName,
            appNamePascal: this.appNamePascal,
            productName: this.answers.productName,
            productDescription: this.answers.productDescription,
            firebaseProject: this.firebaseProject,
            firebaseAppId: this.firebaseAppId,
            noSuffixPackageName: this.noSuffixPackageName,
        };

        // Set destination root to create project dir with the new app's name
        this.destinationRoot(
            path.join(this.destinationRoot(), this.packageName)
        );
    }

    async _gitAddAndCommit(commitMessage) {
        await this.spawnCommand('git', ['add', '-A']);
        await this.spawnCommand('git', ['commit', '-m', commitMessage]);
    }

    async install() {
        // Run flutter create to wrap template files inside a valid Flutter project
        await this.spawnCommand('flutter', [
            'create',
            '--org',
            `${this.answers.orgIdentifier}`,
            '--project-name',
            this.packageName,
            '.',
        ]);
        await this.spawnCommand('git', ['init']);
        await this._gitAddAndCommit('Initial commit');

        // Generate freezed models and commit
        await this.spawnCommand('flutter', ['pub', 'get']);
        await this.spawnCommand('flutter', [
            'pub',
            'run',
            'build_runner',
            'build',
            '--delete-conflicting-outputs',
        ]);
        await this._gitAddAndCommit('Initial generated files (freezed models)');

        // Amend .gitignore and commit
        const gitIgnoreText = await fs.readFile(
            this.destinationPath('.gitignore'),
            'utf-8'
        );
        const newGitIgnoreText = gitIgnoreText
            .replace(/.idea\//g, '.idea/*')
            .concat(
                '\n# Node/NPM/Firebase related\nnode_modules/\n\n# Makefile .stamps\n.stamps/*\n!.stamps/*.perm\n\n# IntelliJ Flutter run configurations\n!.idea/runConfigurations\n!.idea/runConfigurations/*\n'
            );
        await fs.writeFile(
            this.destinationPath('.gitignore'),
            newGitIgnoreText,
            'utf-8'
        );
        await this._gitAddAndCommit('Add to .gitignore');

        // // Increase default Android minimum SDK version (to support Firebase libraries)
        // this.spawnCommand('sed', [
        //     '-i',
        //     '""',
        //     '-e',
        //     '"s/ flutter.minSdkVersion/ 21/g"',
        //     this.destinationPath('android/app/build.gradle'),
        // ]);

        // // Set higher iOS minimum platform version (to support Firebase libraries)
        // this.spawnCommand('sed', [
        //     '-i',
        //     '""',
        //     '-e',
        //     "\"s/# platform :ios, '9.0'/platform :ios, '10.0'/g\"",
        //     this.destinationPath('ios/Podfile'),
        // ]);
        // this._gitAddAndCommit(
        //     'Increase minimum platform/SDK versions to support Firebase libraries'
        // );
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath(),
            this.destinationPath(),
            this.context
        );

        // Dot files need to be copied explicitly
        this.fs.copyTpl(
            this.templatePath('.idea'),
            this.destinationPath('.idea'),
            this.context
        );
    }

    end() {
        this.log("Success! You're all ready to go.");
    }
};
