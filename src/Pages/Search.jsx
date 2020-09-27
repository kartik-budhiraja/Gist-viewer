import {
  Row,
  Col,
  Input,
  Spin,
  Alert,
  Avatar,
  Table as AntTable,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { GithubOutlined } from "@ant-design/icons";
import { NOT_FOUND, list as listFn, ERROR } from "../Services/gist-service";
import Text from "antd/lib/typography/Text";

const { Search } = Input;
const { Column } = AntTable;

const openInNewTab = (url) => {
  // noopener,noreferrer is required for secuirty basis
  if (url) window.open(url, "_blank", "noopener,noreferrer");
};

const SearchPage = () => {
  const [gists, setGists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function effect() {
      setLoading(true);
      setGists(await listFn(username));
      setLoading(false);
    }

    if (username) effect();
  }, [username]);

  return (
    <div className="container">
      <Row>
        <Col span={24} className="search-container">
          <Text>Gist Viewer</Text>
        </Col>
        <Col span={24} className="search-container">
          <Search
            className="search"
            placeholder="Enter username"
            onSearch={(value) => setUsername(value)}
            enterButton
          />
        </Col>
      </Row>
      {loading && <Spin className="loading" />}
      {!loading && gists.length === 0 && username && (
        <Alert
          description="No gists found for this user"
          type="info"
          showIcon
        />
      )}
      {!loading && gists.message === NOT_FOUND && (
        <Alert
          message="Error"
          description="Please enter a valid github username"
          type="error"
          showIcon
        />
      )}
      {!loading && gists.message === ERROR && (
        <Alert
          message="Error"
          description="Something went wrong, please try again"
          type="error"
          showIcon
        />
      )}
      {!loading && gists?.length > 0 && <Table data={gists} />}
    </div>
  );
};

export default SearchPage;

const Table = ({ data }) => {
  return (
    <>
      <AntTable
        dataSource={data}
        pagination={{ pageSize: 20, position: ["bottomCenter"] }}
      >
        <Column
          title="Description"
          dataIndex="description"
          name="description"
        />
        <Column
          title="Files"
          dataIndex="files"
          name="files"
          render={(files) =>
            files.map((file) => (
              <Tag className="language-tag" key={file.filename} color="blue">
                {file.language}
              </Tag>
            ))
          }
        />
        <Column
          title="Forks"
          dataIndex="forkInfo"
          name="forkInfo"
          render={(forks) => (
            <Avatar.Group>
              {forks.map((fork) => (
                <Tooltip title={fork?.owner?.login} key={fork?.id}>
                  <Avatar
                    src={fork?.owner?.avatar_url}
                    onClick={() => openInNewTab(fork?.html_url)}
                  />
                </Tooltip>
              ))}
            </Avatar.Group>
          )}
        />
        <Column
          title="Action"
          dataIndex="html_url"
          name="html_url"
          render={(url) => (
            <GithubOutlined
              className="github-icon"
              onClick={() => openInNewTab(url)}
            />
          )}
        />
      </AntTable>
    </>
  );
};
