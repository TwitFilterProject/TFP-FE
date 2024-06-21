TFP-FE (프론트엔드)
=======
이 프로젝트는 폭력적인 언어에 무방비하게 노출되는 아동·청소년들을 위한 SNS 필터링 프로그램이다.

본 서비스는 학습된 데이터, 백엔드와 연결하여 도출된 결과를 출력, React를 사용해 UI를 제작, 디자인한다.

**주요기능**
1) Facebook api를 통해 불러와진 데이터를 Main 화면에 배치, 폭력적이거나 선정적인 데이터를 가린다.
2) 닉네임을 입력 후 채팅방 입장, 입장 후 채팅 기능 사용시 폭력적이거나 선정적인 문구를 가린다.
3) 폭력적인 이미지를 구별한다.

## 설치 방법

1. 레포지토리를 클론합니다.
    ```bash
    git clone https://github.com/TwitFilterProject/TFP-FE.git
    cd TFP-FE
    ```
    
2. 필요한 패키지를 설치합니다.
    ```bash
    npm install
    ```

3. 서비스를 실행합니다
   ```bash
    npm start
    ```
   
## 라이센스

**React**
MIT License

Copyright (c) 2024 김서윤


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:


The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

