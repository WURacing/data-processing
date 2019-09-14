class GenericError:

    def __init__(self, code, text, message):
        self.http_code = 500
        self.err_code = code
        self.err_text = text
        self.err_message = message
    
    def formatted_error_with_context(self, context):
        return f'{self.formatted_error()}\n{context}'

    def formatted_error(self):
        return f'{self.err_code} - {self.err_text}\n{self.err_message}'

ERR_DBC_NOT_FOUND = GenericError(
    'E001',
    'DBC Not Found',
    'The specified DBC version was not cached and could not be pulled from Git'
)

ERR_BAD_FILE = GenericError(
    'E002',
    'Bad File',
    'One of the files provided failed to conform to the appropriate naming schema'
)

ERR_BAD_DATA = GenericError(
    'E003',
    'Bad Data',
    'One of the files provided contained an incorrect column count'
)

ERR_UNSPECIFIED = GenericError(
    'E999',
    'Unspecified',
    'For an unknown reason, the server was unable to process your request'
)